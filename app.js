const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config');
const cors = require('cors');
const app = express();
app.use(logger('dev'))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


console.log(config.URI)
mongoose.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("This is my database");
    }).catch((error) => {
        console.error("DB error:", error);
        process.exit(1);
    });
app.use('/api', routes);
app.use(function(req, res, next) {
    res.status(404).json({
        statusCode: 404,
        message: "Not found",
        data: {}
    })
})

app.listen(config.port, () => {
    console.log("Server is running @", config.port)
})