"use strict"

require("should")
const aggregate = require("./aggregate/demo")

describe('Aggregate Test', () => {
    it('Create aggregate', () => {
        let a = aggregate.create(1)
        a.id.should.equal(1)
    })

    it('update aggregate', () => {
        let a = aggregate.create(1)
        a.initialize('test')
        a.name.should.equal('test')

        a.uncommittedEvents.length.should.equal(1)
        let evt = a.uncommittedEvents[0]

        evt.streamId.should.equal(1)
        evt.version.should.equal(1)
        evt.eventType.should.equal('DemoCreated')
        evt.payload.should.equal('{"name":"test","id":1,"version":1}')
    })

    it('update aggregate twice', () => {
        let a = aggregate.create(1)
        a.initialize('test')
        a.updateName('jd')

        a.name.should.equal('jd')

        a.uncommittedEvents.length.should.equal(2)

        let evt = a.uncommittedEvents[1]
        evt.version.should.equal(2)
    })

    it('if snapshot not defined, ignore snapshot', () => {
        let a = aggregate.create(1)
        a.initialize('test')
        a.updateName('jd')

        a.uncommittedSnapshots.length.should.equal(0)
    })

    it('create snapshot', () => {
        let a = aggregate.create(1, 2)
        a.initialize('test')
        a.updateName('jd')

        a.uncommittedSnapshots.length.should.equal(1)

        let snapshots = a.uncommittedSnapshots[0]
        snapshots.version.should.equal(2)
        snapshots.streamId.should.equal(1)
        snapshots.payload.should.equal('{"name":"jd"}')
    })

    it('if version does not reach the thresholt, do not create the snapshot', () => {
        let a = aggregate.create(1, 3)
        a.initialize('test')
        a.updateName('jd')

        a.uncommittedSnapshots.length.should.equal(0)
    })
})