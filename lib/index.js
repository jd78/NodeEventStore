"use strict"

module.exports = {
	PersistenceAdapter: require("./persistence-adapter"),
	Aggregate: require("./aggregate"),
	initialize: conf => {
		const configuration = require("./configuration")
		if (conf) {
			if (conf.cacheExpiration)
				configuration.cacheExpiration = conf.cacheExpiration
			if (conf.cacheDeleteCheckInterval)
				configuration.cacheDeleteCheckInterval = conf.cacheDeleteCheckInterval
			if (conf.repository)
				configuration.repository = conf.repository
			if(conf.snapshotEvery)
				configuration.snapshotEvery = conf.snapshotEvery
		}
		
		return {
			Repository: require("./persistor")
		}
	}
}