"use strict"

const NodeEventStore = require("NodeEventStore")
const UserInfoCreated = require("./dto/userInfoCreated")
const AddressUpdated = require("./dto/addressUpdated")
const MobileUpdated = require("./dto/mobileUpdated")
const clone = require("clone")

function UserInfoObj(){
    this.name
    this.surname
    this.address
    this.mobile
}

let _userInfo

class UserInfo extends NodeEventStore.Aggregate {

    constructor(id) {
        super(id)
        _userInfo = new UserInfoObj()
    }

    static create(id) {
        return new UserInfo(id)
    }
    
    snapshot() {
        return clone(_userInfo)
    }

    applySnapshot(payload) {
        _userInfo = payload
    }
    
    //Mutators
    initialize(name, surname, address, mobile) {
        super.raiseEvent(new UserInfoCreated(name, surname, address, mobile))
    }

    updateAddress(address) {
        super.raiseEvent(new AddressUpdated(address))
    }
    
    updateMobile(mobile, hookFn) {
        super.raiseEvent(new MobileUpdated(mobile), hookFn)
    }
    
    //Apply
    UserInfoCreated(payload) {
        _userInfo.name = payload.name
        _userInfo.surname = payload.surname
        _userInfo.address = payload.address
        _userInfo.mobile = payload.mobile
    }

    AddressUpdated(payload) {
        _userInfo.address = payload.address
    }
    
    MobileUpdated(payload) {
        _userInfo.mobile = payload.mobile
    }
}

module.exports = {
    create: UserInfo.create
}