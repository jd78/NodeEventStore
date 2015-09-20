"use strict"

const BaseEvent = require("./baseEvent")

class TestUpdated extends BaseEvent {
    constructor(test) {
        super()
        this.test = test
    }
}

module.exports = TestUpdated