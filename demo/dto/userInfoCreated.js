"use strict"

const BaseEvent = require("./baseEvent")

class UserInfoCreated extends BaseEvent {
    constructor(name, surname, address, mobile) {
        super()
        this.name = name
        this.surname = surname
        this.address = address
        this.mobile = mobile
    }
}

module.exports = UserInfoCreated