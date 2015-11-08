"use strict"

const configuration = require("../lib/configuration")
const serializer = require("../lib/serializer")
require("should")

describe("Serializer test", () => {
	
	it("serializer test", () => {
		
		configuration.zipPayload = false
		
		let obj = {
			title: "test"
		}
		
		let serialized = serializer.serialize(obj)
		let deserialized = serializer.deserialize(serialized)
		
		deserialized.title.should.equal(obj.title)
		
		configuration.zipPayload = true
		
		serialized = serializer.serialize(obj)
		deserialized = serializer.deserialize(serialized)
		
		deserialized.title.should.equal(obj.title)
	})
	
})