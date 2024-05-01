
const potionsMediator = require("../potions-mediator");
const assert = require("assert");

function join(separator, collection) {
    return collection.reduce((acc, item) => {
        if (acc.length > 0)
            acc += separator;

        return acc += item;
    }, "");
}

// Mocha tests
// Potions mediator testing
describe("potions-mediator", () => {

    // Effects validation
    describe("#validateEffect()", () => {
        it("should return an empty array if a valid effect is provided", () => {
            let result = potionsMediator.validateEffects([ "Restore Health" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });
        
        it("should accept as valid an effect in all lower case", () => {
            let result = potionsMediator.validateEffects([ "restore health" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });
        
        it("should accept as valid an effect in all upper case", () => {
            let result = potionsMediator.validateEffects([ "RESTORE HEALTH" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });

        it("should return a list of invalid effects", () => {
            let input = [ "Super Strength" ];
            let result = potionsMediator.validateEffects(input);
            let expected = input.slice();

            assert.equal(result.length, expected.length);
            assert.equal(input.every(i => new Set(expected).has(i)), true);
        });
    });

    // Ingredients validation
    describe("#validateIngredients()", () => {
        it("should return an empty array if a valid ingredient is provided", () => {
            let result = potionsMediator.validateIngredients([ "Scrib Jerky" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });
        
        it("should accept as valid an ingredient in all lower case", () => {
            let result = potionsMediator.validateIngredients([ "scrib jerky" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });
        
        it("should accept as valid an ingredient in all upper case", () => {
            let result = potionsMediator.validateIngredients([ "SCRIB JERKY" ]);
            let expected = [];

            assert.equal(result.length, expected.length);
            assert.deepEqual(result, expected);
        });
    });
    
    // Get recipe from ingredients
    describe("#getRecipeFromIngredients()", () => {
        let givenIngredients = [ "Bread", "Hound Meat" ];
        let expectedEffects = [ "Restore Fatigue" ];

        it(`should return [${join(", ", expectedEffects)}] given [${join(", ", givenIngredients)}]`, () => {
            let result = potionsMediator.getRecipeFromIngredients(givenIngredients);
            
            assert.equal(result.effects.length, expectedEffects.length);
            assert.deepEqual(result.effects, expectedEffects);
        });

        givenIngredients = [ "Corprus Weepings", "Small Corprusmeat Hunk" ];
        expectedEffects = [ "Drain Fatigue" ];

        it(`should return [${join(", ", expectedEffects)}] given [${join(", ", givenIngredients)}]`, () => {
            let result = potionsMediator.getRecipeFromIngredients(givenIngredients);
            
            assert.equal(result.effects.length, expectedEffects.length);
            assert.deepEqual(result.effects, expectedEffects);
        });

        givenIngredients = [ "Bread", "Corprus Weepings" ];
        expectedEffects = [  ];

        it(`should return [${join(", ", expectedEffects)}] given [${join(", ", givenIngredients)}]`, () => {
            let result = potionsMediator.getRecipeFromIngredients(givenIngredients);
            
            assert.equal(result.effects.length, expectedEffects.length);
            assert.deepEqual(result.effects, expectedEffects);
        });

        givenIngredients = [ "corkbulb root", "large kwama egg", "resin", "shalk resin" ];
        expectedEffects = [ "Fortify Health", "Restore Health" ];

        it(`should return [${join(", ", expectedEffects)}] given [${join(", ", givenIngredients)}]`, () => {
            let result = potionsMediator.getRecipeFromIngredients(givenIngredients);
            
            assert.equal(result.effects.length, expectedEffects.length);
            assert.deepEqual(result.effects, expectedEffects);
        });
    });

    describe("#getRecipesWithDesiredEffects()", () => {
        it("should return at least all the desired effects", () => {
            let desiredEffects = [ "Restore Health", "Fortify Health" ];
            let resultingRecipes = potionsMediator.getRecipesWithDesiredEffects(desiredEffects);

            assert.equal(resultingRecipes.every(rr => rr.effects.length >= desiredEffects.length), true);
            assert.equal(desiredEffects.every(de => resultingRecipes.every(rr => rr.effects.some(rre => rre.toLowerCase() == de.toLowerCase()))), true);
        });

        it("should return at least all the desired effects while excluding the specified ingredients", () => {
            let desiredEffects = [ "Restore Health", "Fortify Health" ];
            let excludedIngredients = [ "Adamantium Ore", "Heartwood", "Frost Salts", "Void Salts", "Emerald", "Belladonna Berries" ];
            let resultingRecipes = potionsMediator.getRecipesWithDesiredEffects(desiredEffects, excludedIngredients);

            assert.equal(resultingRecipes.every(rr => rr.effects.length >= desiredEffects.length), true);
            assert.equal(resultingRecipes.every(rr => !rr.ingredients.some(rri => excludedIngredients.some(ei => ei.toLowerCase() == rri.toLowerCase()))), true);
        });

        it("should return at least all the desired effects and there should be no potions with bad effects", () => {
            let desiredEffects = [ "Restore Health", "Fortify Health" ];
            let resultingRecipes = potionsMediator.getRecipesWithDesiredEffects(desiredEffects, [], true);

            assert.equal(resultingRecipes.every(rr => rr.effects.length >= desiredEffects.length), true);
            assert.equal(resultingRecipes.every(rr => rr.badEffects.length == 0), true);
        });

        it("should return exactly all the desired effects", () => {
            let desiredEffects = [ "Fortify Fatigue", "Restore Fatigue" ];
            let resultingRecipes = potionsMediator.getRecipesWithDesiredEffects(desiredEffects, [], false, true);

            assert.equal(resultingRecipes.every(rr => rr.effects.length == desiredEffects.length), true);
            // assert.equal(resultingRecipes.every(rr => new Set(rr.effects).every(rre => new Set(desiredEffects).has(rre))), true);
            assert.equal(desiredEffects.every(de => resultingRecipes.every(rr => new Set(rr.effects).has(de))), true);
        });
    });

});
