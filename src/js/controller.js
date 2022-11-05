import * as model from './model.js';
import receipeView from './views/receipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

//
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // Guard Clause
    if (!id) return;
    receipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating Bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    console.log('ID:', id);
    await model.loadRecipe(id);

    // 3) Rendering Recipe
    receipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    receipeView.renderError(`${err} 💥 💥 💥 💥`);
    console.error(err);
  }
};

// Search Results
const controlSearchResults = async function () {
  try {
    // Add spinner
    resultsView.renderSpinner();

    // 1) Get Searched query
    const query = searchView.getQuery();

    // Guard Clause
    if (!query) return resultsView.renderError();

    // 2) Load Search Results:
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial paginations buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Controller
const controlPagination = function (gotoPage) {
  // console.log('Pag controller', gotoPage);

  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));
  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // Update the recipe servings (in state)
  model.updateServings(newServing);
  // Update the recipe view.
  // receipeView.render(model.state.recipe);
  receipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe View
  receipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload recipe to model.
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    receipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render the Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// EVENT LISTENERS
const init = function () {
  // Publisher-Subscriber link
  // So that a link between the view and controller is established
  // and when a DOM manipulation is triggered then it will work.
  // Handler
  bookmarksView.addHandlerRender(controlBookmarks);
  receipeView.addHandlerRender(controlRecipes);
  receipeView.addHandlerUpdateServings(controlServings);
  receipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();
