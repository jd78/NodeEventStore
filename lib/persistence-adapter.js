"use strict";

class PersistenceAdapter {
    //return a promise
    save(aggregate) {
        throw new Error("save not implemented");
    }
    //return a promise
    read(id) {
        throw new Error("read not implemented");
    }
}

module.exports = PersistenceAdapter;