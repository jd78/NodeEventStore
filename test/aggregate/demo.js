"use strict"

const Aggregate = require("../../lib/aggregate");
const DemoCreated = require("../dto/demoCreated");
const NameUpdated = require("../dto/nameUpdated");

let _name;

class Demo extends Aggregate {
    
    constructor(id){
        super(id);
        _name = null;
    }
    
    static create(id){
        return new Demo(id);
    }
    
    //Query
    get name(){
        return _name;
    }
    
    //Mutators
    initialize(name){
        super.raiseEvent(new DemoCreated(name));
    }
    
    updateName(name){
        super.raiseEvent(new NameUpdated(name));
    }
    
    //Apply
    DemoCreated(payload){
        _name = payload.name;
    }
    
    NameUpdated(payload){
        _name = payload.name;
    }
}

module.exports = {
    create: Demo.create
}