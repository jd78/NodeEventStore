"use strict"

const Aggregate = require("../lib/aggregate")
const DemoCreated = require("./dto/demoCreated")
const TestUpdated = require("./dto/testUpdated")

class Demo extends Aggregate {

    constructor(id) {
        super(id)

        this.test
    }

    static create(id) {
        return new Demo(id)
    }
    
    //Mutators
    Initialize(test) {
        super.raiseEvent(new DemoCreated(test))
    }

    UpdateTest(test) {
        super.raiseEvent(new TestUpdated(test))
    }
    
    //Apply
    DemoCreated(payload) {
        this.test = payload.test
    }

    TestUpdated(payload) {
        this.test = payload.test
    }
}

module.exports = {
    create: Demo.create
}