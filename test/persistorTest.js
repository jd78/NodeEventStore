"use strict"

require("should")
const aggregate = require("./aggregate/demo")
const Persistor = require("../lib/persistor")
const inMemoryAdapter = require("../lib/in-memory-persistence-adapter")
const sinon = require("sinon")

describe('Save Aggregate', function () {

    beforeEach(() => inMemoryAdapter.clean())

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
    
    it('get aggregate not found', function () {
        let persistor = new Persistor(inMemoryAdapter, aggregate)
    
        return persistor.read(1).then(aggregate => {
            (aggregate === null).should.be.true();
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

    it('get aggregate with snapshot', function () {
        let a = aggregate.create(1, 2)
        a.initialize('name')
        a.updateName('name2')
        a.updateName('name3')
        a.updateName('name4')
        a.updateName('final')

        let persistor = new Persistor(inMemoryAdapter, aggregate)
        let readSnapshotSpy = sinon.spy(inMemoryAdapter, "readSnapshot")
        var readEventsSpy = sinon.spy(inMemoryAdapter, "readEvents")

        return persistor.save(a).then(() => {
            return persistor.read(1).then(aggregate => {
                aggregate.name.should.equal('final')
                aggregate.uncommittedEvents.length.should.equal(0)
                aggregate.uncommittedSnapshots.length.should.equal(0)
                return readSnapshotSpy.returnValues[0].then(values => {
                    values.version.should.equal(4)
                    values.payload.should.equal('{"name":"name4"}')
                    return readEventsSpy.returnValues[0].then(events => {
                        events.length.should.equal(1);
                        events[0].version.should.equal(5)
                        events[0].payload.should.equal('{"name":"final","id":1,"version":5}')
                    })
                })
            })
        })
    })
})