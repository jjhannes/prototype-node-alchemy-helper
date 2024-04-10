
const data = require("./ingredient-effect.json");

function getEffectsForIngredient(ingredient) {
    return data[ingredient];
}

function getIngredientsWithEffects(effects) {
    const ingredients = [];

    Object.keys(data).forEach(ingredient => {
        var ingredientEffects = getEffectsForIngredient(ingredient);

        effects.forEach(effect => {
            if (!!ingredientEffects.find(ie => ie == effect))
                if (!ingredients.find(i => ingredient == i))
                    ingredients.push(ingredient);
        })
    });

    return ingredients;
}

function isIngredientEffect(ingredient, effect) {
    const ingredientEffects = getEffectsForIngredient(ingredient);

    return !!ingredientEffects.find(ie => ie == effect);
}

function isBadEffect(effect) {
    // Requires toLower or toUpper
    effect = effect.toLowerCase();

    if (effect.includes("cure") || effect.includes("resist"))
        return false;

    return effect.includes("burden") ||
        effect.includes("poison") ||
        effect.includes("blind") ||
        effect.includes("damage") ||
        effect.includes("drain") ||
        effect.includes("paralyz") ||
        effect.includes("weakness") ||
        effect.includes("vampirism");
}

function hasCommonEffects(ingredient1, ingredient2, goodness = 0) {
    const ingredient1Effects = getEffectsForIngredient(ingredient1);
    const ingredient2Effects = getEffectsForIngredient(ingredient2);

    for (var ingredient1Effect of ingredient1Effects) {
        if (!!ingredient2Effects.find(i2e => i2e == ingredient1Effect)) {
            if (goodness === 0) {
                return true;
            }
            else {
                if (goodness === -1 && isBadEffect(ingredient1Effect)) {
                    return true;
                }
                else if (goodness === 1 && !isBadEffect(ingredient1Effect)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function getCommonEffects(ingredient1, ingredient2, goodness = 0) {
    const ingredient1Effects = getEffectsForIngredient(ingredient1);
    const ingredient2Effects = getEffectsForIngredient(ingredient2);

    return ingredient1Effects.reduce((accumulator, effect, index, effects) => {
        if (!!ingredient2Effects.find(i2e => i2e == effect)) {
            if (goodness === 0) {
                accumulator.push(effect);
            }
            else {
                if (goodness === -1 && isBadEffect(effect)) {
                    accumulator.push(effect);
                }
                else if (goodness === 1 && !isBadEffect(effect)) {
                    accumulator.push(effect);
                }
            }
        }

        return accumulator;
    }, []);
}

const desiredEffects = [ "Water Walking", "Fortify Speed" ];

for (var desiredEffect of desiredEffects) {
    const ingredientsWithDesiredEffect = getIngredientsWithEffects([desiredEffect]);

    for (var i = 0; i < ingredientsWithDesiredEffect.length; i++) {
        var ingredientWithDesiredEffect = ingredientsWithDesiredEffect[i];

        for (var j = i + 1; j < ingredientsWithDesiredEffect.length; j++) {
            var partnerWithDesiredEffect = ingredientsWithDesiredEffect[j];
            var commonGoodEffects = getCommonEffects(ingredientWithDesiredEffect, partnerWithDesiredEffect, 1);
            var commonBadEffects = getCommonEffects(ingredientWithDesiredEffect, partnerWithDesiredEffect, -1);

            if (!!commonGoodEffects.length || !!commonBadEffects.length) {
                console.log(`A potion made with [${ingredientWithDesiredEffect}] & [${partnerWithDesiredEffect}] will have:`);
                
                if (!!commonGoodEffects.length) {
                    console.log(` - ${commonGoodEffects.length} good effects: ${commonGoodEffects}`);
                }
                if (!!commonBadEffects.length) {
                    console.log(` - ${commonBadEffects.length} bad effects: ${commonBadEffects}`);
                }
            }
        }
    }
    
    // console.log(`Ingredients with [${desiredEffect}] are [${ingredientsWithDesiredEffect}]`);
}


