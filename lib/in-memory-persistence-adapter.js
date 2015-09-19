"use strict";

const BaseAdapter = require("./persistence-adapter");
const _ = require("./underscore");

let _data = new Set();

class InMemoryPersistenceAdapter extends BaseAdapter {
    save(evt) {
        _data.add(evt);
        return new Promise(resolve => resolve());
    }
    
    read(id){
        let events = _.findWhere(Array.from(_data), {streamId: id});
        return new Promise(resolve => {
           resolve(events); 
        });
    }
}

module.exports = new InMemoryPersistenceAdapter();