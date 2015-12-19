"use strict"

const Aggregate = require("../../lib/aggregate")
const DemoCreated = require("../dto/demoCreated")
const NameUpdated = require("../dto/nameUpdated")
const StreetUpdated = require("../dto/streetUpdated")
const clone = require("clone")

function Demo(id) {

    function DemoObj() {
        this.name,
        this.street
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
        
        updateStreet(street, hookFn) {
            super.raiseEvent(new StreetUpdated(street), hookFn)
        }
        
        //Event Apply
        DemoCreated(payload) {
            _demoObj.name = payload.name
        }

        NameUpdated(payload) {
            _demoObj.name = payload.name
        }
        
        StreetUpdated(payload) {
            _demoObj.street = payload.street
        }
    }

    return new Demo(id);
}

module.exports = Demo