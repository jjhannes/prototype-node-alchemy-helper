
const data = require("./ingredient-effect.json");

function getEffectsForIngredient(ingredient) {
    let ingredientKey = Object.keys(data)
        .filter(k => k.toLowerCase() == ingredient.toLowerCase());

    return data[ingredientKey];
}

function getIngredientsWithEffects(effects) {
    const ingredients = [];

    Object.keys(data).forEach(ingredient => {
        var ingredientEffects = getEffectsForIngredient(ingredient);

        effects.forEach(effect => {
            if (!!ingredientEffects.find(ie => ie.toLowerCase() == effect.toLowerCase()))
                if (!ingredients.find(i => ingredient.toLowerCase() == i.toLowerCase()))
                    ingredients.push(ingredient);
        })
    });

    return ingredients;
}

function isIngredientEffect(ingredient, effect) {
    const ingredientEffects = getEffectsForIngredient(ingredient);

    return !!ingredientEffects.find(ie => ie == effect);
}

function isIngredient(ingredient) {
    return Object.keys(data)
        .some(k => k.toLowerCase() == ingredient.toLowerCase());
}

function isEffect(effect) {
    flattenedEffects = Object.keys(data)
        .reduce((accumulator, ingredient) => {
            let ingredientEffects = getEffectsForIngredient(ingredient);
            accumulator = accumulator.concat(ingredientEffects)
            let accumulatorSet = new Set(accumulator);
            
            return Array.from(accumulatorSet);
        }, []);

    return flattenedEffects.some(e => e.toLowerCase() == effect.toLowerCase());
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

function getCommonEffects(ingredients) {
    const ingredientsEffects = ingredients.map(ie => getEffectsForIngredient(ie));
    let intersection = [];
    
    for (let primary = 0; primary < ingredientsEffects.length; primary++) {
        let primarySet = ingredientsEffects[primary];

        for (let secondary = primary + 1; secondary < ingredientsEffects.length; secondary++) {
            let secondarySet = ingredientsEffects[secondary];
            let matches = primarySet.filter(pe => secondarySet.some(se => se.toLowerCase() == pe.toLowerCase()));

            if (!!matches.length) {
                intersection = matches.reduce((accumulator, effect) => {
                    if (!accumulator.some(ae => ae.toLowerCase() == effect.toLowerCase())) {
                        accumulator.push(effect);
                    }
                    
                    return accumulator;
                }, intersection)
            }
        }
    }
    
    return intersection;
}

function compileRawRecipe(ingredients, effects) {
    return {
        ingredients: ingredients.sort(),
        effects: effects.sort(),
        goodEffects: effects.filter(e => !isBadEffect(e)).sort(),
        badEffects: effects.filter(e => isBadEffect(e)).sort()
    };
}

function compileFormattedRecipe(recipe) {
    return {
        ingredients: recipe.ingredients.reduce((text, ingredient) => {
            if (text.length > 0) {
                text += ", ";
            }

            text += ingredient;

            return text;
        }, ""),
        goodEffects: recipe.goodEffects.reduce((text, effect) => {
            if (text.length > 0) {
                text += ", ";
            }

            text += effect;

            return text;
        }, ""),
        badEffects: recipe.badEffects.reduce((text, effect) => {
            if (text.length > 0) {
                text += ", ";
            }

            text += effect;

            return text;
        }, "") || "None"
    }
}

function sort_BadEffectsAsc_IngredientsAsc_GoodEffectsDesc(a, b) {
    if (a.badEffects.length == b.badEffects.length) {
        if (a.ingredients.length == b.ingredients.length) {
            if (a.goodEffects.length == b.goodEffects.length) {
                return 0;
            }
            else if (a.goodEffects.length > b.goodEffects.length) {
                return -1;
            }
            else /*(a.goodEffects.length < b.goodEffects.length)*/ {
                return 1;
            }
        }
        else if (a.ingredients.length > b.ingredients.length) {
            // More ingredients is worse
            return 1;
        }
        else /*(a.ingredients.length < b.ingredients.length)*/ {
            // Fewer ingredients is better
            return -1;
        }
    }
    else if (a.badEffects.length > b.badEffects.length) {
        return 1;
    }
    else /*(a.badEffects.length < b.badEffects.length)*/ {
        return -1;
    }
    
    return 0;
}

// Takes a collection of ingredients and returns any ingredients that are invalid.
// That means if the resulting collection is empty, all given ingredients are valid.
// Conversely, if the any items are returned, those ingredients are invalid
function validateIngredients(ingredients) {
    return ingredients.filter(i => !isIngredient(i));
}

// Takes a collection of effects and returns any effects that are invalid.
// That means if the resulting collection is empty, all given effects are valid.
// Conversely, if the any items are returned, those effects are invalid
function validateEffects(effects) {
    return effects.filter(e => !isEffect(e));
}

function getRecipesWithDesiredEffects(desiredEffects, excludedIngredients = [], excludeBadPotions = false, exactlyMatchDerisedEffects = false) {
    excludedIngredients = excludedIngredients || [];
    
    let viableRecipes = [];
    let possibleIngredients = getIngredientsWithEffects(desiredEffects);

    if (excludedIngredients.length > 0) {
        let countBeforeFilter = possibleIngredients.length;

        possibleIngredients = possibleIngredients.filter(pi => !excludedIngredients.some(ei => ei.toLowerCase() == pi.toLowerCase()));

        if (countBeforeFilter != possibleIngredients.length) {
            console.warn(`${countBeforeFilter - possibleIngredients.length} of ${countBeforeFilter} excluded ingredients filtered out.`);
        }
    }
    
    // Two ingredients
    for (let primary = 0; primary < possibleIngredients.length; primary++) {
        let primaryIngredient = possibleIngredients[primary];
    
        for (let secondary = primary + 1; secondary < possibleIngredients.length; secondary++) {
            let secondaryIngredient = possibleIngredients[secondary];
            let commonEffects = getCommonEffects([ primaryIngredient, secondaryIngredient ]);
    
            if (!!desiredEffects.every(de => commonEffects.some(ce => ce.toLowerCase() == de.toLowerCase()))) {
                viableRecipes.push(compileRawRecipe([ primaryIngredient, secondaryIngredient ], commonEffects));
            }
        }
    }
    
    // Three ingredients
    for (let primary = 0; primary < possibleIngredients.length; primary++) {
        let primaryIngredient = possibleIngredients[primary];
    
        for (let secondary = primary + 1; secondary < possibleIngredients.length; secondary++) {
            let secondaryIngredient = possibleIngredients[secondary];
            
            for (let tertiary = secondary + 1; tertiary < possibleIngredients.length; tertiary++) {
                let tertiaryIngredient = possibleIngredients[tertiary];
                let commonEffects = getCommonEffects([ primaryIngredient, secondaryIngredient, tertiaryIngredient ]);
    
                if (!!desiredEffects.every(de => commonEffects.some(ce => ce.toLowerCase() == de.toLowerCase()))) {
                    viableRecipes.push(compileRawRecipe([ primaryIngredient, secondaryIngredient, tertiaryIngredient ], commonEffects));
                }
            }
        }
    }
    
    // Four ingredients
    for (let primary = 0; primary < possibleIngredients.length; primary++) {
        let primaryIngredient = possibleIngredients[primary];
    
        for (let secondary = primary + 1; secondary < possibleIngredients.length; secondary++) {
            let secondaryIngredient = possibleIngredients[secondary];
            
            for (let tertiary = secondary + 1; tertiary < possibleIngredients.length; tertiary++) {
                let tertiaryIngredient = possibleIngredients[tertiary];
                
                for (let quaternary = tertiary + 1; quaternary < possibleIngredients.length; quaternary++) {
                    let quaternaryIngredient = possibleIngredients[quaternary];
                    let commonEffects = getCommonEffects([ primaryIngredient, secondaryIngredient, tertiaryIngredient, quaternaryIngredient ]);
        
                    if (!!desiredEffects.every(de => commonEffects.some(ce => ce.toLowerCase() == de.toLowerCase()))) {
                        viableRecipes.push(compileRawRecipe([ primaryIngredient, secondaryIngredient, tertiaryIngredient, quaternaryIngredient ], commonEffects));
                    }
                }
            }
        }
    }
    
    if (excludeBadPotions) {
        let countBeforeFilter = viableRecipes.length;
    
        viableRecipes = viableRecipes.filter(r => r.badEffects.length < 1);
    
        if (countBeforeFilter != viableRecipes.length) {
            console.warn(`${countBeforeFilter - viableRecipes.length} of ${countBeforeFilter} recipies with bad effects filtered out.`);
        }
    }
    
    if (exactlyMatchDerisedEffects) {
        let countBeforeFilter = viableRecipes.length;
        
        // viableRecipes = viableRecipes.filter(r => r.effects.length == desiredEffects.length);
        let desiredEffectsLowerCase = desiredEffects.map(de => de.toLowerCase());
        viableRecipes = viableRecipes.filter(r => {
            let viableRecipeEffectLowerCase = r.effects.map(vre => vre.toLowerCase());

            return ((new Set(viableRecipeEffectLowerCase)).size === (new Set(desiredEffectsLowerCase)).size) && 
                [...(new Set(viableRecipeEffectLowerCase))].every(value => (new Set(desiredEffectsLowerCase)).has(value))
        });
    
        if (countBeforeFilter != viableRecipes.length) {
            console.warn(`${countBeforeFilter - viableRecipes.length} of ${countBeforeFilter} recipies with additional good effects filtered out.`);
        }
    }

    let sortedRecipes = viableRecipes.sort(sort_BadEffectsAsc_IngredientsAsc_GoodEffectsDesc);
    // let formattedRecipes = sortedRecipes.map(r => compileFormattedRecipe(r));

    return sortedRecipes;
}

function getRecipeFromIngredients(ingredients) {
    let commonEffects = getCommonEffects(ingredients);
    let sourceIngredients = Object.keys(data).reduce((acc, key) => {
        if (ingredients.some(i => i.toLowerCase() == key.toLowerCase()))
            acc.push(key);

        return acc;
    }, []);
    let compiledRecipe = compileRawRecipe(sourceIngredients, commonEffects);

    return compiledRecipe;
}

module.exports = {
    getRecipesWithDesiredEffects: getRecipesWithDesiredEffects,
    getRecipeFromIngredients: getRecipeFromIngredients,
    validateIngredients: validateIngredients,
    validateEffects: validateEffects
};
