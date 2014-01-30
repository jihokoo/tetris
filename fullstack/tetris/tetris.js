function Tetris(width, height){
  this.width = width;
  this.height = height;
  this.aliveCells = []
  this.stillCells = []
}

//create an object for each piece and an object for the board

Tetris.prototype.createAndShowBoard = function () {
  var goltable = document.createElement("table");
  var tablehtml = '';

  for (var h=0; h<this.height; h++) {
    tablehtml += "<tr id='row+" + h + "'>";
    for (var w=0; w<this.width; w++) {
      tablehtml += "<td class='dead' id='" + w + "-" + h + "'></td>";
    }
    tablehtml += "</tr>";
  }

  goltable.innerHTML = tablehtml;
  var board = document.getElementById('board');
  board.appendChild(goltable);
  this.setupBoardEvents();
};

Tetris.prototype.setupBoardEvents = function() {

  var onCellClick = function (event) {
    // coordinates of cell, in case you need them
    var coord_array = this.id.split('-');
    var coord_hash = {x: coord_array[0], y: coord_array[1]};

    // how to set the style of the cell when it's clicked
    if(this.className === "dead") {
      this.className = "alive";
    } else {
      this.className = "dead";
    }
  };

  this.iterateCells(function(cell, x, y) {
    cell.onclick = onCellClick;
  });



  // document.getElementById("play-button").onclick = function(event) {
  //   // debugger;
  //   var timeoutFunction = function() {
  //     self.step();
  //     if(isPlaying) {
  //       setTimeout(timeoutFunction, 100);
  //     }
  //   };
  //   isPlaying = true;
  //   setTimeout(timeoutFunction, 100);
  // };

  // document.getElementById("pause-button").onclick = function(event) {
  //   isPlaying = false;
  // };

  // document.getElementById("reset-button").onclick = function(event) {
  //   self.resetRandom();
  // };

  // document.getElementById("end-button").onclick = function(event) {
  //   self.clearAll();
  // };
  var self = this
  playbutton = document.getElementById("play-button")
  playbutton.onclick = function(){window.setInterval(function(){self.stepDown() || self.randomShapeGenerator()}, 1000)};

  document.onkeydown = function(event) {
    event = event || window.event;
    switch (event.keyCode || event.which) {
      case 37:
      //left
      self.stepSide("Left")
      break;
      case 38:
      //up
      self.rotate();
      break;
      case 39:
      //right
      self.stepSide("Right")
      break;
      case 40:
      //down
      self.stepDown() || self.randomShapeGenerator();
      break;
    }
  };
};


Tetris.prototype.stepDown = function(){
  var killArray = [];
  var createArray = [];
  var stillArray = []
  var value = true
  var self = this
  this.aliveCells.forEach(function(element){
    var x = +element.id.split("-")[0]
    var y = +element.id.split("-")[1]
    var belowNeighbor = document.getElementById((x) + "-" + (y+1));
    if(belowNeighbor && belowNeighbor.className === "still"){
      stillArray.push(element)
    }
    else if(belowNeighbor){
      killArray.push(element);
      createArray.push(belowNeighbor);
    }
    else{
      stillArray.push(element)
    }
  })
  if(stillArray.length > 0){
    stillArray = stillArray.concat(killArray)
    killArray = []
    createArray = []
    value = false
  }

  killArray.forEach(function(cell){
    cell.className = "dead";
  });
  createArray.forEach(function(cell){
    if(createArray.length === 4){
      cell.className = "alive";
    }
  });
  stillArray.forEach(function(cell){
    cell.className = "still";
    self.stillCells.push(cell)
  });
  this.aliveCells = createArray
  this.check();
  return value
};
//******
//******
//or since only four cells are moving at one time
//just store them somewhere and then literally change the position
//by one
Tetris.prototype.stepSide = function(direction){
  var killArray = [];
  var createArray = [];
  var stillArray = []
  var value = true
  var i = -1;

  if(direction==="Right"){
    i = 1;
  }

  this.aliveCells.forEach(function(element){
    var x = +element.id.split("-")[0]
    var y = +element.id.split("-")[1]
    var sideNeighbor = document.getElementById((x+i) + "-" + (y+1));
    if(sideNeighbor && sideNeighbor.className === "still"){
      stillArray.push(element)
    }
    else if(sideNeighbor){
      killArray.push(element);
      createArray.push(sideNeighbor);
    }
    else{
      stillArray.push(element)
    }
  })

  if(stillArray.length > 0){
    createArray = this.aliveCells
  }
  killArray.forEach(function(cell){
    cell.className = "dead";
  });
  createArray.forEach(function(cell){
    if(createArray.length === 4){
      cell.className = "alive";
    }
  });
  this.aliveCells = createArray
  this.check();
  //introduce a delay to let adjusting
  return value
};

Tetris.prototype.rotate = function(){
  var killArray = [];
  var createArray = [];
  var shape = this.aliveCells[4]
  if(shape = "leftSkewPoly"){

  }
  else if(shape = "rightSkewPoly"){

  }
  else if(shape = "leftLPoly"){

  }
  else if(shape = "rightLPoly"){

  }
  else if(shape = "teePoly"){

  }
  else if(shape = "straightPoly"){

  }
};
// i want a shape to be generated when the moving cells come to a stand still
// [x-y+2, x+1-y+1,x-y , x-1-y-1]
// [x+2-y-1, x+1-y-2, x-y-1, x-1-y]
// []


