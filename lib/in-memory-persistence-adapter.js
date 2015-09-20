"use strict";

const BaseAdapter = require("./persistence-adapter");
const _ = require("underscore");

let _data = new Set();

class InMemoryPersistenceAdapter extends BaseAdapter {
    save(evt) {
        _data.add(evt);
        return new Promise(resolve => resolve());
    }

    read(id) {
        return new Promise(resolve => {
            let events = _.where(Array.from(_data), { streamId: id });
            resolve(events);
        });
    }
}

module.exports = new InMemoryPersistenceAdapter();