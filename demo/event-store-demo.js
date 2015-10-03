"use strict"

const NodeEventStore = require("NodeEventStore")
const UserInfoAggregate = require("./userInfoAggregate")
const EventStore = NodeEventStore.initialize({
	cacheExpiration: 180,
	cacheDeleteCheckInterval: 60,
	repository: require("./sqlite-persistor"),
	snapshotEvery: 5
})

let userInfoAggregate = UserInfoAggregate.create(1)
const repository =  new EventStore.Repository(userInfoAggregate)

userInfoAggregate.initialize("Gennaro", "Del Sorbo", "Main Street", "09762847")

repository.save(userInfoAggregate).then(() => {
	userInfoAggregate.updateMobile("333");
	userInfoAggregate.updateMobile("334");
	userInfoAggregate.updateMobile("335");
	userInfoAggregate.updateAddress("12, Main St.")
	userInfoAggregate.updateAddress("15, Main St.")
	repository.save(userInfoAggregate).then(() => {
		console.log("all saved")
	})
}).catch(err => {
	throw new Error(err)
})
