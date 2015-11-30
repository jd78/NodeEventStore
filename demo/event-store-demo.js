"use strict"

const NodeEventStore = require("cqrs-eventstore")
const UserInfoAggregate = require("./userInfoAggregate")
const mobileUpdatedHook = require("./mobile-updated-hook")

NodeEventStore.registerHook("MobileUpdated", mobileUpdatedHook)

const EventStore = NodeEventStore.initialize({
	cacheExpiration: 180,
	cacheDeleteCheckInterval: 60,
	repository: require("./sqlite-persistor"),
	snapshotEvery: 5,
	zipPayload: true
})

const repository =  new EventStore.Repository(UserInfoAggregate)

let userInfoAggregate = new UserInfoAggregate(1);
userInfoAggregate.initialize("Gennaro", "Del Sorbo", "Main Street", "09762847")

repository.save(userInfoAggregate).then(() => {
 	userInfoAggregate.updateMobile("333");
 	userInfoAggregate.updateMobile("334");
 	userInfoAggregate.updateMobile("335");
 	userInfoAggregate.updateAddress("12, Main St.")
 	userInfoAggregate.updateAddress("15, Main St.")
 	repository.save(userInfoAggregate).then(() => {
 		console.log("all saved")
		
 		console.log("try a read")
		
 		repository.read(1).then(userInfo => {
 			console.log(userInfo.Mobile)
 			console.log(userInfo.Address)
 		}).catch(e => {
 			console.log(e)
 		});
 	})
 }).catch(err => {
 	console.log(err)
})
