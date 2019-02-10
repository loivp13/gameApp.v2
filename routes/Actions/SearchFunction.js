let axios = require("axios");
let giantBombKey = require("../apiKeys/apiKeys").giantBombKey;
let filterResponse = require("./HelperFunctions/filterResponseObject");

module.exports = async function(term = "super-smash") {
  try {
    let giantBombUrl = `https://www.giantbomb.com/api/search/?api_key=${giantBombKey}&format=json&query=${term}&resources=game`;

    let searchObject = await axios.get(giantBombUrl);
    if (searchObject.data.results.length > 9) {
      searchObject.data.results.pop();
    }
    return searchObject.data.results.map(gameObj => {
      return filterResponse(gameObj);
    });
  } catch (error) {
    console.log("search Function ERROR", error);
  }
};
