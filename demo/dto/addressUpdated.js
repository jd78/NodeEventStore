"use strict"

const BaseEvent = require("./baseEvent")

class AddressUpdated extends BaseEvent {
    constructor(address) {
        super()
        this.address = address
    }
}

module.exports = AddressUpdated