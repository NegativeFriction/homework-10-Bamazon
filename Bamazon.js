var mysql = require("mysql");
var table = require("table");
var inquirer = require("inquirer");
var shoppingCart = [];
var output;
var productsObjs;
var price = 0;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  display();
});

var display = function() {
  connection.query("select * from products", function(err, res) {
    if (err) {
      console.log(err);
    }
    var productsTable = [
      ["ID", "Product", "Price", "Seller", "Quantity in Stock"]
    ];
    productsObjs = [];
    for (var i = 0; i < res.length; i++) {
      var id = res[i].id;
      var name = res[i].productName;
      var price = "$" + res[i].productPrice.toFixed(2);
      var seller = res[i].productSeller;
      var quantity = res[i].productQuantity;
      var newRow = [id, name, price, seller, quantity];
      productsObjs.push(res[i]);
      productsTable.push(newRow);
    }
    output = table.table(productsTable);
    console.log(output);
    choose();
  });
};

function choose() {
  if (shoppingCart.length > 0) {
    inquirer
      .prompt({
        message: "Would you like to check out?",
        name: "confirm",
        type: "confirm",
        default: true
      })
      .then(function(res) {
        if (res.confirm) {
          var i = shoppingCart.length - 1;
          checkOut(i);
        } else {
          buyStuff();
        }
      });
  } else {
    buyStuff();
  }
}

function buyStuff() {
  inquirer
    .prompt([
      {
        message:
          "Please enter the ID number of what you would like to buy. Enter 'q' to quit",
        type: "input",
        name: "entry"
      },
      {
        message: "How many would you like to purchase?",
        type: "input",
        name: "quantity"
      }
    ])
    .then(function(res) {
      var entry = res.entry;
      var quantity = res.quantity;
      if (entry === "q") {
        console.log("logging out");
        connection.end();
      } else if (entry > productsObjs.length || entry <= 0) {
        console.log(
          "Error: You entered an invalid product ID. Please enter a valid product ID."
        );
        choose();
      } else if (
        quantity <= 0 ||
        quantity > productsObjs[entry - 1].productQuantity
      ) {
        console.log(
          "Error: Can't order that quantity of products. Please try again."
        );
        choose();
      } else {
        shoppingCart.push([productsObjs[entry - 1], quantity]);
        price += productsObjs[entry - 1].productPrice * quantity;
        console.log(
          "That item has been added to your cart. Please check out to purchase it."
        );
        display();
      }
    });
}

function checkOut(i) {
  //   console.log("checkout", shoppingCart);
  // console.log("i", i);
  var id = shoppingCart[i][0].id;
  var quantityToBuy = shoppingCart[i][1];
  // console.log("id before query", id);
  connection.query(
    "select productQuantity from products where id=" + id,
    function(err, res) {
      if (err) throw err;
      // console.log("response:", res[0].productQuantity);
      // console.log("i", i);
      var currentQuantity = res[0].productQuantity;
      var finalQuantity = currentQuantity - quantityToBuy;
      // console.log("id when I call changeQuantity", id);
      changeQuantity(finalQuantity, id);

      i--;
      if (i >= 0) {
        checkOut(i);
      } else {
        shoppingCart = [];
        console.log(
          "You spent $" +
            price.toFixed(2) +
            ". You're all checked out, and your cart is empty again!"
        );
        display();
      }
    }
  );
}

function changeQuantity(finalQuantity, id) {
  //   console.log(finalQuantity);
  // console.log("id", id);
  connection.query(
    "update products set ? where ?",
    [{ productQuantity: finalQuantity }, { id: id }],
    function(err, res) {
      if (err) throw err;
      // done += 1;
      // console.log("done", done);
    }
  );
}
