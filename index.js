const express = require('express');
const dotenv = require("dotenv");
const db = require('mongodb');
const app = express();

app.use(express.json());
app.use(express.static('webdesign/dist'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.get("/", (req, res) => {
    res.send("Hello World");
    console.log("base page");
});

app.get("/Login", (req, res) => {
    res.send("Sending to login page");
    app.us
})