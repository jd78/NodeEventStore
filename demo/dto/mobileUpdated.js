"use strict"

const BaseEvent = require("./baseEvent")

class MobileUpdated extends BaseEvent {
    constructor(mobile) {
        super()
        this.mobile = mobile
    }
}

module.exports = MobileUpdated