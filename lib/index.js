"use strict"

module.exports = (conf) => {
	const configuration = require("configuration")
	
	if(conf){
		if(conf.cacheExpiration)
			configuration.cacheExpiration = conf.cacheExpiration
		if(conf.cacheDeleteCheckInterval)
			configuration.cacheDeleteCheckInterval = conf.cacheDeleteCheckInterval
		if(conf.repository)
			configuration.repository = conf.repository
	}
	
	return {
		PersistenceAdapter : require("./persistence-adapter"),
		Aggregate: require("./aggregate"),
		Repository: require("./persistor")
	}
}