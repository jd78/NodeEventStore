delete require.cache[require.resolve('../lib/configuration')]
const configuration = require("../lib/configuration")

describe("Configuration", () => {
	it("get default cacheExpiration value if not set", () => {
		configuration.cacheExpiration.should.equal(0)
	})

	it("get default cacheDeleteCheckInterval value if not set", () => {
		configuration.cacheDeleteCheckInterval.should.equal(60)
	})
	
	it("get default snapshotEvery value if not set", () => {
		configuration.snapshotEvery.should.equal(0)
	})
	
	it("get default zipPayload value if not set", () => {
		configuration.zipPayload.should.be.false()
	})

	it("get cacheExpiration set value", () => {
		configuration.cacheExpiration = 100
		configuration.cacheExpiration.should.equal(100)
	})

	it("get cacheDeleteCheckInterval set value", () => {
		configuration.cacheDeleteCheckInterval = 120
		configuration.cacheDeleteCheckInterval.should.equal(120)
	})
	
	it("get snapshotEvery set value", () => {
		configuration.snapshotEvery = 50
		configuration.snapshotEvery.should.equal(50)
	})
	
	it("get zipPayload", () => {
		configuration.zipPayload = true
		configuration.zipPayload.should.be.true()
	})
})