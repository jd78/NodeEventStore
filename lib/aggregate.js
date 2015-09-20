"use strict";
const Guid = require("guid");
const moment = require("moment");

let _id;
let _version;
let _uncommittedEvents;
let _uncommittedSnapshots;
let _snapshotEvery;

class Aggregate {
    constructor(id, snapshotEvery) {
        _id = id;
        _version = 0;
        _snapshotEvery = snapshotEvery || 0;
        _uncommittedEvents = new Set();
        _uncommittedSnapshots = new Set();
    }

    get id() {
        return _id;
    }
    
    get version(){
        return _version;
    }

    get uncommittedEvents() {
        return Array.from(_uncommittedEvents);
    }
    
    get uncommittedSnapshots() {
        return Array.from(_uncommittedSnapshots);
    }
    
    snapshot(){
        throw new Error("snapshot not implemented");
    }
    
    applySnapshot(payload){
        throw new Error("applySnapshot not implemented");
    }

    deleteEventFromUncommitted(evt) {
        _uncommittedEvents.delete(evt);
    }

    raiseEvent(evt) {
        var self = this;
        evt.id = _id;
        evt.version = ++_version;

        (() => {
            let newEvent = {
                id: Guid.raw(),
                streamId: _id,
                version: _version,
                eventType: evt.constructor.name,
                timestamp: moment().utc().format(),
                payload: JSON.stringify(evt)
            }
            _uncommittedEvents.add(newEvent);
        })();
        
        //Apply the event in the subclass
        this[evt.constructor.name](evt);
        
        if(_snapshotEvery > 0 && (_version % _snapshotEvery === 0)){
            (() => {
                let newSnapshot = {
                    id: Guid.raw(),
                    streamId: _id,
                    version: _version,
                    timestamp: moment().utc().format(),
                    payload: JSON.stringify(self.snapshot())
                }
                _uncommittedSnapshots.add(newSnapshot);
            })();
        }
    }
}

module.exports = Aggregate;