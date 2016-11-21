CQRS-EventStore
========================

You need Node.js 4+ to use it!

## Installation
    $ npm install cqrs-eventstore

## Working example

A full example is provided in the demo folder.
To run it:
- cd to the demo folder
- npm install
- node event-store-demo.js

# Domain and DTOs

In order to use CQRS-EventStore, you need to implement your own aggregate and DTOs. Your aggregate must extend Aggregate.

An aggregate example including the DTOs:

```js
"use strict";

class BaseEvent {
    constructor() {
        this.id
        this.version
    }
}

module.exports = BaseEvent
```

```js
"use strict"

const BaseEvent = require("./baseEvent")

class AddressUpdated extends BaseEvent {
    constructor(address) {
        super()
        this.address = address
    }
}

module.exports = AddressUpdated
```

```js
"use strict"

const BaseEvent = require("./baseEvent")

class MobileUpdated extends BaseEvent {
    constructor(mobile) {
        super()
        this.mobile = mobile
    }
}

module.exports = MobileUpdated
```

```js
"use strict"

const BaseEvent = require("./baseEvent")

class UserInfoCreated extends BaseEvent {
    constructor(name, surname, address, mobile) {
        super()
        this.name = name
        this.surname = surname
        this.address = address
        this.mobile = mobile
    }
}

module.exports = UserInfoCreated
```

```js
"use strict"

const NodeEventStore = require("cqrs-eventstore")
const UserInfoCreated = require("./dto/userInfoCreated")
const AddressUpdated = require("./dto/addressUpdated")
const MobileUpdated = require("./dto/mobileUpdated")
const clone = require("clone") //Clone is used for the snapshot, it's totally up to you how to implement it.

function UserInfo(id) {

    //We are not exposing the UserInfo to the outside world, but we access to it through query.
    function UserInfoObj() {
        this.name
        this.surname
        this.address
        this.mobile
    }
    
    let _userInfo
    
    class UserInfo extends NodeEventStore.Aggregate {
    
        constructor(id) {
            super(id)
            _userInfo = new UserInfoObj()
        }
    
        snapshot() {
            return clone(_userInfo)
        }
    
        applySnapshot(payload) {
            _userInfo = payload
        }
        
        //Queries
        get Mobile() {
            return _userInfo.mobile
        }
    
        get Address() {
            return _userInfo.address
        }
        
        //Mutators
        initialize(name, surname, address, mobile) {
            super.raiseEvent(new UserInfoCreated(name, surname, address, mobile))
        }
    
        updateAddress(address) {
            super.raiseEvent(new AddressUpdated(address))
        }
    
        updateMobile(mobile, hookFn) {
            super.raiseEvent(new MobileUpdated(mobile), hookFn)
        }
        
        //Apply
        UserInfoCreated(payload) {
            _userInfo.name = payload.name
            _userInfo.surname = payload.surname
            _userInfo.address = payload.address
            _userInfo.mobile = payload.mobile
        }
    
        AddressUpdated(payload) {
            _userInfo.address = payload.address
        }
    
        MobileUpdated(payload) {
            _userInfo.mobile = payload.mobile
        }
    }
    
    return new UserInfo(id)
}

module.exports = UserInfo
```

## Implementing the persistence layer

In order to implement your own persistence layer, you need to extend PersistenceAdapter and register it into the configurator (I'll show it later).
The methods save, readSnapshot and readEvents must be implemented. All methods must return a promise.
In the save method you need to persist your events and snapshot.


Below an example how to implement a sqlite persistor.

```js
"use strict"

const nodeEventStore = require("cqrs-eventstore")
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const _ = require("underscore")
const util = require("util")
const uuid = require("uuid")

class SqlitePersistor extends nodeEventStore.PersistenceAdapter {
	constructor() {
		super()

		const file = "eventStore.db";
		const exists = fs.existsSync(file);
		this.db = new sqlite3.Database(file);

		this.db.serialize(() => {
			if (!exists) {
				this.db.run("CREATE TABLE Events (id TEXT, streamId TEXT, version INTEGER, timestamp TEXT, eventType TEXT, payload BLOB)");
				this.db.run("CREATE TABLE Snapshots (id TEXT, streamId TEXT, version INTEGER, timestamp TEXT, payload BLOB)");
			}
		});
	}

	save(events, snapshots) {
		const self = this;
		return new Promise((resolve, reject) => {
			self.db.serialize(() => {
				try {
					self.db.run("BEGIN TRANSACTION")
					_.each(events, (e) => {
						self.db.run("INSERT INTO Events VALUES (?, ?, ?, ?, ?, ?)", uuid.v4(), e.streamId, e.version, new Date(), e.eventType, e.payload)
					})
					_.each(snapshots, (e) => {
						self.db.run("INSERT INTO Snapshots VALUES (?, ?, ?, ?, ?)", uuid.v4(), e.streamId, e.version, new Date(), e.payload)
					})
					self.db.run("COMMIT TRANSACTION")
					resolve()
				} catch (err) {
					self.db.run("ROLLBACK TRANSACTION")
					reject(err)
				}
			})
		})
    }
    
    //return a promise
    readSnapshot(id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT * FROM Snapshots WHERE streamId = ? ORDER BY version DESC LIMIT 1", [id], (err, row) => {
				if (err) return reject(err)
				resolve(row)
			});
		})
    }
    
    //return a promise
    readEvents(id, fromVersion) {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM Events WHERE streamId = ? AND version > ? ORDER BY version", [id, fromVersion], (err, rows) => {
				if (err) return reject(err)
				resolve(rows)
			});
		})
    }
}

module.exports = new SqlitePersistor()

```

## Implementing hooks

CQRS-EventStore comes with a build-in hook functionality. We can execute a task after each commands.

A simple hook that print into the console on each mobile number update:

```js
"use strict"

const util = require("util")

module.exports = evt => {
	console.log(util.format("Mobile number updated %s", evt.mobile))
}
```

Hooks need to be registered into the configurator

## Configuration

Before to use CQRS-EventStore, we need to configure it.

The parameters are:

- cacheExpiration: cache expiration in seconds, the default is 0 (unlimited).
- cacheDeleteCheckInterval: The period in seconds, used for the automatic delete check interval. Default is 60 seconds.
- repository: your extended persistance layer, if not provived an in-memory persistence will be used.
- snapshotEvery: event threshold for the snapshot, the default is 0 (snapshot disabled). For example, if we assign 50, every 50 events we create the snapshot.
- zipPayload: payload compression, default is false.

## Usage Example

```js

"use strict"

const NodeEventStore = require("cqrs-eventstore")
const UserInfoAggregate = require("./userInfoAggregate")
const mobileUpdatedHook = require("./mobile-updated-hook")

//We need to register the hooks here, the name of the hook must match the apply method
NodeEventStore.registerHook("MobileUpdated", mobileUpdatedHook)

//Configuration
const EventStore = NodeEventStore.initialize({
	cacheExpiration: 180,
	cacheDeleteCheckInterval: 60,
	repository: require("./sqlite-persistor"),
	snapshotEvery: 5,
	zipPayload: true
})

const repository =  new EventStore.Repository(UserInfoAggregate)
let userInfoAggregate = new UserInfoAggregate(1)
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
```

## Contributing

1. `clone` this repo

2. `npm run build`

### Run the demo

`npm start`

### Run the tests

`npm test`

### Run the tests and listen for a debugger

`npm run test-debug`