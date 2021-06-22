var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
    { locations: ["0", "0", "0"], hits: ["", "", ""] },
  ],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (ship.hits[index] === "hit") {
        view.displayMessage("Ой, вы уже попали в это место!");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Попал!");

        if (this.isSunk(ship)) {
          view.displayMessage("Ты потопил мой корабль!");
          this.shipsSunk++;
        }

        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Ты промазал!");

    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
    // Когда корабль потоплен isSunk будет верно, если нет будет ложь
  },

  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },


  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }

    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }

      }

    }
    return false;
  }


};

var controller = {
  guesses: 0,

  processGuess: function (guess) {
    if (guess) {
      this.guesses++;
      var hit = model.fire(guess);
      if (hit && model.shipsSunk == model.numShips) {
        view.displayMessage(
          "Вы потопили все мои корабли! " +
          "<br/>" +
          "Количество выстрелов: " +
          this.guesses
        );
      }
    }
  }
};




function myHandler(eventObj) {
  var image = eventObj.target;
  var guess = image.id;
  controller.processGuess(guess);

}


function init() {
  model.generateShipLocations();
  var images = document.getElementsByTagName("td");
  for (var i = 0; i < images.length; i++) {
    images[i].onclick = myHandler;
  }
}


window.onload = init;
