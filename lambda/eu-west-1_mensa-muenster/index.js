/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';
const Alexa = require('alexa-sdk');
const fetch = require('node-fetch');

// Alexa Skill ID
const APP_ID = 'amzn1.ask.skill.916c2631-2b86-4136-87f2-a7a4881fb5f4';

// constant messages and prompts
const SKILL_NAME = 'Mensa Münster';
const HELP_MESSAGE = 'Du kannst mich zum Beispiel fragen: Was gibt es in der Mensa am Ring?';
const MISSUNDERSTOOD_MESSAGE = 'Das habe ich nicht verstanden';
const REPROMPT_MESSAGE = 'Kannst du das wiederholen?';
const HELP_REPROMPT = 'Wo möchtest du heute Essen?';
const STOP_MESSAGE = 'Guten Appetit!';

// Intent Handlers
const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', 'Wie kann ich dir helfen?', HELP_MESSAGE);
  },

  'mealsIntent': function () {
    if (this.event.request.dialogState != 'COMPLETED') {
      this.emit(':delegate');
    } else {
      const resolutions = this.event.request.intent.slots.mensa.resolutions.resolutionsPerAuthority[0];

      // if there are no proper values yet, make the user repeat
      if (resolutions.values == undefined) {
        this.emit(':ask', 'das habe ich nicht verstanden', 'kannst du das wiederholen?');
      }

      // gather request info (if a correct mensa was identified)
      const name = resolutions.values[0].value.name;
      const id = resolutions.values[0].value.id;
      const date = getCorrectDate(this.event.request.intent.slots.datum.value);
      const url = openMensaURL(id, date);
      const article = getMensaType(name); // 'in der' Mensa or 'im' Bistro

      // fetch relevant data and answer
      fetch(url)
        .then(res => res.json())
        .then((gerichte) => {
          // if all went right, we read the menu
          const speechOutput = `Am <say-as interpret-as="date" format="md">${speechFormatDate(date)}</say-as> gibt es ${article} ${name} ${getGerichteString(gerichte)}`;
          const cardTitle = name;
          const cardContent = speechOutput;

          this.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObj);
          // this.emit(':tell', `Am <say-as interpret-as="date" format="md">${speechFormatDate(date)}</say-as> gibt es ${article} ${name} ${getGerichteString(gerichte)}`);
        }).catch((err) => {
          // in case the request returned 404 (mensa is closed on the requested day)
          this.emit(':ask', `Am <say-as interpret-as="date" format="md">${speechFormatDate(date)}</say-as> ist diese Mensa anscheinend geschlossen.`, 'Möchtest du einen anderen Tag wissen?');
        });
    }
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
  },

  'AMAZON.CancelIntent': function () {
    this.emit(':tell', STOP_MESSAGE);
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', STOP_MESSAGE);
  },
};

// helper functions
function getCorrectDate(date) {
  if (date == undefined) {
    return new Date().toISOString().split('T')[0]; // get current Date formatted as yyyy-mm-dd
  } else {
    return date;
  }
}

function getMensaType(name) {
  return name.toLowerCase().startsWith('mensa') ? 'in der' : 'im';
}

function getGerichteString(gerichte) {
  const namen = gerichte.map(g => g.name);
  return [namen.slice(0, -1).join(', <break time="0.2s"/>'), namen.slice(-1)[0]].join(namen.length < 2 ? '' : ' <break time="0.2s"/> und ');
}

// input: yyyy-mm-dd
// output: mmdd
function speechFormatDate(date) {
  let pieces = date.split('-');
  return `${pieces[1]}/${pieces[2]}`;
}

function openMensaURL(id, date) {
  return `http://openmensa.org/api/v2/canteens/${id}/days/${date}/meals`;
}

// handler exports
exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
