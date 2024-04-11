
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



const comboMin = 2;
const comboLimit = 4;
var scaffold;
var totalElements = 0;
var validCombos = 0;

if (!scaffold) {
    scaffold = [];
}

// Maximum
for (var dim4 = 0; dim4 <= comboLimit; dim4++) {
    scaffold[dim4] = scaffold[dim4] || [];
    
    for (var dim3 = 0; dim3 <= comboLimit; dim3++) {
        scaffold[dim4][dim3] = scaffold[dim4][dim3] || [];
        
        // Minimum
        for (var dim2 = 0; dim2 <= comboLimit; dim2++) {
            scaffold[dim4][dim3][dim2] = scaffold[dim4][dim3][dim2] || [];
        
            for (var dim1 = 0; dim1 <= comboLimit; dim1++) {
                if (dim4 + dim3 + dim2 + dim1 >= comboMin && dim4 + dim3 + dim2 + dim1 <= comboLimit) {
                    scaffold[dim4][dim3][dim2][dim1] = `(${dim4}, ${dim3}, ${dim2}, ${dim1})`;

                    validCombos++;
                }

                totalElements++;
            }
        }
    }
}

console.log(scaffold);
console.log(`Fin: ${validCombos} / ${totalElements}`);

const waterWalkingIngredients = ["Ampoule Pod", "Kwama Cuttle", "Scales", "Violet Coprinus"];
const fortifySpeedIngredients = ["Kagouti Hide", "Meadow Rye", "Moon Sugar", "Nirthfly Stalks", "Shalk Resin", "Snow Bear Pelt", "Snow Wolf Pelt", "Wolf Pelt"];
const restoreFatigueIngredients = ["Bread", "Chokeweed", "Crab Meat", "Hackle-Lo Leaf", "Hound Meat", "Large Kwama Egg", "Saltrice", "Scrib Jerky", "Scuttle", "Small Kwama Egg"];
const effectIngredients = {
    "Water Walking": waterWalkingIngredients,
    "Fortify Speed": fortifySpeedIngredients,
    "Restore Fatigue": restoreFatigueIngredients
};

// function hasCommonEffects(ingredient1, ingredient2, goodness = 0) {
//     const ingredient1Effects = getEffectsForIngredient(ingredient1);
//     const ingredient2Effects = getEffectsForIngredient(ingredient2);

//     for (var ingredient1Effect of ingredient1Effects) {
//         if (!!ingredient2Effects.find(i2e => i2e == ingredient1Effect)) {
//             if (goodness === 0) {
//                 return true;
//             }
//             else {
//                 if (goodness === -1 && isBadEffect(ingredient1Effect)) {
//                     return true;
//                 }
//                 else if (goodness === 1 && !isBadEffect(ingredient1Effect)) {
//                     return true;
//                 }
//             }
//         }
//     }

//     return false;
// }

// function getCommonEffects(ingredient1, ingredient2, goodness = 0) {
//     const ingredient1Effects = getEffectsForIngredient(ingredient1);
//     const ingredient2Effects = getEffectsForIngredient(ingredient2);

//     return ingredient1Effects.reduce((accumulator, effect, index, effects) => {
//         if (!!ingredient2Effects.find(i2e => i2e == effect)) {
//             if (goodness === 0) {
//                 accumulator.push(effect);
//             }
//             else {
//                 if (goodness === -1 && isBadEffect(effect)) {
//                     accumulator.push(effect);
//                 }
//                 else if (goodness === 1 && !isBadEffect(effect)) {
//                     accumulator.push(effect);
//                 }
//             }
//         }

//         return accumulator;
//     }, []);
// }

// function getCommonEffectsForManyIngredients(ingredients) {
//     // TODO
// }

// function intersect(collections) {
//     return collections.reduce((a, c) => a.filter(i => c.includes(i)));
// }

// const desiredEffects = [ "Water Walking", "Fortify Speed" ];
// const effectIngredients = desiredEffects.reduce((accumulator, desiredEffect) => {
//     var accEffect = Object.keys(accumulator).find(effect => effect === desiredEffect);
//     var ingredientsWithEffect = getIngredientsWithEffects([ desiredEffect ]);

