let axios = require("axios");
let giantBombKey = require("../apiKeys/apiKeys").giantBombKey;
let filterResponse = require("./HelperFunctions/filterResponseObject");
let _ = require("lodash");
let localDataBase = require("../../models/localDataBase");

module.exports = async function(term) {
  try {
    let giantBombUrl = `https://www.giantbomb.com/api/games/?api_key=${giantBombKey}&format=json&filter=name:${term}`;
    let searchObject = await axios.get(giantBombUrl);
    // chunked to 15 games [[15],[15]...]
    let chunkedArray = _.chunk(searchObject.data.results, 15);
    //create a database
    localDataBase.results = chunkedArray;
    return localDataBase;
  } catch (error) {
    console.log("search Function ERROR", error);
  }
};
