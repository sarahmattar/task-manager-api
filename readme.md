# Task Manager API

This is a Node and Express-based API service for a Task Manager application, with data modeled in Mongoose and stored in a MongoDB database. The various endpoints allow a user to register, add tasks, update their profile, upload an avatar, and delete their account. This was a very thorough coursework project from Andrew Mead's Node.js course on [UDEMY](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) and I learned a lot about how to model data, display it, and write unit tests to verify that the endpoints were working as expected. 

### Running Locally

Start MongoDB, [Mailpit](https://mailpit.axllent.org/), and the API together:

```sh
npm run dev
```

Output from each process is prefixed with `[mongo]`, `[mail]`, or `[api]`, and Ctrl-C stops all three. If MongoDB or Mailpit is already running (for example, as a `brew services` service), that step is skipped.

- **MongoDB** runs `~/mongodb/bin/mongod --dbpath=$HOME/mongodb-data`. If MongoDB or the data folder is somewhere else, edit the `dev:mongo` script in `package.json`. Use a `mongod` binary whose major version matches the data folder. Newer versions refuse to open data written by an older major version.
- **Mailpit** catches every email the app sends. Read them at http://127.0.0.1:8025. Install it with `brew install mailpit`.
- **The API** loads environment variables from `config/dev.env`, including `MONGODB_URL`, which defaults to `mongodb://127.0.0.1:27017/task-manager-api`.

To run a single piece, use `npm run dev:mongo`, `npm run dev:mail`, or `npm run dev:api`.

The tests (`npm test`) need MongoDB running too. Start it with `npm run dev:mongo` in another tab.

### Endpoints

Path | Description
---- | -----------
/users              | Register a user (sends a welcome email via [Nodemailer](https://nodemailer.com/))
/users/login        | Login an existing user
/users/me           | Access user profile for authorized user, update a user's profile, delete authorized user (sends a cancellation email via [Nodemailer](https://nodemailer.com/))
/users/me/avatar    | Upload avatar image for user, image is converted to PNG and resized using [Sharp](https://www.npmjs.com/package/sharp). 
/tasks              | Create a task, owned by the current user who is logged in.
/tasks/:id          | Query a task, update a task, delete a task.

### Testing 

Unit tests verify that users should be able to register for an account, should be able to add tasks, should be not able to delete other user's tasks, should be able to delete their own tasks, etc. All tests are written in Jest.