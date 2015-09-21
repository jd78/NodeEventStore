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

    read(id) {
        return new Promise(resolve => {
            let events = _.where(Array.from(_data), { streamId: id })
            resolve(events)
        })
    }
}

module.exports = new InMemoryPersistenceAdapter()