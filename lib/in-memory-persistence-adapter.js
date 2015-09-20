"use strict"

const BaseAdapter = require("./persistence-adapter")
const _ = require("underscore")

let _data = new Set()

class InMemoryPersistenceAdapter extends BaseAdapter {
    save(events) {
        return new Promise(resolve => {
            _.each(events, e => _data.add(e))
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