"use strict"

const configuration = require("../lib/configuration")
const serializer = require("../lib/serializer")({ configuration })
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

	it("zip serialization is translatable", () => {
		configuration.payloadSerializationFormat = serializationFormats.zip;

		let obj = {
			title: "test"
		}

		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)

		deserialized.title.should.equal(obj.title)
	})

	it("unserialized serialization is translatable", () => {
		configuration.payloadSerializationFormat = serializationFormats.unserialized;

		let obj = {
			title: "test"
		}

		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)

		deserialized.title.should.equal(obj.title)
	})

	it("unserialized serialization returns original object", () => {
		configuration.payloadSerializationFormat = serializationFormats.unserialized;

		let obj = {
			title: "test"
		};

		let serialized = serializer.serialize(obj);
		
		var isObject = serialized !== null && typeof serialized === 'object';
		isObject.should.be.true;
		serialized.title.should.equal(obj.title);
		(serialized == obj).should.be.true;
	})

	it("stringify serialization returns stringified object", () => {
		configuration.payloadSerializationFormat = serializationFormats.stringify;

		let obj = {
			title: "test"
		};

		let serialized = serializer.serialize(obj);
		
		serialized.should.equal("{\"title\":\"test\"}");
	})

	it("zip serialization returns zipped object", () => {
		configuration.payloadSerializationFormat = serializationFormats.zip;

		let obj = {
			title: "test"
		};

		let serialized = serializer.serialize(obj);
		
		serialized.byteLength.should.equal(36);
	})
})