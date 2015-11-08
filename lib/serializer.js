"use strict"

const zlib = require("zlib")
const configuration = require("./configuration")

class Serializer {
	serialize(obj) {
		let json = JSON.stringify(obj)
		if(!configuration.zipPayload)
			return json
		var buffer = new Buffer(json, 'utf8')
		return zlib.gzipSync(buffer)
	}
	
	deserialize(serialized) {
		if(!configuration.zipPayload)
			return JSON.parse(serialized)
		let unzipped = zlib.gunzipSync(serialized)
		return JSON.parse(unzipped.toString('utf8'))
	}
} 

module.exports = new Serializer()