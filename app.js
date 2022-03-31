require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { stat } = require("fs");

app.use(express.json);

app.get("/", (req, res) => {
    res.send("sleep_api");
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        app.listen(port, console.log(`App listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();