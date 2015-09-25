"use strict"

let defaults = {
	cacheExpiration: 0,
	cacheDeleteCheckInterval: 60
}

let _cacheExpiration
let _cacheDeleteCheckInterval

class Configuration {
	get cacheExpiration() {
		if (_cacheExpiration)
			return _cacheExpiration
		return defaults.cacheExpiration
	}

	set cacheExpiration(ttl) {
		_cacheExpiration = ttl
	}

	get cacheDeleteCheckInterval() {
		if (_cacheDeleteCheckInterval)
			return _cacheDeleteCheckInterval
		return defaults.cacheDeleteCheckInterval
	}

	set cacheDeleteCheckInterval(interval) {
		_cacheDeleteCheckInterval = interval
	}
}

module.exports = new Configuration()