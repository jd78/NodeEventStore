"use strict"

class Serializer {

	constructor(zlib, configuration) {
		this.zlib = zlib;
		this.configuration = configuration;
	}

	serialize(obj) {
		let json = JSON.stringify(obj)
		if (!this.configuration.zipPayload)
			return json
		var buffer = new Buffer(json, 'utf8')
		return this.zlib.gzipSync(buffer)
	}

	deserialize (serialized) {
		if (!this.configuration.zipPayload)
			return JSON.parse(serialized)
		let unzipped = this.zlib.gunzipSync(serialized)
		return JSON.parse(unzipped.toString('utf8'))
	}
}

module.exports = dependencies => {
	let dep = dependencies || {};
	return new Serializer(
		dep.zlib || require("zlib"),
		dep.configuration || require("./configuration")
	)
}