//     if (!accEffect) {
//         accumulator[desiredEffect] = ingredientsWithEffect;
//     }
//     else {
//         accumulator[desiredEffect] = [...new Set(accumulator[desiredEffect].map(i => i))];
//         //accumulator[desiredEffect] = accumulator[desiredEffect].concat(ingredientsWithEffect).dis;
//     }

//     return accumulator;
// }, {});

// 2x2
// const combos2x2 = [ [], [] ];

// // 3x3
// const combos3x3 = [ [ [], [] ], [ [], [] ] ];

// // 4x4
// const combos4x4 = [ [ [ [], [] ], [ [], [] ] ], [ [ [], [] ], [ [], [] ] ] ];

// console.log(getIngredientsWithEffects([ "Water Walking" ]));
// console.log(getIngredientsWithEffects([ "Fortify Speed" ]));
// console.log(getIngredientsWithEffects([ "Restore Fatigue" ]));

//console.log(effectIngredients);

// const restorFatigueEffect = "Restore Fatigue";
// const restoreFatigueIngredients = getIngredientsWithEffects([ restorFatigueEffect ]);

// console.log(restoreFatigueIngredients);

// const primaryEffectIngredients = effectIngredients["Water Walking"];
// const secondaryEffectIngredients = effectIngredients["Fortify Speed"];

// for (var pc = 4; pc >= 0; pc--) {
//     for (var sc = 0; sc <= 4; sc++) {
//         if (pc + sc >= 2 && pc + sc <= 4) {
            

//             console.log(`(${pc}, ${sc})`);
//         }
//     }
// }

// for (var desiredEffect of desiredEffects) {
//     var ingredientsWithEffect = getIngredientsWithEffects([ desiredEffect ]);

//     console.log(`[${desiredEffect}] obtained from [${ingredientsWithEffect}]`);
// }

