const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json()); //this needs to come before any http methods.

//register the new routers.
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
