# Task Manager API

This is a Node and Express-based API service for a Task Manager application, with data modeled in Mongoose and stored in a MongoDB database. The various endpoints allow a user to register, add tasks, update their profile, upload an avatar, and delete their account. This was a very thorough coursework project from Andrew Mead's Node.js course on [UDEMY](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) and I learned a lot about how to model data, display it, and write unit tests to verify that the endpoints were working as expected. 

### Running Locally

**Start the MongoDB server first.** The API connects to MongoDB when it starts, and if no server is running it crashes with `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`.

1. In its own terminal tab, start MongoDB and leave it running:

   ```sh
   ~/mongodb/bin/mongod --dbpath=$HOME/mongodb-data
   ```

   Adjust the paths if MongoDB or the data folder are somewhere else. Use a `mongod` binary whose major version matches the data folder. Newer versions refuse to open data written by an older major version.

2. In a second terminal tab, start the API:

   ```sh
   npm run dev
   ```

   This loads environment variables from `config/dev.env`, including `MONGODB_URL`, which defaults to `mongodb://127.0.0.1:27017/task-manager-api`.

The tests (`npm test`) need the MongoDB server running too.

### Endpoints

Path | Description
---- | -----------
/users              | Register a user (sends welcome email via [SendGrid](https://sendgrid.com/))
/users/login        | Login an existing user
/users/me           | Access user profile for authorized user, update a user's profile, delete authorized user (sends cancellation email via [SendGrid](https://sendgrid.com/))
/users/me/avatar    | Upload avatar image for user, image is converted to PNG and resized using [Sharp](https://www.npmjs.com/package/sharp). 
/tasks              | Create a task, owned by the current user who is logged in.
/tasks/:id          | Query a task, update a task, delete a task.

### Testing 

Unit tests verify that users should be able to register for an account, should be able to add tasks, should be not able to delete other user's tasks, should be able to delete their own tasks, etc. All tests are written in Jest.