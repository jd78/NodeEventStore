"use strict";

require("should");
const aggregate = require("./aggregate/demo");
const Persistor = require("../lib/persistor");
const inMemoryAdapter = require("../lib/in-memory-persistence-adapter");

describe('Save Aggregate', function() {
    it('Create aggregate', function() {
        let a = aggregate.create(1);
        a.initialize('name');
        a.updateName('jd');
        
        let persistor = new Persistor(inMemoryAdapter);
        
        return persistor.save(a).then(()=>{
            a.uncommittedEvents.length.should.equal(0);
        });
    });
})