
const potions = require("./potions");

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

const desiredEffects = [
    "Cure Common Disease",
    "Cure Blight Disease",
];
const unavailableIngredients = [
    // "Adamantium Ore",
    // "Bread",
    // "Durzog Meat",
    // "Golden Sedge Flowers",
    // "Grahl Eyeball",
    // "Heartwood",
    // "Horn Lily Bulb",
    // "Lloramor Spines",
    // "Meadow Rye",
    // "Meteor Slime",
    // "Nirthfly Stalks",
    // "Noble Sedge Flowers",
    // "Raw Stalhrim",
    // "Scrap Metal",
    // "Scrib Cabbage",
    // "Sweetpulp",
    // "Timsa-Come-By flowers",
    // "Wolfsbane Petals"
];
const excludeAllBadEffects = false;
const matchDesiredEffectsExactly = false;

let viableRecipes = potions.determineRecipe(desiredEffects, excludeAllBadEffects, matchDesiredEffectsExactly, unavailableIngredients);

console.log(`There are ${viableRecipes.length} recipes that grant ${desiredEffects}:\n`);
viableRecipes.map(vr => console.log(vr));
