"use strict"
const _ = require("underscore")

class Persistor {
    constructor(persistorAdapter, aggregateClass) {
        this.persistorAdapter = persistorAdapter
        this.aggregate = aggregateClass
    }

    save(aggregate) {
        var self = this
        return new Promise((resolve, reject) => {
            self.persistorAdapter.save(aggregate.uncommittedEvents, aggregate.uncommittedSnapshots).then(() => {
                _.each(aggregate.uncommittedEvents, e => aggregate.deleteEventFromUncommitted(e))
                _.each(aggregate.uncommittedSnapshots, e => aggregate.deleteSnapshotFromUncommitted(e))
            }).catch(err => {
                return reject(err)
            })
            resolve()
        })
    }

    read(id) {
        return new Promise((resolve, reject) => {
            this.persistorAdapter.readSnapshot(id).then(snapshot => {
                return snapshot
            }).then(snapshot => {
                if (!snapshot)
                    return { snapshot: snapshot, events: this.persistorAdapter.readEvents(id, 0) };
                return { snapshot: snapshot, events: this.persistorAdapter.readEvents(id, snapshot.version) };
            }).then(obj => {
                let aggregate = this.aggregate.create(id)
                if (obj.snapshot)
                    aggregate.applySnapshot(obj.snapshot.payload)
                return { snapshot: obj.snapshot, events: obj.events, aggregate: aggregate }
            }).then(obj => {
                obj.events.then(events => {
                    if (!obj.snapshot && events.length === 0)
                        return resolve(null)
                    _.each(events, (e) => {
                        obj.aggregate[e.eventType](JSON.parse(e.payload))
                    })
                    resolve(obj.aggregate)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = Persistor