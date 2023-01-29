const express = require("express");
const cors = require("cors");
const config = require("./config");
const mongoConnector = require("./util/mongo-connector.util");
const router = require("./api/routes");

const app = express();

mongoConnector.connect().then(() => {
    app.use(cors());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/api/v1', router);
    app.listen(config.port);

    console.log("Database Connected");
    console.log(`Server is running on port ${config.port}`);
});
