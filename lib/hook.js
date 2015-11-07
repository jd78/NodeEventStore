"use strict"

let hooks = new Map()

class Hook {
	
	register(eventName, fnc){
		if(hooks.has(eventName))
			throw new Error("This hook has already been registered")
			
		hooks.set(eventName, fnc)	
	}
	
	tryExecHook(eventName, payload){
		if(!hooks.has(eventName))
			return;
		
		hooks.get(eventName)(payload);	
	}
}

module.exports = new Hook()