"use strict";

const BaseEvent = require("./baseEvent");

class NameUpdated extends BaseEvent {
    constructor(name) {
        super();
        this.name = name;
    }
}

module.exports = NameUpdated;