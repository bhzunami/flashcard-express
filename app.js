import log4js from 'log4js';
import dotenv from 'dotenv-extended';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// Cross origin
import cors from 'cors';
import dispatcher from './web/questionnaireController';

log4js.configure('log4js.json');
let logger = log4js.getLogger('App');

dotenv.load({silent: true});
let PORT = process.env.PORT || 9090;

let app = express();
app.use(bodyParser.json());
app.use(cors());

let url = 'mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DATABASE;
mongoose.connect(url, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS 
});

// Entrypoint of the application
app.use('/flashcard-express/questionnaires', dispatcher);

app.listen(PORT);
logger.info(`Server running on ${PORT}`);
