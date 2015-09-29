"use strict"

module.exports = {
	PersistenceAdapter: require("./persistence-adapter"),
	initialize: conf => {
		const configuration = require("./configuration")
		if (conf) {
			if (conf.cacheExpiration)
				configuration.cacheExpiration = conf.cacheExpiration
			if (conf.cacheDeleteCheckInterval)
				configuration.cacheDeleteCheckInterval = conf.cacheDeleteCheckInterval
			if (conf.repository)
				configuration.repository = conf.repository
		}
		return {
			aggregate: require("./aggregate"),
			repository: require("./persistor")
		}
	}
}