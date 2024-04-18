
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

function getCommonEffects(ingredients) {
    const ingredientsEffects = ingredients.map(ie => getEffectsForIngredient(ie));
    let intersection = [];
    
    for (let primary = 0; primary < ingredientsEffects.length; primary++) {
        let primarySet = ingredientsEffects[primary];

        for (let secondary = primary + 1; secondary < ingredientsEffects.length; secondary++) {
            let secondarySet = ingredientsEffects[secondary];
            let matches = primarySet.filter(pe => secondarySet.includes(pe));

            if (!!matches.length) {
                intersection = matches.reduce((accumulator, effect) => {
                    if (!accumulator.includes(effect)) {
                        accumulator.push(effect);
                    }
                    
                    return accumulator;
                }, intersection)
            }
        }
    }
    
    return intersection;
}

function compileRawRecpie(ingredients, effects) {
    return {
        ingredients: ingredients.sort(),
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

function determineRecipe(desiredEffects, excludedIngredients = [], excludeAllBadEffects = false, matchDesiredEffectsExactly = false) {
    excludedIngredients = excludedIngredients || [];
    
    let viableRecipes = [];
    let possibleIngredients = getIngredientsWithEffects(desiredEffects);

    if (excludedIngredients.length > 0) {
        let countBeforeFilter = possibleIngredients.length;

        possibleIngredients = possibleIngredients.filter(pi => !excludedIngredients.includes(pi));

        if (countBeforeFilter != possibleIngredients.length) {
            console.warn(`${countBeforeFilter - possibleIngredients.length} of ${countBeforeFilter} unavailable ingredients filtered out.`);
        }
    }
    
    // Two ingredients
    for (let primary = 0; primary < possibleIngredients.length; primary++) {
        let primaryIngredient = possibleIngredients[primary];
    
        for (let secondary = primary + 1; secondary < possibleIngredients.length; secondary++) {
            let secondaryIngredient = possibleIngredients[secondary];
            let commonEffects = getCommonEffects([ primaryIngredient, secondaryIngredient ]);
    
            if (!!desiredEffects.every(de => commonEffects.includes(de))) {
                viableRecipes.push(compileRawRecpie([ primaryIngredient, secondaryIngredient ], commonEffects));
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
    
                if (!!desiredEffects.every(de => commonEffects.includes(de))) {
                    viableRecipes.push(compileRawRecpie([ primaryIngredient, secondaryIngredient, tertiaryIngredient ], commonEffects));
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
        
                    if (!!desiredEffects.every(de => commonEffects.includes(de))) {
                        viableRecipes.push(compileRawRecpie([ primaryIngredient, secondaryIngredient, tertiaryIngredient, quaternaryIngredient ], commonEffects));
                    }
                }
            }
        }
    }
    
    if (excludeAllBadEffects) {
        let countBeforeFilter = viableRecipes.length;
    
        viableRecipes = viableRecipes.filter(r => r.badEffects.length < 1);
    
        if (countBeforeFilter != viableRecipes.length) {
            console.warn(`${countBeforeFilter - viableRecipes.length} of ${countBeforeFilter} recipies with bad effects filtered out.`);
        }
    }
    
    if (matchDesiredEffectsExactly) {
        let countBeforeFilter = viableRecipes.length;
    
        viableRecipes = viableRecipes.filter(r => r.goodEffects.length == desiredEffects.length);
    
        if (countBeforeFilter != viableRecipes.length) {
            console.warn(`${countBeforeFilter - viableRecipes.length} of ${countBeforeFilter} recipies with additional good effects filtered out.`);
        }
    }

    let sortedRecipes = viableRecipes.sort(sort_BadEffectsAsc_IngredientsAsc_GoodEffectsDesc);
    // let formattedRecipes = sortedRecipes.map(r => compileFormattedRecipe(r));

    return sortedRecipes;
}

module.exports = {
    determineRecipe: determineRecipe
};
