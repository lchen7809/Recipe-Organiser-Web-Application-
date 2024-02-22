/*
  const viewUserRecipeDetails = (recipeId) => {
    const detailsApiUrl = `/user-recipe-details?id=${recipeId}`;
    
    fetch(detailsApiUrl)
      .then((response) => response.json())
      .then((data) => {
        displayRecipeDetails(data);
      })
      .catch((error) => {
        console.error('Error fetching recipe details:', error);
        const errorContainer = document.getElementById('recipe-details-container');
        errorContainer.innerHTML = '<p>Error fetching recipe details</p>';
      });
  };
  */
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
  
    searchButton.addEventListener('click', async () => {
      const searchQuery = document.getElementById('search-query').value;
  
      try {
        const response = await fetch(`/search?query=${searchQuery}`);
        const data = await response.json();
        displaySearchResults(data.edamamRecipes, data.userRecipes);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    });
  });
  
  const displaySearchResults = (edamamRecipes, userRecipes) => {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
  
    if (edamamRecipes.length > 0 || userRecipes.length > 0) {
      if (edamamRecipes.length > 0) {
        edamamRecipes.forEach((recipe) => {
          const recipeDiv = createRecipeDiv(recipe.recipe);
          resultsContainer.appendChild(recipeDiv);
        });
      }
  
      if (userRecipes.length > 0) {
        userRecipes.forEach((recipe) => {
          const recipeDiv = createRecipeDiv(recipe);
          resultsContainer.appendChild(recipeDiv);
        });
      }
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    }
  };
  
  const createRecipeDiv = (recipe) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe';
  
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.label || recipe.name;
  
    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image || ''; // Update this accordingly
    recipeImage.alt = recipe.label || recipe.name;
  
    const viewButton = document.createElement('button');
  viewButton.textContent = 'View Recipe';
  viewButton.addEventListener('click', () => {
    if (isApiRecipe(recipe)) {
      const recipeUri = recipe.uri;
      window.location.href = `/recipe-details?uri=${encodeURIComponent(recipeUri)}`;
    } else {
      window.location.href = `/user-recipe-details?id=${recipe.id}`;
    }
  });

    recipeDiv.appendChild(recipeTitle);
    recipeDiv.appendChild(recipeImage);
    recipeDiv.appendChild(viewButton);
  
    // Handle ingredients based on the source of the recipe
    if (recipe.ingredients) {
      const ingredientsList = document.createElement('ul');
      if (Array.isArray(recipe.ingredients)) {
        // Handle Edamam API recipe
        recipe.ingredients.forEach((ingredient) => {
          const ingredientItem = document.createElement('li');
          ingredientItem.textContent = ingredient.text;
          ingredientsList.appendChild(ingredientItem);
        });
      } else {
        // Handle user recipe
        const userIngredients = recipe.ingredients.split(',');
        userIngredients.forEach((ingredient) => {
          const ingredientItem = document.createElement('li');
          ingredientItem.textContent = ingredient;
          ingredientsList.appendChild(ingredientItem);
        });
      }
      recipeDiv.appendChild(ingredientsList);
    }
  
    return recipeDiv;
  };
 
const isApiRecipe = (recipe) => {
  return recipe.uri !== undefined; 
};

const createRecipeButton = document.getElementById('create-recipe-button');
createRecipeButton.addEventListener('click', () => {
  window.location.href = '/createmynewrecipe';
});

