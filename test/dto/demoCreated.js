"use strict";

const BaseEvent = require("./baseEvent");

class DemoCreated extends BaseEvent {
    constructor(name) {
        super();
        this.name = name;
    }
}

module.exports = DemoCreated;