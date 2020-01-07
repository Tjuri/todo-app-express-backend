const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true } );
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const todosRouter = require('./routes/todos');
app.use('/todos', todosRouter);

app.listen(3000, () => console.log('Server started'));


