
const potionsMediator = require("./potions-mediator");

const parameterNames = {
    desiredEffects: "de",
    excludedIngredients: "ei",
    excludeBadPotions: "ebp"
};

function createCollectionResponse(collection) {
    return {
        count: collection.length,
        items: collection
    };
}

function createEndpoints(app) {
    app.get("/neapi/v1/potions/recipes/with-effects", (request, response) => {
        let rawDesiredEffects = request.query[parameterNames.desiredEffects];
        let rawExcludedIngredients = request.query[parameterNames.excludedIngredients];
        let rawExcludeBadPotions = request.query[parameterNames.excludeBadPotions];
        let desiredEffects = [];
        let excludedIngredients = [];
        let excludeBadPotions = false;

        if (!rawDesiredEffects) {
            response.status(400);
            response.send();
        }
        
        desiredEffects = rawDesiredEffects
            .split(",")
            .map(de => de.trim());

        if (!!rawExcludedIngredients && rawExcludedIngredients.length > 0) {
            excludedIngredients = request.query[parameterNames.excludedIngredients]
                .split(",")
                .map(de => de.trim());
        }

        if (!!rawExcludeBadPotions) {
            excludeBadPotions = 
                rawExcludeBadPotions.toLowerCase() == "true" ||
                rawExcludeBadPotions.toLowerCase() == "1";
        }
        
        let viableRecipes = potionsMediator.determineRecipe(desiredEffects, excludedIngredients, excludeBadPotions);
        let collectionResponse = createCollectionResponse(viableRecipes);

        response.send(collectionResponse);
    });
}

module.exports = {
    createEndpoints
};
