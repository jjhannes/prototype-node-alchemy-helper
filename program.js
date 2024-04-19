
const prompt = require("prompt-sync")({ sigint: true });
const potions = require("./potions-mediator");

/*
Known recipes
-------------
const wetrunIngredients = [ "Kagouti Hide", "Kwama Cuttle", "Scales", "Shalk Resin" ];
const fishIngredients = [ "Scrib Jerky", "Scales", "Luminous Russula", "Hackle-Lo Leaf" ];
const healpotIngredients = [ "Marshmerrow", "Wickwheat" ];
const manapotIngredients = [ "Belladonna Berries", "Comberry" ];
const restoreAtaxiaIngredients = [ "Bonemeal", "Dreugh Wax", "Scamp Skin", "Scrib Cabbage" ];
const restoreBrownRotRecipe = [ "Dreugh Wax", "Guar Hide", "Scamp Skin" ];
const restoreDampwormRecipe = [ "Raw Ebony", "Resin" ];
const restoreDroopsRecipe = [ "Dreugh Wax", "Scamp Skin" ];
const restoreGreensporeRecipe = [ "Guar Hide", "Heather" ];
const restoreHelljointRecipe = [ "Bonemeal", "Raw Ebony", "Resin", "Sload Soap" ];
const restoreRattlesRecipe = [ "Bonemeal", "Scathecraw", "Sload Soap", "Trama Root" ];
const restoreRockjointRecipe = [ "Bonemeal", "Sload Soap" ];
const restoreRotboneRecipe = [ "Chokeweed", "Hound Meat" ];
const restoreRustChancreRecipe = [ "Guar Hide", "Heather", "Raw Ebony", "Resin" ];
const restoreSwampFeverRecipe = [ "Dreugh Wax", "Gold Kanet", "Gravedust", "Scales" ];
const restoreYellowTickRecipe = [ "Dreugh Wax", "Raw Ebony", "Resin", "Scamp Skin" ];
const commonEffects = getCommonEffects(wetrunIngredients);
*/

function promptEmptyInput() {
    console.log();
    console.log("You've not provided any desired effects. Please provide a desired effect.");
}

function promptDescription() {
    console.log("What effects would you like your potion to have?");
    console.log("(Press <Enter> to submit and provide additional desired effects)");
    console.log("(Press <Enter> again, i.e. empty value, to accept your selection)");
}

function promptDesiredEffectsAndCalculateRecipe() {
    promptDescription();

    let desiredEffects = [];
    let done = false;
    let input = null;

    while (!done)
    {
        input = prompt("");
        input = input.trim();

        if (!input)
        {
            // Done OR empty input
            if (desiredEffects.length < 1)
            {
                // Empty input
                promptEmptyInput();

                continue;
            }
            else
            {
                done = true;

                continue;
            }
        }
        else
        {
            desiredEffects.push(input);
        }
    }
    
    let possibleRecipes = potions.getRecipesWithDesiredEffects(desiredEffects);

    if (possibleRecipes.length < 1)
    {
        console.log(`There are no recipes that will grant [${desiredEffects.join(" & ")}]`);
    }
    else
    {
        console.log(`There are ${possibleRecipes.length} recipes that will grant [${desiredEffects.join(" & ")}]:`);
        console.log();

        for (recipe of possibleRecipes)
        {
            console.log(recipe);
            console.log();
        }
    }
}

function main() {
    promptDesiredEffectsAndCalculateRecipe();
}

// const desiredEffects = [
//     "Cure Common Disease",
//     "Cure Blight Disease",
// ];
// const unavailableIngredients = [
//     // "Adamantium Ore",
//     // "Bread",
//     // "Durzog Meat",
//     // "Golden Sedge Flowers",
//     // "Grahl Eyeball",
//     // "Heartwood",
//     // "Horn Lily Bulb",
//     // "Lloramor Spines",
//     // "Meadow Rye",
//     // "Meteor Slime",
//     // "Nirthfly Stalks",
//     // "Noble Sedge Flowers",
//     // "Raw Stalhrim",
//     // "Scrap Metal",
//     // "Scrib Cabbage",
//     // "Sweetpulp",
//     // "Timsa-Come-By flowers",
//     // "Wolfsbane Petals"
// ];
// const excludeAllBadEffects = false;
// const matchDesiredEffectsExactly = false;

// let viableRecipes = potions.determineRecipe(desiredEffects, excludeAllBadEffects, matchDesiredEffectsExactly, unavailableIngredients);

// console.log(`There are ${viableRecipes.length} recipes that grant ${desiredEffects}:\n`);
// viableRecipes.map(vr => console.log(vr));

main();
