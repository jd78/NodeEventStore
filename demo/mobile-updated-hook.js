"use strict"

const util = require("util")

module.exports = evt => {
	console.log(util.format("Mobile number updated %s", evt.mobile))
}