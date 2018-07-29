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
      const name = this.event.request.intent.slots.mensa.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      const id = this.event.request.intent.slots.mensa.resolutions.resolutionsPerAuthority[0].values[0].value.id;
      const date = this.event.request.intent.slots.datum.value;
      const url = openMensaURL(id, date);
      fetch(url)
        .then(res => res.json())
        .then((gerichte) => {
          this.emit(':tell', `in der ${name} gibt es als erstes gericht ${gerichte[0].name}`);
        })
        .catch((err) => {
          // date not defined here, only definde openMensaURL when mensa is closed today
          this.emit(':ask', `Am <say as interpret-as="date">${date.replace(/-/g, '')}</say as> ist diese Mensa anscheinend geschlossen.`, 'Möchtest du einen anderen Tag wissen?');
        });
    }
  },

  'AMAZON.HelpIntent': function () {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },

  'AMAZON.CancelIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },

  'AMAZON.StopIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
};

// helper functions
function openMensaURL(id, date) {
  if (date == undefined) {
    date = new Date().toISOString().split('T')[0]; // get current Date formatted as yyyy-mm-dd
  }
  return `http://openmensa.org/api/v2/canteens/${id}/days/${date}/meals`;
}

// handler exports
exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
