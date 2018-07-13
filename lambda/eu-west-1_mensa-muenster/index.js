/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
// TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Mensa Münster';
const HELP_MESSAGE = 'Du kannst mich zum Beispiel fragen: Was gibt es in der Mensa am Ring?';
const HELP_REPROMPT = 'Wo möchtest du heute Essen?';
const STOP_MESSAGE = 'Guten Appetit!';

//=========================================================================================================================================
// Intent Handlers
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('mealsIntent');
    },
    'mealsIntent': function () {
        this.emit(':tell', 'Hallo, willkommen beim Münsteraner Mensa Skill!')
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

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
