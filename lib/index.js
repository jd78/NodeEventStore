"use strict"

module.exports = (conf) => {
	return {
		PersistenceAdapter: require("./persistence-adapter"),
		NodeEventStore: conf => {
				const configuration = require("configuration")
				if (conf) {
					if (conf.cacheExpiration)
						configuration.cacheExpiration = conf.cacheExpiration
					if (conf.cacheDeleteCheckInterval)
						configuration.cacheDeleteCheckInterval = conf.cacheDeleteCheckInterval
					if (conf.repository)
						configuration.repository = conf.repository
				}		
			return {
				Aggregate: require("./aggregate"),
				Repository: require("./persistor")
			}	
		}
	}
}