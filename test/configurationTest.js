delete require.cache[require.resolve('../lib/configuration')]
const configuration = require("../lib/configuration")
const serializationFormats = require("../lib/serialization-formats")();

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

	it("get default payloadSerializationFormat value if not set", () => {
		configuration.payloadSerializationFormat.should.equal(serializationFormats.stringify)
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
	
	it("set deprecated zipPayload", () => {
		configuration.zipPayload = true
		configuration.payloadSerializationFormat.should.equal(serializationFormats.zip)
	})

	it("get default payloadSerializationFormat if set to stringify", () => {
		configuration.payloadSerializationFormat = serializationFormats.stringify
		configuration.payloadSerializationFormat.should.equal(serializationFormats.stringify)
	})

	it("get default payloadSerializationFormat if set to zip", () => {
		configuration.payloadSerializationFormat = serializationFormats.zip
		configuration.payloadSerializationFormat.should.equal(serializationFormats.zip)
	})

	it("get default payloadSerializationFormat if set to unserialized", () => {
		configuration.payloadSerializationFormat = serializationFormats.unserialized
		configuration.payloadSerializationFormat.should.equal(serializationFormats.unserialized)
	})
})