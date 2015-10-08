"use strict";

const BaseEvent = require("./baseEvent");

class StreetUpdated extends BaseEvent {
    constructor(street) {
        super();
        this.street = street;
    }
}

module.exports = StreetUpdated;