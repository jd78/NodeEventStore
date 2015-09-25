"use strict"

require("should")

describe("Cache", () => {
	it("cache", () => {
		let cache = require("../lib/cache")
		cache.setKey("1", "test")
		return cache.getKey("1").then(result => {
			result.should.equal("test")
		})
	})
	
	it("clone", () => {
		let cache = require("../lib/cache")
		let obj = { desc: "test" }
		cache.setKey("1", obj)
		obj.desc = "test2"
		return cache.getKey("1").then(result => {
			result.desc.should.equal("test")
		})
	})
})