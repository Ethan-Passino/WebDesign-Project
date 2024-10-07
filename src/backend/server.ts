import {NextFunction, Request, Response} from 'express';
import userRoutes from './routes/user';

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//Start Express App
const backendApp = express();

//Connect to MongooseDB
//TODO: Figure out how to host a local MongoDB or decide to use Atlas MongoDB
mongoose.connect()
    .then(() => {

        //Sets the Express app to listen to a specific port
        const PORT = process.env.PORT;
        backendApp.listen(PORT, () => {
            console.log(`Express App running on ${PORT}`);
        })

    })
    .catch((error) => {
        console.log(`Error connecting mongoose: ${error}`);
    });

//Pre-handle of every request
backendApp.use(express.json());
backendApp.use((request: Request, response: Response, next: NextFunction) => {
    console.log(`${request.method} from ${request.path}`);
    next();
});

//Handle get requests and provide responses
backendApp.get('/', (request: Request, response: Response) => {
    //Handle request and provide response
    response.json({exam: "example response"});
});

// User Routes (Routing to different pages)
backendApp.use('/api', userRoutes); // This is a sample route