# Mensa Münster Skill

Alexa Skill that reads you the meals from every student canteen in Münster.

### Mensa API

The Data is provided by [OpenMensa](http://doc.openmensa.org/api/v2/). Knowing this, you can easily modify this Skill to make it work with any student canteen in Germany that is supported by Openmensa.

The requests are sent to the endpoint `http://openmensa.org/api/v2/canteens/:id/days/:date/meals` that takes a `Mensa-ID` and a `date` as parameters. The meals for this day are returned in the JSON format.

You can find out the `ID` of a canteen by browsing the OpenMensa Site. The `date` parameter needs to be in the format `yyyy-mm-dd`.

### Sample requests

first, open the skill:
> Alexa, Öffne Mensa.

then ask for a specific canteen and a date (or none if you want to know todays meals):

> was gibt es nächsten Freitag im Bistro Oeconomicum?

> was gibt es in der Mensa da Vinci?

> was gibt es heute am Aasee?

or ask directly:

> Alexa, frag Mensa was es heute am Ring gibt

> Alexa, frag Mensa was es am 12.07 im Denkpause Bistro gibt.

### Useful informations and discussions

* Openmensa: [http://openmensa.org/](http://openmensa.org/)
* Thanks to @chk1 for the canteen Parser in Münster: [https://github.com/chk1/stw2openmensa](https://github.com/chk1/stw2openmensa)
* Discussion about new Mensa API (with links to the official XML API): [https://github.com/ifgi-webteam/mensaparser/issues/4#issuecomment-260331519](https://github.com/ifgi-webteam/mensaparser/issues/4#issuecomment-260331519)
