const express = require('express');
require('./dbConnect');
const Recipe = require('./recipeModel');
const app = express();

app.use(express.json());

async function createNewRecipe(newRecipe){
  try {
    const recipe = new Recipe(newRecipe)
    const saveRecipe = await recipe.save();
    return saveRecipe;
  }catch(error){
    throw error;
  }
}
app.post('/recipes', async (req, res) => {
  try {
    const savedRecipe = await createNewRecipe(req.body);
    res.status(200).json({message: "Recipe added successfully.", recipe: savedRecipe })
  } catch (error){
    console.log("Error occurred: ", error);
    res.status(500).json({error: "Failed to add new Recipe."})
  }
});

async function readAllRecipes(recipeTitle){
  try {
    const allRecipe = await Recipe.find();
    return allRecipe
  }catch (error) {
    throw error;
  }
}
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await readAllRecipes();
    if(recipes.length != 0){
      res.json(recipes)
    }else {
      res.status(404).json({error: "No recipe data found."})
    }
  }catch(error){
    console.log('Error occurred: ', error);
    res.status(500).json({error: 'Failed to get recipes.'})
    }
});

async function readRecipesByTitle(titleName){
  try{
    const recipeTitle = await Recipe.find({title: titleName});
    return recipeTitle;
  }catch(error){
    throw error;
  }
}
app.get('/recipes/title/:titleName', async (req, res) => {
  try{
    const recipes = await readRecipesByTitle(req.params.titleName);
    if(recipes.length != 0){
      res.json(recipes);
    }else {
      res.status(404).json({error: "No recipe data found."})
    }
    }catch(error){
    console.log('Error occurred: ', error);
    res.status(500).json({error: 'Failed to get recipes.'})
  }
});

async function readRecipesByAuthor(authorName){
  try{
    const recipeAuthor = await Recipe.find({author: authorName});
    return recipeAuthor;
  }catch(error){
    throw error;
  }
}
app.get('/recipes/author/:authorName', async (req, res) => {
  try{
    const recipes = await readRecipesByAuthor(req.params.authorName);
    if(recipes.length != 0){
      res.json(recipes);
    }else {
      res.status(404).json({error: "No recipe data found."})
    }
    }catch(error){
    console.log('Error occurred: ', error);
    res.status(500).json({error: 'Failed to get recipes.'})
  }
});

async function readRecipesBydifficulty(level){
  try{
    const recipeLevel = await Recipe.find({difficulty: level});
    return recipeLevel;
  }catch(error){
    throw error;
  }
}
app.get('/recipes/level/:recipeLevel', async (req, res) => {
  try{
    const recipes = await readRecipesBydifficulty(req.params.recipeLevel);
    if(recipes.length != 0){
      res.json(recipes);
    }else {
      res.status(404).json({error: "No recipe data found."})
    }
    }catch(error){
    console.log('Error occurred: ', error);
    res.status(500).json({error: 'Failed to get recipes.'})
  }
});

async function updateRecipeById(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true});
    return updatedRecipe
  }catch(error){
    console.log('Error in updating recipe.', error)
  }
}
app.post('/recipes/:recipeId', async (req, res) => {
  try {
    const recipeUpdated = await updateRecipeById(req.params.recipeId, req.body);
    if(recipeUpdated){
      res.status(200).json({ message:  "Recipe updated successfully,", recipe: recipeUpdated})
    }else {
    res.status(404).json({ error: "Recipe does not exist."})
  }
  }catch(error){
  res.status(500).json({error: "Failed to update Recipe."})
  }
});


async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true});
    return updatedRecipe
  }catch(error){
    console.log('Error in updating recipe.', error)
  }
}
app.post('/recipes/title/:recipeTitle', async (req, res) => {
  try {
    const recipeUpdated = await updateRecipeByTitle(req.params.recipeTitle, req.body);
    if(recipeUpdated){
      res.status(200).json({ message:  "Recipe updated successfully,", recipe: recipeUpdated})
    }else {
    res.status(404).json({ error: "Recipe does not exist."})
  }
  }catch(error){
  res.status(500).json({error: "Failed to update Recipe."})
  }
});

async function deleteRecipeById(recipeId){
  try {
    const deletedRecipe= await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe
  }catch (error){
    console.log(error)
  }
}
app.delete('/recipes/:recipeId', async (req, res) => {
  try {
    const recipeToBeDeleted = await deleteRecipeById(req.params.recipeId);
    if(recipeToBeDeleted){
      res.status(200).json({message: "Recipe deleted successfully,", recipe: recipeToBeDeleted})
    }  else {
      res.status(404).json({error: "Recipe not found."})
    }
  }catch (error){
    res.status(500).json({ error: "Failed to delete Recipe."})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
})