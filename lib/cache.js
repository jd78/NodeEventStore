"use strict"

const configuration = require("./configuration")
const clone = require("clone")

const NodeCache = require("node-cache")
const cache = new NodeCache({ stdTTL: configuration.cacheExpiration, checkperiod: configuration.cacheDeleteCheckInterval })

class Cache {
	setKey(key, obj) {
		cache.set(key, obj)
	}

	getKey(key) {
		return new Promise((resolve, reject) => {
			cache.get(key, (err, result) => {
				if (err) return reject(err)
				resolve(clone(result))
			})
		})
	}
}

module.exports = new Cache()