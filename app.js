require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// connect to DB
const connectDB = require("./db/connect")


// routers
const authRouter = require("./routes/auth");
const sleepRouter = require("./routes/sleep");




const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sleep", sleepRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`App listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();


