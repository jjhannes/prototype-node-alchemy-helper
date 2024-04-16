
const potionsMediator = require("./potions-mediator");

function createEndpoints(app) {
    app.get("/neapi/v1/potions/recipes/with-effects", (request, response) => {
        let desiredEffects = request.query["de"]
            .split(",")
            .map(de => de.trim());
        let viableRecipes = potionsMediator.determineRecipe(desiredEffects);

        response.send(viableRecipes);
    });
}

module.exports = {
    createEndpoints
};
