function Tetris(width, height){
  this.width = width;
  this.height = height;
  this.aliveCells = [];
  this.stillCells = [];
  this.aliveShape;
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


  var self = this
  playbutton = document.getElementById("play-button")
  playbutton.onclick = function(){window.setInterval(function(){self.stepDown() || self.randomShapeGenerator()}, 1100)};

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


Tetris.prototype.stepSide = function(direction){
  var killArray = [];
  var createArray = [];
  var stillArray = []
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
};

Tetris.prototype.rotate = function(){
  var neighborCells = []
  var newCoordinates = []
  var self = this
  var counter = 0
  console.log("hello")
  if(this.aliveShape.name === "leftSkew" || this.aliveShape.name === "rightSkew" || this.aliveShape.name === "straightPoly"){
    newCoordinates = self.aliveShape.rotate[self.aliveShape.mod]
    self.aliveShape.mod = (self.aliveShape.mod + 1)%2
  }
  else if(this.aliveShape.mod !== undefined){
    newCoordinates = self.aliveShape.rotate[self.aliveShape.mod]
    self.aliveShape.mod = (self.aliveShape.mod + 1)%4
  }
  else{
    neighborCells = this.aliveCells
    this.aliveCells = []
    counter = 4
  }
  newCoordinates.forEach(function(element){
      var x = +element.split(" ")[0]
      var y = +element.split(" ")[1]
      var a = +self.aliveCells[counter].id.split("-")[0]
      var b = +self.aliveCells[counter].id.split("-")[1]
      var replacer = document.getElementById((x+a)+"-"+(y+b))
      if(replacer){
        neighborCells.push(replacer)
        counter++
      }
  })

  this.aliveCells.forEach(function(element){
    if(counter===4){
      element.className = "dead"
    }
  });

  neighborCells.forEach(function(element){
    if(counter===4){
      element.className = "dead"
    }
  });

  if(counter===4){
    this.aliveCells = neighborCells
  }
  else{
    this.aliveShape.mod = this.aliveShape.mod - 1
  }
};

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

  var leftSkew = {
    name: "leftSkew",
    position: ["3-0", "4-0", "4-1", "5-1"],
    rotate: [[(0)+" "+(0), (0)+" "+(0), (0)+" "+(-2), (-2)+" "+(0)],
    [(0)+" "+0, (0)+" "+(0), (0)+" "+(2), (2)+" "+(0)]],
    mod: 0
  }

  var rightSkew = {
    name: "rightSkew",
    position: ["3-1", "4-0", "4-1", "5-0"],
    rotate: [[(2)+" "+(0), (0)+" "+(0), (0)+" "+(-2), (0)+" "+(0)],
    [(-2)+" "+(0), (0)+" "+(0), (0)+" "+(2), (0)+" "+(0)]],
    mod: 0
  }

  var leftPoly = {
    name: "leftPoly",
    position: ["3-0", "4-0", "5-0", "5-1"],
    rotate: [[(2)+" "+(-1), (0)+" "+(1), (0)+" "+(0), (0)+" "+(0)],
    [(-2)+" "+(1), (0)+" "+(0), (-2)+" "+(1), (0)+" "+(0)],
    [(0)+" "+(0), (-1)+" "+(-2), (0)+" "+(0), (-1)+" "+(-2)],
    [(0)+" "+(0), (1)+" "+(1), (2)+" "+(-1), (1)+" "+(2)]],
    mod: 0
  }

  var rightPoly = {
    name: "rightPoly",
    position: ["3-0", "3-1", "4-0", "5-0"],
    rotate: [[(1)+" "+(-1), (2)+" "+(0), (1)+" "+(-1), (0)+" "+(0)],
    [(0-1)+" "+(2), (0)+" "+(0), (-1)+" "+(2), (0)+" "+(0)],
    [(0)+" "+(-1), (-2)+" "+(0), (0)+" "+(0), (-2)+" "+(-1)],
    [(0)+" "+(0), (0)+" "+(0), (0)+" "+(-1), (2)+" "+(1)]],
    mod: 0
  }

  var straightPoly = {
    name: "straightPoly",
    position: ["3-0", "4-0", "5-0", "6-0"],
    rotate: [[(2)+" "+(-1), (1)+" "+(1), (0)+" "+(0), (-1)+" "+(-2)],
    [(-2)+" "+(1), (-1)+" "+(-1), (0)+" "+(0), (1)+" "+(2)]],
    mod: 0
  }

  var teePoly = {
    name: "teePoly",
    position: ["3-0", "4-0", "4-1", "5-0"],
    rotate: [[(0)+" "+(0), (0)+" "+(0), (0)+" "+(0), (-1)+" "+(-1)],
    [(0)+" "+(1), (0)+" "+(0), (0)+" "+(0), (0+1)+" "+(2)],
    [(1)+" "+(-2), (0)+" "+(0), (0)+" "+(0), (0)+" "+(-1)],
    [(-1)+" "+(1), (0)+" "+(0), (0)+" "+(0), (0)+" "+(0)]],
    mod: 0
  }

  var squarePoly = {
    name: "squarePoly",
    position: ["4-0", "5-0", "4-1", "5-1"],
  }

  var shapeCoordinatesArray = [leftSkew, rightSkew, leftPoly, rightPoly, straightPoly, teePoly, squarePoly]

  var randomIndex = Math.floor(Math.random()*shapeCoordinatesArray.length);
  var shape;
  var self = this
  shapeCoordinatesArray[randomIndex].position.forEach(function(coordinate){
    document.getElementById(coordinate).className = "alive"
    self.aliveCells.push(document.getElementById(coordinate))
  })
  this.aliveShape = shapeCoordinatesArray[randomIndex];
  console.log(this.aliveShape)
  // this.stepDown();
}

startGame = function () {
  var game = new Tetris(10,18);
  game.createAndShowBoard();
  game.randomShapeGenerator();
};

startGame();

//make the buttons work
//make game end when it reaches the top

