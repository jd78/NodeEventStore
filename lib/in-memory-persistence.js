"use strict"

const BaseAdapter = require("./persistence-adapter")
const _ = require("underscore")
const Loki = require("lokijs")

const _db = new Loki("NodeEventStore.json")
let _data = _db.addCollection('events')
let _snapshots = _db.addCollection('snapshots')

class InMemoryPersistenceAdapter extends BaseAdapter {
    save(events, snapshots) {
        return new Promise(resolve => {
            _.each(events, e => _data.insert(e))
            _.each(snapshots, s => _snapshots.insert(s))
            resolve()
        })
    }

    readSnapshot(id) {
        return new Promise(resolve => {
            let snapshots = _snapshots.chain().find({'streamId' : id}).simplesort("version").data()
            if(snapshots.length === 0)
                return resolve(null)
            resolve(_.last(snapshots))
        })
    }

    readEvents(id, fromVersion) {
        return new Promise(resolve => {
            let events = _data.chain().where(p => { return p.streamId == id && p.version > fromVersion }).simplesort("version").data()
            resolve(events)
        })
    }

    clean() {
        _data.removeDataOnly()
        _snapshots.removeDataOnly()
    }
}

module.exports = new InMemoryPersistenceAdapter()