"use strict"
const uuid = require("uuid")
const moment = require("moment")
const configuration = require("./configuration")
const serializer = require("./serializer")()

function AggregateObj(id) {
    this.id = id
    this.version = 0
    this.uncommittedEvents = new Set()
    this.uncommittedSnapshots = new Set() 
}

let _aggregateObj

class Aggregate {
    constructor(id) {
        _aggregateObj = new AggregateObj(id)
    }

    get id() {
        return _aggregateObj.id
    }

    get version() {
        return _aggregateObj.version
    }

    get uncommittedEvents() {
        return Array.from(_aggregateObj.uncommittedEvents)
    }

    get uncommittedSnapshots() {
        return Array.from(_aggregateObj.uncommittedSnapshots)
    }

    snapshot() {
        throw new Error("snapshot not implemented")
    }

    applySnapshot(payload) {
        throw new Error("applySnapshot not implemented")
    }

    deleteEventFromUncommitted(evt) {
        _aggregateObj.uncommittedEvents.delete(evt)
    }

    deleteSnapshotFromUncommitted(evt) {
        _aggregateObj.uncommittedSnapshots.delete(evt)
    }

    raiseEvent(evt) {
        var self = this
        evt.id = _aggregateObj.id
        evt.version = ++_aggregateObj.version;

        (() => {
            let newEvent = {
                id: uuid.v4(),
                streamId: _aggregateObj.id,
                version: _aggregateObj.version,
                eventType: evt.constructor.name,
                timestamp: moment().utc().format(),
                payload: serializer.serialize(evt)
            }
            _aggregateObj.uncommittedEvents.add(newEvent)
        })()
        
        //Apply the event in the subclass
        this[evt.constructor.name](evt)
        
        if (configuration.snapshotEvery > 0 && (_aggregateObj.version % configuration.snapshotEvery === 0)) {
            (() => {
                let newSnapshot = {
                    id: uuid.v4(),
                    streamId: _aggregateObj.id,
                    version: _aggregateObj.version,
                    timestamp: moment().utc().format(),
                    payload: serializer.serialize(self.snapshot())
                }
                _aggregateObj.uncommittedSnapshots.add(newSnapshot)
            })()
        }
    }
}

module.exports = Aggregate