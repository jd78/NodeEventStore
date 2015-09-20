"use strict"

const Aggregate = require("../../lib/aggregate")
const DemoCreated = require("../dto/demoCreated")
const NameUpdated = require("../dto/nameUpdated")

let _name

let createSnapshot = () => {
    return { name: _name }
}

class Demo extends Aggregate {

    constructor(id, snapshotEvery) {
        super(id, snapshotEvery)
        _name = null
    }
    
    //Snapshot 
    snapshot() {
        return createSnapshot()
    }

    applySnapshot(payload) {
        _name = payload.name //version should be passed into the create constructor, in undefined will be 0
    }
    //end

    static create(id, snapshotEvery) {
        return new Demo(id, snapshotEvery)
    }
    
    //Query
    get name() {
        return _name
    }
    
    //Mutators
    initialize(name) {
        super.raiseEvent(new DemoCreated(name))
    }

    updateName(name) {
        super.raiseEvent(new NameUpdated(name))
    }
    
    //Event Apply
    DemoCreated(payload) {
        _name = payload.name
    }

    NameUpdated(payload) {
        _name = payload.name
    }
}

module.exports = {
    create: Demo.create
}