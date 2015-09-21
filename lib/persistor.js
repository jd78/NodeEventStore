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
            this.persistorAdapter.read(id).then(events => {
                if (events.length === 0)
                    resolve(null)
                let aggregate = this.aggregate.create(id)
                _.each(events, (e) => {
                    aggregate[e.eventType](JSON.parse(e.payload))
                })
                resolve(aggregate)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = Persistor