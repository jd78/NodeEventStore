"use strict"
const _ = require("underscore")
const cache = require("./cache")
const configuration = require("./configuration")
const hook = require("./hook")
const serializer = require("./serializer")()

class Persistor {
    constructor(aggregateClass) {
        this.persistorAdapter = configuration.repository
        this.aggregate = aggregateClass
    }

    save(aggregate) {
        var self = this
        return new Promise((resolve, reject) => {
            self.persistorAdapter.save(aggregate.uncommittedEvents, aggregate.uncommittedSnapshots).then(() => {
                _.each(aggregate.uncommittedEvents, e => {
                    hook.tryExecHook(e.eventType, serializer.deserialize(e.payload)) 
                    aggregate.deleteEventFromUncommitted(e) 
                })
                _.each(aggregate.uncommittedSnapshots, e => aggregate.deleteSnapshotFromUncommitted(e))
                cache.setKey(aggregate.id, aggregate)
                resolve()
            }).catch(err => {
                return reject(err)
            })
        })
    }

    read(id) {
        return new Promise((resolve, reject) => {
            cache.getKey(id).then(aggregate => {
                if(aggregate)
                    return resolve(aggregate)
                this.persistorAdapter.readSnapshot(id).then(snapshot => {
                    return snapshot
                }).then(snapshot => {
                    let version = !snapshot ? 0 : snapshot.version
                    return { snapshot: snapshot, version: version }
                }).then(obj => {
                    let aggregate = new this.aggregate(id)
                    if (obj.snapshot)
                        aggregate.applySnapshot(serializer.deserialize(obj.snapshot.payload))
                    return { snapshot: obj.snapshot, version: obj.version, aggregate: aggregate }
                }).then(obj => {
                    this.persistorAdapter.readEvents(id, obj.version).then(events => {
                        if (!obj.snapshot && events.length === 0)
                            return resolve(null)
                        _.each(events, (e) => {
                            obj.aggregate[e.eventType](serializer.deserialize(e.payload))
                        })
                        resolve(obj.aggregate)
                    })
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }
}

module.exports = Persistor