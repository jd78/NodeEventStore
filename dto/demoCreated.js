"use strict";

const BaseEvent = require("./baseEvent");

class DemoCreated extends BaseEvent {
    constructor(test) {
        super();
        this.test = test;
    }
}

module.exports = DemoCreated;