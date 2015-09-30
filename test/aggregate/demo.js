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

    constructor(id) {
        super(id)
        _demoObj = new DemoObj()
    }
    
    //Snapshot 
    snapshot() {
        return clone(_demoObj)
    }

    applySnapshot(payload) {
        _demoObj.name = payload.name
    }
    //end

    static create(id) {
        return new Demo(id)
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