Tetris.prototype.iterateCells = function(iterator) {
  for(var y=0; y < this.height; y++) {
    for(var x=0; x < this.width; x++) {
      var currentCell = document.getElementById(x+"-"+y);
      iterator(currentCell, x, y);
    }
  }
};

Tetris.prototype.check = function(iterator) {
  var cellsToClear = []
  var aboveCells = []
  var value = true
  for(var y=0; y < this.height; y++) {
    var checkRow = []
    for(var x=0; x < this.width; x++) {
      var currentCell = document.getElementById(x+"-"+y);
      if(currentCell.className === "still"){
        aboveCells.push(currentCell)
        checkRow.push(currentCell)
      }
    }
    if(checkRow.length === 10){
        cellsToClear = checkRow
        console.log("hello")
        value = false
        break;
    }
  }
  cellsToClear.forEach(function(cell){
    aboveCells.pop()
    cell.className = "dead"
  })
  value || this.moveDown(aboveCells);
  // this.clearRow();
  //introduce delay here
};

Tetris.prototype.moveDown = function(cellsToMove){
  var killArray = [];
  var createArray = [];
  var self = this
  cellsToMove.forEach(function(element){
    var x = +element.id.split("-")[0]
    var y = +element.id.split("-")[1]
    var belowNeighbor = document.getElementById((x) + "-" + (y+1));
    if(belowNeighbor){
      killArray.push(element);
      createArray.push(belowNeighbor);
    }
  })

  killArray.forEach(function(cell){
    cell.className = "dead";
  });
  createArray.forEach(function(cell){
      cell.className = "still";
  });
}
//should move down all still cells above the row just cleared


Tetris.prototype.randomShapeGenerator = function(shapeCoordinates){
  var shapeCoordinatesArray = [
  ["3-0", "4-0", "5-0", "6-0"],
  ["4-0", "5-0", "4-1", "5-1"],
  ["3-0", "4-0", "4-1", "5-0"],
  ["3-0", "3-1", "4-0", "5-0"],
  ["3-0", "4-0", "5-0", "5-1"],
  ["3-0", "4-0", "4-1", "5-1"],
  ["3-1", "4-0", "4-1", "5-0"]]
  var randomIndex = Math.floor(Math.random()*shapeCoordinatesArray.length);
  var shape;
  var self = this
  shapeCoordinatesArray[randomIndex].forEach(function(coordinate){
    document.getElementById(coordinate).className = "alive"
    self.aliveCells.push(document.getElementById(coordinate))
  })
  if(randomIndex === 6){
      shape = "leftSkewPoly"
  }
  else if(randomIndex === 5){
    shape = "rightSkewPoly"
  }
  else if(randomIndex === 4){
    shape = "leftLPoly"
  }
  else if(randomIndex === 3){
    shape = "rightLPoly"
  }
  else if(randomIndex === 2){
    shape = "teePoly"
  }
  else if(randomIndex === 1){
    shape = "squarePoly"
  }
  else{
    shape = "straightPoly"
  }
  return this.aliveCells
  // this.stepDown();
}
// i want a shape to be generated when the moving cells come to a stand still



// Tetris.prototype.straightPoly = function(){
//   document.getElementById("3-0").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("5-0").className = "alive";
//   document.getElementById("6-0").className = "alive";
// };

// Tetris.prototype.squarePoly = function(){
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("5-0").className = "alive";
//   document.getElementById("4-1").className = "alive";
//   document.getElementById("5-1").className = "alive";
// };

// Tetris.prototype.teePoly = function(){
//   document.getElementById("3-0").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("4-1").className = "alive";
//   document.getElementById("5-0").className = "alive";
// };

// Tetris.prototype.rightLPoly = function(){
//   document.getElementById("3-0").className = "alive";
//   document.getElementById("3-1").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("5-0").className = "alive";
// };

// Tetris.prototype.leftLPoly = function(){
//   document.getElementById("3-0").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("5-0").className = "alive";
//   document.getElementById("5-1").className = "alive";
// };

// Tetris.prototype.rightSkewPoly = function(){
//   document.getElementById("3-0").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("4-1").className = "alive";
//   document.getElementById("5-1").className = "alive";
// };

// Tetris.prototype.leftSkewPoly = function(){
//   document.getElementById("3-1").className = "alive";
//   document.getElementById("4-0").className = "alive";
//   document.getElementById("4-1").className = "alive";
//   document.getElementById("5-0").className = "alive";
// };

startGame = function () {
  var game = new Tetris(10,18);
  game.createAndShowBoard();
  game.randomShapeGenerator();
};

startGame();
//so there are 7 different shapes which should be input at random
//and they time sequence should be set
//if the shape hits the bottom before the time interval is through
//then the next shape should pop up
//left, right, down key should be a different step function
//up is a rotating key
//once the shapes stack up beyond 18 blocks, the game is over


//the rightmost block is block position 6

//there isn't going to be a step button this time, because tetris
//is a continuous game. instead the play button will function as the
//autoplay button that steps the shape down one block


//when i rotate, just change the coordinates a little
