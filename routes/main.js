// this author.js file was written by me with some help from the template file
module.exports = function (app) {
    //const express = require("express");
    //const router = express.Router();
    // const assert = require('assert');
  
  
    app.get("/home", (req, res) => {
      res.render("home.ejs");
    });
  
  
    app.get("/explorePage", (req, res) => {
      res.render("explorePage.ejs");
    });

    app.get("/myRecipe", (req, res) => {
        res.render("myRecipe.ejs");
    });

    app.get("/folderTemplate", (req, res) => {
      res.render("folderTemplate");
    });

    app.get("/createMyNewRecipe", (req, res) => {
      res.render("createMyNewRecipe");
    });

    app.get("/discussion", (req, res) => {
      res.render("discussion");
    });
  }
  
  
