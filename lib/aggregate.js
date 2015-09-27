"use strict"
const Guid = require("guid")
const moment = require("moment")

function AggregateObj(id, snapshotEvery) {
    this.id = id
    this.version = 0
    this.uncommittedEvents = new Set()
    this.uncommittedSnapshots = new Set()
    this.snapshotEvery = snapshotEvery || 0   
}

let _aggregateObj

class Aggregate {
    constructor(id, snapshotEvery) {
        _aggregateObj = new AggregateObj(id, snapshotEvery)
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
                id: Guid.raw(),
                streamId: _aggregateObj.id,
                version: _aggregateObj.version,
                eventType: evt.constructor.name,
                timestamp: moment().utc().format(),
                payload: JSON.stringify(evt)
            }
            _aggregateObj.uncommittedEvents.add(newEvent)
        })()
        
        //Apply the event in the subclass
        this[evt.constructor.name](evt)

        if (_aggregateObj.snapshotEvery > 0 && (_aggregateObj.version % _aggregateObj.snapshotEvery === 0)) {
            (() => {
                let newSnapshot = {
                    id: Guid.raw(),
                    streamId: _aggregateObj.id,
                    version: _aggregateObj.version,
                    timestamp: moment().utc().format(),
                    payload: JSON.stringify(self.snapshot())
                }
                _aggregateObj.uncommittedSnapshots.add(newSnapshot)
            })()
        }
    }
}

module.exports = Aggregate