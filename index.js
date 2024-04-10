
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

const givenIngredient = "Diamond";
const givenEffects = [ "Water Walking" ];
const givenBadEffect = "Drain Fatigue";
const givenGoodEffect = "Fortify Speed";
const givenIngredientEffectFalse = "Restore Strength";
const givenEffectIngredientFalse = "Bloat";
const givenIngredientEffectTrue = "Restore Magicka";
const givenEffectIngredientTrue = "Comberry";
const givenCommonEffectIngredient1True = "Black Anther";
const givenCommonEffectIngredient2True = "Bungler's Bane";
const givenCommonEffectIngredient1False = "Coda Flower";
const givenCommonEffectIngredient2False = "Crab Meat";
const givenCommonGoodBadEffectsIngredient1True = "Kwama Cuttle";
const givenCommonGoodBadEffectsIngredient2True = "Violet Coprinus";
const givenCommonGoodEffectsIngredient1True = "";
const givenCommonGoodEffectsIngredient2True = "";
const givenCommonGoodEffectsIngredient1False = "";
const givenCommonGoodEffectsIngredient2False = "";
const givenCommonBadEffectsIngredient1True = "";
const givenCommonBadEffectsIngredient2True = "";
const givenCommonBadEffectsIngredient1False = "";
const givenCommonBadEffectsIngredient2False = "";

const ingredientEffects = getEffectsForIngredient(givenIngredient);
const effectIngredients = getIngredientsWithEffects(givenEffects);
const isBadEffectBad = isBadEffect(givenBadEffect);
const isGoodEffectBad = isBadEffect(givenGoodEffect);
const isIngredientEffectFalse = isIngredientEffect(givenEffectIngredientFalse, givenIngredientEffectFalse);
const isIngredientEffectTrue = isIngredientEffect(givenEffectIngredientTrue, givenIngredientEffectTrue);
const hasCommonEffetsTrue = hasCommonEffects(givenCommonEffectIngredient1True, givenCommonEffectIngredient2True);
const hasCommonEffetsFalse = hasCommonEffects(givenCommonEffectIngredient1False, givenCommonEffectIngredient2False);
const theCommonEffectsTrue = getCommonEffects(givenCommonEffectIngredient1True, givenCommonEffectIngredient2True);
const theCommonEffectsFalse = getCommonEffects(givenCommonEffectIngredient1False, givenCommonEffectIngredient2False);
const hasCommonGoodEffectsTrue = hasCommonEffects(givenCommonGoodBadEffectsIngredient1True, givenCommonGoodBadEffectsIngredient2True, 1);
const hasCommonBadEffectsTrue = hasCommonEffects(givenCommonGoodBadEffectsIngredient1True, givenCommonGoodBadEffectsIngredient2True, -1);
const theCommonGoodEffectsTrue = getCommonEffects(givenCommonGoodBadEffectsIngredient1True, givenCommonGoodBadEffectsIngredient2True, 1);
const theCommonBadEffectsTrue = getCommonEffects(givenCommonGoodBadEffectsIngredient1True, givenCommonGoodBadEffectsIngredient2True, -1);

console.log(`${givenIngredient} has ${ingredientEffects.length} effects: ${ingredientEffects}`);
console.log(`${givenEffects} found in ${effectIngredients.length} ingredients: ${effectIngredients}`);
console.log(`${givenBadEffect} is ${isBadEffectBad ? "bad" : "good"}`);
console.log(`${givenGoodEffect} is ${isGoodEffectBad ? "bad" : "good"}`);
console.log(`${givenIngredientEffectFalse} is${isIngredientEffectFalse ? "" : " not"} an effect of ${givenEffectIngredientFalse}`);
console.log(`${givenIngredientEffectTrue} is${isIngredientEffectTrue ? "" : " not"} an effect of ${givenEffectIngredientTrue}`);
console.log(`${givenCommonEffectIngredient1True} and ${givenCommonEffectIngredient2True} ${hasCommonEffetsTrue ? "has" : "doesn't have"} common effects: ${theCommonEffectsTrue.length ? theCommonEffectsTrue : "None"}`);
console.log(`${givenCommonEffectIngredient1False} and ${givenCommonEffectIngredient2False} ${hasCommonEffetsFalse ? "has" : "doesn't have"} common effects: ${theCommonEffectsFalse.length ? theCommonEffectsFalse : "None"}`);
console.log(`${givenCommonGoodBadEffectsIngredient1True} and ${givenCommonGoodBadEffectsIngredient2True} ${ hasCommonGoodEffectsTrue ? "has" : "doesn't have" } common good effects: ${ theCommonGoodEffectsTrue.length ? theCommonGoodEffectsTrue : "None" }`);
console.log(`${givenCommonGoodBadEffectsIngredient1True} and ${givenCommonGoodBadEffectsIngredient2True} ${ hasCommonBadEffectsTrue ? "has" : "doesn't have" } common bad effects: ${ theCommonBadEffectsTrue.length ? theCommonBadEffectsTrue : "None" }`);
