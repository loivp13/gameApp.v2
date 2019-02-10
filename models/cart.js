module.exports = function Cart({ items = {}, totalQty = 0, totalPrice = 0 }) {
  //REFACTOR
  this.items = items;
  this.totalQty = totalQty;
  this.totalPrice = totalPrice;

  this.add = function(game) {
    let guid = game.guid;
    let item = this.items;
    console.log(game.guid);
    console.log(this.items);
    if (item[guid]) {
      console.log(this.items[guid]);
      item[guid].totalQty++;
      item[guid].totalPrice += game.price;
      this.totalPrice += game.price;
      this.totalQty++;
    } else {
      console.log("new");
      item[guid] = {
        id: guid,
        basePrice: game.price,
        totalQty: 1,
        totalPrice: game.price,
        thumbnail: game.image,
        title: game.title.slice(0, 7).concat("...")
      };
      this.totalPrice += game.price;
      this.totalQty++;
    }
  };

  this.delete = function({ guid, basePrice }) {
    let item = this.items[guid];
    console.log(item);
    console.log(basePrice);
    console.log(totalQty);
    if (item.totalQty !== 1) {
      console.log(item.totalQty);
      item.totalQty -= 1;
      item.totalPrice -= basePrice;
    } else {
      item.totalPrice = 0;
      item.totalQty = 0;
      delete this.items[guid];
    }
  };
};
