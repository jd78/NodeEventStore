"use strict"

const zlib = require("zlib")
const configuration = require("./configuration")
const serializationFormats = require("../lib/serialization-formats")();
const clone = require("clone");

class Serializer {
	serialize(obj) {
		var format = configuration.payloadSerializationFormat;
		switch (format) {
			case serializationFormats.stringify:
				return JSON.stringify(obj);
			case serializationFormats.zip:
				let json = JSON.stringify(obj);
				let buffer = new Buffer(json, 'utf8')
				return zlib.gzipSync(buffer)
			case serializationFormats.unserialized:
				return clone(obj);
		}
		throw "Unknown payloadSerializationFormat"
	}

	deserialize(serialized) {
		if (!configuration.zipPayload)
			return JSON.parse(serialized)
		let unzipped = zlib.gunzipSync(serialized)
		return JSON.parse(unzipped.toString('utf8'))
	}
}

module.exports = new Serializer()