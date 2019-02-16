//used on root route to get games
let axios = require("axios");
let giantBombKey = require("../routes/apiKeys/apiKeys").giantBombKey;
let _ = require("lodash");
let giantBombUrl = `https://www.giantbomb.com/api/games/?api_key=${giantBombKey}&format=json&sort=date_added:desc`;

let dataBase = async function() {
  // get 100 games from giantbomb
  try {
    let results = await axios.get(giantBombUrl);

    // chunked to 15 games [[15],[15]...]
    let chuckedArray = _.chunk(results.data.results, 15);
    //create a database
    class GiantBombGamesDataBase {
      constructor(results) {
        this.results = results;
      }
    }
    console.log(chuckedArray);
    return new GiantBombGamesDataBase(chuckedArray);
  } catch (error) {
    console.log("Database Error", error);
  }
};

module.exports = dataBase();
