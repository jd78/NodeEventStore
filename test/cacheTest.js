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
})