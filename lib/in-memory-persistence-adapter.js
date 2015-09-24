"use strict"

const BaseAdapter = require("./persistence-adapter")
const _ = require("underscore")

let _data = new Set()
let _snapshots = new Set();

class InMemoryPersistenceAdapter extends BaseAdapter {
    save(events, snapshots) {
        return new Promise(resolve => {
            _.each(events, e => _data.add(e))
            _.each(snapshots, s => _snapshots.add(s))
            resolve()
        })
    }
    
    readSnapshot(id) {
        return new Promise(resolve => {
            resolve(_.last(_.where(Array.from(_snapshots), { streamId: id })))
        })
    }

    readEvents(id, fromVersion) {
        return new Promise(resolve => {
            let events = _.filter(Array.from(_data), p => { return p.streamId == id && p.version > fromVersion })
            resolve(events)
        })
    }
    
    clean(){
        _data = new Set();
        _snapshots = new Set();
    }
}

module.exports = new InMemoryPersistenceAdapter()