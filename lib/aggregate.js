"use strict";
const Guid = require("guid");
const moment = require("moment");

let _id;
let _version;
let _uncommittedEvents;

class Aggregate {
    constructor(id){
        _id = id;
        _version = 0;
        _uncommittedEvents = new Set()
    }
    
    get id(){
        return _id;
    }
    
    get uncommittedEvents(){
        return Array.from(_uncommittedEvents);
    }
    
    deleteEventFromUncommitted(evt){
        _uncommittedEvents.delete(evt);
    }
    
    raiseEvent(evt) {
        evt.id = _id;
        evt.version = ++_version;
        
        (() => {
            let newEvent = {
                id: Guid.create(),
                streamId: _id,
                version: _version,
                eventType: evt.constructor.name,
                timestamp: moment().utc(),
                payload: JSON.stringify(evt)
            }
            _uncommittedEvents.add(newEvent);
        })();
        
        //Apply the event in the subclass
        this[evt.constructor.name](evt);
    }
}

module.exports = Aggregate;