/*
Water Walking = [ A, B, C, D ]
Fortify Speed = [ E, F, G, H, I, J, K, L ]

This, Water Walking & Fortify Speed =:
[ A, B, E, F ]      [ A, C, E, F ]      [ A, D, E, F ]      [ B, C, E, F ]      [ B, D, E, F ]      [ C, D, E, F ]
[ A, B, E, G ]      [ A, C, E, G ]      [ A, D, E, G ]      [ B, C, E, G ]      [ B, D, E, G ]      [ C, D, E, G ]
[ A, B, E, H ]      [ A, C, E, H ]      [ A, D, E, H ]      [ B, C, E, H ]      [ B, D, E, H ]      [ C, D, E, H ]
[ A, B, E, I ]      [ A, C, E, I ]      [ A, D, E, I ]      [ B, C, E, I ]      [ B, D, E, I ]      [ C, D, E, I ]
[ A, B, E, J ]      [ A, C, E, J ]      [ A, D, E, J ]      [ B, C, E, J ]      [ B, D, E, J ]      [ C, D, E, J ]
[ A, B, E, K ]      [ A, C, E, K ]      [ A, D, E, K ]      [ B, C, E, K ]      [ B, D, E, K ]      [ C, D, E, K ]
[ A, B, E, L ]      [ A, C, E, L ]      [ A, D, E, L ]      [ B, C, E, L ]      [ B, D, E, L ]      [ C, D, E, L ]

[ A, B, F, G ]      [ A, C, F, G ]      [ A, D, F, G ]      [ B, C, F, G ]      [ B, D, F, G ]      [ C, D, F, G ]
[ A, B, F, H ]      [ A, C, F, H ]      [ A, D, F, H ]      [ B, C, F, H ]      [ B, D, F, H ]      [ C, D, F, H ]
[ A, B, F, I ]      [ A, C, F, I ]      [ A, D, F, I ]      [ B, C, F, I ]      [ B, D, F, I ]      [ C, D, F, I ]
[ A, B, F, J ]      [ A, C, F, J ]      [ A, D, F, J ]      [ B, C, F, J ]      [ B, D, F, J ]      [ C, D, F, J ]
[ A, B, F, K ]      [ A, C, F, K ]      [ A, D, F, K ]      [ B, C, F, K ]      [ B, D, F, K ]      [ C, D, F, K ]
[ A, B, F, L ]      [ A, C, F, L ]      [ A, D, F, L ]      [ B, C, F, L ]      [ B, D, F, L ]      [ C, D, F, L ]

[ A, B, G, H ]      [ A, C, G, H ]      [ A, D, G, H ]      [ B, C, G, H ]      [ B, D, G, H ]      [ C, D, G, H ]
[ A, B, G, I ]      [ A, C, G, I ]      [ A, D, G, I ]      [ B, C, G, I ]      [ B, D, G, I ]      [ C, D, G, I ]
[ A, B, G, J ]      [ A, C, G, J ]      [ A, D, G, J ]      [ B, C, G, J ]      [ B, D, G, J ]      [ C, D, G, J ]
[ A, B, G, K ]      [ A, C, G, K ]      [ A, D, G, K ]      [ B, C, G, K ]      [ B, D, G, K ]      [ C, D, G, K ]
[ A, B, G, L ]      [ A, C, G, L ]      [ A, D, G, L ]      [ B, C, G, L ]      [ B, D, G, L ]      [ C, D, G, L ]

[ A, B, H, I ]      [ A, C, H, I ]      [ A, D, H, I ]      [ B, C, H, I ]      [ B, C, H, I ]      [ C, C, H, I ]
[ A, B, H, J ]      [ A, C, H, J ]      [ A, D, H, J ]      [ B, C, H, J ]      [ B, C, H, J ]      [ C, C, H, J ]
[ A, B, H, K ]      [ A, C, H, K ]      [ A, D, H, K ]      [ B, C, H, K ]      [ B, C, H, K ]      [ C, C, H, K ]
[ A, B, H, L ]      [ A, C, H, L ]      [ A, D, H, L ]      [ B, C, H, L ]      [ B, C, H, L ]      [ C, C, H, L ]

[ A, B, I, J ]      [ A, C, I, J ]      [ A, D, I, J ]      [ B, C, I, J ]      [ B, D, I, J ]      [ C, D, I, J ]
[ A, B, I, K ]      [ A, C, I, K ]      [ A, D, I, K ]      [ B, C, I, K ]      [ B, D, I, K ]      [ C, D, I, K ]
[ A, B, I, L ]      [ A, C, I, L ]      [ A, D, I, L ]      [ B, C, I, L ]      [ B, D, I, L ]      [ C, D, I, L ]

[ A, B, J, K ]      [ A, C, J, K ]      [ A, D, J, K ]      [ B, C, J, K ]      [ B, D, J, K ]      [ C, D, J, K ]
[ A, B, J, L ]      [ A, C, J, L ]      [ A, D, J, L ]      [ B, C, J, L ]      [ B, D, J, L ]      [ C, D, J, L ]

[ A, B, K, L ]      [ A, C, K, L ]      [ A, D, K, L ]      [ B, C, K, L ]      [ B, D, K, L ]      [ C, D, K, L ]
*/

// for (var i = 0; i < ingredientsWithDesiredEffects.length; i++) {
//     var ingredientWithDesiredEffect = ingredientsWithDesiredEffects[i];

//     for (var j = i + 1; j < ingredientsWithDesiredEffects.length; j++) {
//         var partnerWithDesiredEffect = ingredientsWithDesiredEffects[j];
//         var commonGoodEffects = getCommonEffects(ingredientWithDesiredEffect, partnerWithDesiredEffect, 1);
//         var commonBadEffects = getCommonEffects(ingredientWithDesiredEffect, partnerWithDesiredEffect, -1);

//         if (!!commonGoodEffects.length || !!commonBadEffects.length) {
//             console.log(`A potion made with [${ingredientWithDesiredEffect}] & [${partnerWithDesiredEffect}] will have:`);
            
//             if (!!commonGoodEffects.length) {
//                 console.log(` - ${commonGoodEffects.length} good effects: ${commonGoodEffects}`);
//             }
//             if (!!commonBadEffects.length) {
//                 console.log(` - ${commonBadEffects.length} bad effects: ${commonBadEffects}`);
//             }
//         }
//     }
// }


