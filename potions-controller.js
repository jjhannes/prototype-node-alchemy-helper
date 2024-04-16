
const potions = require("./potions-mediator");

function createEndpoints(app) {
    app.get("/neapi/v1/potions/recipes/with-effects", (request, response) => {
        console.log(`${request.query}`);

        response.send([]);
    });
}

module.exports = {
    createEndpoints
};
