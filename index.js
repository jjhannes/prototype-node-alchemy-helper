
const potionsController = require("./potions-controller");
const express = require("express");
const port = 6667;
const url = `http://localhost:${port}/`;

let app = express();

app.use((request, response, next) => {
    console.log(`${request.method} ${request.path}`);
    next();
});

potionsController.createEndpoints(app);

app.listen(6667, () => console.log(`Potion helper running at ${url}`))
