"use strict"

class PersistenceAdapter {
    //return a promise
    save(events, snapshots) {
        throw new Error("save not implemented")
    }
    
    //return a promise
    readSnapshot(id) {
        throw new Error("readSnapshot not implemented")
    }
    
    //return a promise
    readEvents(id, fromVersion) {
        throw new Error("readEvents not implemented")
    }
}

module.exports = PersistenceAdapter