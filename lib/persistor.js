"use strict";
const _ = require("underscore");
const Aggregate = require("../demo");

class Persistor {
    constructor(persistorAdapter){
        this.persistorAdapter = persistorAdapter;
    }
    
    saveAggregate(aggregate) {
        var self = this;
        return new Promise((resolve, reject) => {
            _.each(aggregate.uncommittedEvents, e => {
                self.persistorAdapter.save(e).then(()=>{
                    aggregate.deleteEventFromUncommitted(e);    
                }).catch(err =>{
                    return reject(err);
                });
            })
            resolve();
        })
    }
    
    GetAggregate(id){
        return new Promise((resolve, reject) => {
            this.persistorAdapter.read(id).then(events => {
                if(events.length === 0)
                    resolve(null);
                var aggregate = Aggregate.create(id);
                _.each(events, (e) => {
                   aggregate[e.eventType](e.payload); 
                });
                resolve(aggregate);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = Persistor;