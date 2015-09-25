const configuration = require("../lib/configuration")

describe("Configuration", () => {
	it("get default cacheExpiration value if not set", () => {
		configuration.cacheExpiration.should.equal(0)
	})

	it("get default cacheDeleteCheckInterval value if not set", () => {
		configuration.cacheDeleteCheckInterval.should.equal(60)
	})

	it("get cacheExpiration set value", () => {
		configuration.cacheExpiration = 100
		configuration.cacheExpiration.should.equal(100)
	})

	it("get cacheDeleteCheckInterval set value", () => {
		configuration.cacheDeleteCheckInterval = 120
		configuration.cacheDeleteCheckInterval.should.equal(120)
	})
})