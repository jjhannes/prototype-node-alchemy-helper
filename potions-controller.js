
const potionsMediator = require("./potions-mediator");
const apiBasePath = "/neapi/v1";
const parameterNames = {
    desiredEffects: "de",
    excludedIngredients: "ei",
    excludeBadPotions: "ebp",
    exactlyMatchDerisedEffects: "emde",
    ingredients: "i"
};

function createCollectionResponse(collection) {
    return {
        count: collection.length,
        items: collection
    };
}

function handlePotionRecipesWithEffects(request, response) {
    let rawDesiredEffects = request.query[parameterNames.desiredEffects];
    let rawExcludedIngredients = request.query[parameterNames.excludedIngredients];
    let rawExcludeBadPotions = request.query[parameterNames.excludeBadPotions];
    let rawExactlyMatchDesiredEffects = request.query[parameterNames.exactlyMatchDerisedEffects];
    let desiredEffects = [];
    let excludedIngredients = [];
    let excludeBadPotions = false;
    let exactlyMatchDesiredEffects = false;

    if (!rawDesiredEffects) {
        response.status(400);
        response.send(`Desired effects (${parameterNames.desiredEffects}) are required`);

        return;
    }
    
    desiredEffects = rawDesiredEffects
        .split(",")
        .map(de => de.trim());
    let invalidEffects = potionsMediator.validateEffects(desiredEffects);

    if (invalidEffects.length > 0) {
        response.status(400);
        response.send(`Invalid desired effects were provided: [${invalidEffects.join(", ")}]`);

        return;
    }

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

    if (!!rawExactlyMatchDesiredEffects) {
        exactlyMatchDesiredEffects = 
            rawExactlyMatchDesiredEffects.toLowerCase() == "true" ||
            rawExactlyMatchDesiredEffects.toLowerCase() == "1";
    }
    
    let viableRecipes = potionsMediator.getRecipesWithDesiredEffects(desiredEffects, excludedIngredients, excludeBadPotions, exactlyMatchDesiredEffects);
    let collectionResponse = createCollectionResponse(viableRecipes);

    response.send(collectionResponse);
}

function handlePotionFromIngredients(request, response) {
    let rawIngredients = request.query[parameterNames.ingredients];

    if (!rawIngredients || rawIngredients.length < 1) {
        response.status(400);
        response.send(`Ingredients (${parameterNames.ingredients}) are required`);

        return;
    }

    let ingredients = rawIngredients
        .split(",")
        .map(de => de.trim());
    let invalidIngredients = potionsMediator.validateIngredients(ingredients);

    if (invalidIngredients.length > 0) {
        response.status(400);
        response.send(`Invalid ingredients were provided: [${invalidIngredients.join(", ")}]`);

        return;
    }

    if (ingredients.length < 2) {
        response.status(400);
        response.send(`A minimum of 2 ingredients are required`);

        return;
    }
    else if (ingredients.length > 4) {
        response.status(400);
        response.send(`A maximum of 4 ingredients are allowed`);

        return;
    }

    let resultingPotion = potionsMediator.getRecipeFromIngredients(ingredients);

    response.send(resultingPotion);
}

function createEndpoints(app) {
    app.get(`/`, (request, response) => response.send(`NEAPI ${process.env.NODE_ENV_PLATFORM || 'N/A'} RUNNING`));
    app.get(`${apiBasePath}/potions/recipes/with-effects`, handlePotionRecipesWithEffects);
    app.get(`${apiBasePath}/potions/from-ingredients`, handlePotionFromIngredients);
}

module.exports = {
    createEndpoints
};
