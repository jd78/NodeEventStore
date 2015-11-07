"use strict"

let defaults = {
	cacheExpiration: 0,
	cacheDeleteCheckInterval: 60,
	repository: require("./in-memory-persistence"),
	snapshotEvery: 0,
	zipPayload: false
}

let _cacheExpiration
let _cacheDeleteCheckInterval
let _repository
let _snapshotEvery
let _zipPayload

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
	
	get repository() {
		if (_repository)
			return _repository
		return defaults.repository
	}

	set repository(repository) {
		_repository = repository
	}
	
	get snapshotEvery() {
		if (_snapshotEvery)
			return _snapshotEvery
		return defaults.snapshotEvery
	}

	set snapshotEvery(snapshotEvery) {
		_snapshotEvery = snapshotEvery
	}
	
	get zipPayload() {
		if (_zipPayload)
			return _zipPayload
		return defaults.zipPayload
	}

	set zipPayload(zipPayload) {
		_zipPayload = zipPayload
	}
}

module.exports = new Configuration()