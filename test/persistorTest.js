"use strict"

require("should")
const aggregate = require("./aggregate/demo")
const Persistor = require("../lib/persistor")
const inMemoryAdapter = require("../lib/in-memory-persistence-adapter")

describe('Save Aggregate', function () {
    it('Create aggregate', function () {
        let a = aggregate.create(1)
        a.initialize('name')
        a.updateName('jd')

        let persistor = new Persistor(inMemoryAdapter)

        return persistor.save(a).then(() => {
            a.uncommittedEvents.length.should.equal(0)
        })
    })
    
    it('Create aggregate with snapshot', function () {
        let a = aggregate.create(1, 2)
        a.initialize('name')
        a.updateName('jd')
        
        a.uncommittedEvents.length.should.equal(2);
        a.uncommittedSnapshots.length.should.equal(1);
        
        let persistor = new Persistor(inMemoryAdapter)

        return persistor.save(a).then(() => {
            a.uncommittedEvents.length.should.equal(0)
            a.uncommittedSnapshots.length.should.equal(0)
        })
    })

    it('get aggregate', function () {
        let a = aggregate.create(1)
        a.initialize('name')
        a.updateName('jd')

        let persistor = new Persistor(inMemoryAdapter, aggregate)

        return persistor.save(a).then(() => {
            return persistor.read(1).then(aggregate => {
                aggregate.name.should.equal('jd')
                aggregate.uncommittedEvents.length.should.equal(0)
            })
        })
    })
})