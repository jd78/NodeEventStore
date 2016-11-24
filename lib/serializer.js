"use strict"

const serializationFormats = require("./serialization-formats")();
const clone = require("clone");
const zlib = require("zlib");

class Serializer {

	constructor(configuration) {
		this.configuration = configuration;
	}

	serialize(obj) {
		switch (this.configuration.payloadSerializationFormat) {
			case serializationFormats.stringify:
				return JSON.stringify(obj);
			case serializationFormats.zip:
				let json = JSON.stringify(obj);
				let buffer = new Buffer(json, 'utf8')
				return zlib.gzipSync(buffer)
			case serializationFormats.unserialized:
				return obj;
		}
		throw "Unknown payloadSerializationFormat"
	}

	deserialize(serialized) {
		switch (this.configuration.payloadSerializationFormat) {
			case serializationFormats.stringify:
				return JSON.parse(serialized);
			case serializationFormats.zip:
				let unzipped = zlib.gunzipSync(serialized)
				return JSON.parse(unzipped.toString('utf8'))
			case serializationFormats.unserialized:
				return serialized;
		}
		throw "Unknown payloadSerializationFormat"
	}
}

module.exports = dependencies => {
	let dep = dependencies || {};
	return new Serializer(
		dep.configuration || require("./configuration")
	)
}