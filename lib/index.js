"use strict"

module.exports = {
	PersistenceAdapter: require("./persistence-adapter"),
	Aggregate: require("./aggregate"),
	registerHook: require("./hook").register,
	serializationFormats: require("./serialization-formats")(),
	initialize: conf => {
		const configuration = require("./configuration")
		if (conf) {
			if (conf.cacheExpiration)
				configuration.cacheExpiration = conf.cacheExpiration
			if (conf.cacheDeleteCheckInterval)
				configuration.cacheDeleteCheckInterval = conf.cacheDeleteCheckInterval
			if (conf.repository)
				configuration.repository = conf.repository
			if (conf.snapshotEvery)
				configuration.snapshotEvery = conf.snapshotEvery
			if (conf.payloadSerializationFormat)
				configuration.payloadSerializationFormat = conf.payloadSerializationFormat
			if (conf.zipPayload) {
				console.warn("zipPayload is deprecated. Set payloadSerializationFormat" +
					"to one of the NodeEventStore.serializationFormats instead.")
				configuration.zipPayload = conf.zipPayload
			}
		}

		return {
			Repository: require("./persistor")
		}
	}
}