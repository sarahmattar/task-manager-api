const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const multer = require('multer');

const Task = require('./models/task');
const User = require('./models/user');

const app = express();

const port = process.env.PORT;

app.use(express.json()); //this needs to come before any http methods.

//register the new routers.
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}.`);
});
