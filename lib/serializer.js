"use strict"

function serialize(obj){
	return JSON.stringify(obj);
}

function deserialize(serialized){
	return JSON.parse(serialized);
}

module.exports = {
	serialize: serialize,
	deserialize: deserialize
}