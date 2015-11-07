"use strict"

class Serializer {
	serialize(obj){
		return JSON.stringify(obj);
	}
	
	deserialize(serialized){
		return JSON.parse(serialized);
	}
} 

module.exports = new Serializer()