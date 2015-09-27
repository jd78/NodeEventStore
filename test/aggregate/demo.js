"use strict"

const Aggregate = require("../../lib/aggregate")
const DemoCreated = require("../dto/demoCreated")
const NameUpdated = require("../dto/nameUpdated")
const clone = require("clone")

function DemoObj(){
    this.name
}

let _demoObj

class Demo extends Aggregate {

    constructor(id, snapshotEvery) {
        super(id, snapshotEvery)
        _demoObj = new DemoObj()
    }
    
    //Snapshot 
    snapshot() {
        console.log(clone(_demoObj))
        return clone(_demoObj)
    }

    applySnapshot(payload) {
        _demoObj.name = payload.name //version should be passed into the create constructor, in undefined will be 0
    }
    //end

    static create(id, snapshotEvery) {
        return new Demo(id, snapshotEvery)
    }
    
    //Query
    get name() {
        return _demoObj.name
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
        _demoObj.name = payload.name
    }

    NameUpdated(payload) {
        _demoObj.name = payload.name
    }
}

module.exports = {
    create: Demo.create
}