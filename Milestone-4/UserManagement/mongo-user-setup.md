# MongoDB User Setup for Authentication and Limited Privileges

1. Connect to the MongoDB shell as an admin user:

```bash
mongo --port 27017
```

2. Switch to the admin database:

```js
use admin
```

3. Create a new user with readWrite access only to the "users" collection in the "userManagement" database:

```js
db.createUser({
  user: "limitedUser",
  pwd: "yourStrongPassword",
  roles: [
    {
      role: "readWrite",
      db: "userManagement",
      collection: "users"
    }
  ]
});
```

Note: MongoDB roles do not support collection-level privileges directly. To restrict access to a single collection, you need to create a custom role:

```js
db.createRole({
  role: "readWriteUsersCollection",
  privileges: [
    {
      resource: { db: "userManagement", collection: "users" },
      actions: [ "find", "insert", "update", "remove" ]
    }
  ],
  roles: []
});

db.createUser({
  user: "limitedUser",
  pwd: "yourStrongPassword",
  roles: [ { role: "readWriteUsersCollection", db: "userManagement" } ]
});
```

4. Enable authentication in your MongoDB server by starting it with the `--auth` flag or configuring it in the config file.

5. Update your backend environment variables to include:

```
MONGO_USERNAME=limitedUser
MONGO_PASSWORD=yourStrongPassword
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=userManagement
```

6. Restart your backend server to apply the changes.

7. Test the new user's access by performing read and write operations on the "users" collection via the backend API.
