"use strict"

require("should")
const sinon = require("sinon")
const Aggregate = require("./aggregate/demo")
const Persistor = require("../lib/persistor")
const hook = require("../lib/hook")

function StreetHook(evt){
	console.log("street updated " + evt.street)
}

describe("Hook", () => {
	
	it("Raise hook if defined", () => {
		let hookSpy = sinon.spy(console, "log");
		
		hook.register("StreetUpdated", StreetHook)
		
		let a = new Aggregate(1)
        a.initialize('test')
		a.updateStreet("Main Street", StreetHook)
		
		let persistor = new Persistor()
        return persistor.save(a).then(() => {
			hookSpy.withArgs("street updated Main Street").calledOnce.should.be.true()
        })
	})
})
