"use strict"

const serializationFormats = require("../lib/serialization-formats")();
const clone = require("clone");
class Serializer {

	constructor(zlib, configuration) {
		this.zlib = zlib;
		this.configuration = configuration;
	}

	serialize(obj) {
		var format = this.configuration.payloadSerializationFormat;
		switch (format) {
			case serializationFormats.stringify:
				return JSON.stringify(obj);
			case serializationFormats.zip:
				let json = JSON.stringify(obj);
				let buffer = new Buffer(json, 'utf8')
				return this.zlib.gzipSync(buffer)
			case serializationFormats.unserialized:
				return clone(obj);
		}
		throw "Unknown payloadSerializationFormat"
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