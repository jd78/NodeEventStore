"use strict"

const configuration = require("../lib/configuration")
const serializer = require("../lib/serializer")
const serializationFormats = require("../lib/serialization-formats")();
require("should")

describe("Serializer test", () => {

	it("stringify serialization is translatable", () => {
		configuration.payloadSerializationFormat = serializationFormats.stringify;

		let obj = {
			title: "test"
		}

		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)

		deserialized.title.should.equal(obj.title)
	})

	it("zip serialization test is translatable", () => {
		configuration.payloadSerializationFormat = serializationFormats.zip;

		let obj = {
			title: "test"
		}

		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)

		deserialized.title.should.equal(obj.title)
	})

	it("unserialized serialization test is translatable", () => {
		configuration.payloadSerializationFormat = serializationFormats.unserialized;

		let obj = {
			title: "test"
		}

		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)

		deserialized.title.should.equal(obj.title)
	})

	it("unserialized serialization returns cloned object", () => {
		configuration.payloadSerializationFormat = serializationFormats.unserialized;

		let obj = {
			title: "test"
		};

		let serialized = serializer.serialize(obj);
		var isObject = serialized !== null && typeof serialized === 'object';

		isObject.should.be.true;
		serialized.title.should.equal(obj.title)
		// clone, not same reference
		(serialized == obj).should.be.false;
	})
})