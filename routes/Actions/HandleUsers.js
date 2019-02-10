module.exports = function(username, game) {
  let user = {
    user1: {
      username,
      wishList: [],
      total: 0
    }
  };
  let parseGame = JSON.parse(game);
  user.user1.wishList.push(parseGame[0]);
  user.user1.total += parseGame[1];
  console.log(user);
  return user;
};
