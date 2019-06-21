class ShipManager{
	
	constructor(){
		//ships, which needed to place
		this.shipsToPlace = [
			new Ship(1, 25, 425, "A0", 5, 1),
			new Ship(2, 165, 465, "A0", 4, 1),
			new Ship(3, 25, 465, "A0", 3, 1),
			new Ship(4, 305, 425, "A0", 2, 1)
		];
		
		//ships wich are placed by the player
		this.ships = [];
		
		//ships, that just hold by the cursor
		this.selectedShip = null;
		
		//ships, placed by the enemy
		this.enemyShips = [];	
	}
	
	//place a ship on an random avaible position for the enemy
	placeShipForEnemy(xLength, yLength){
		var x = 0;
		var y = 0;
		do{
			if(gameManager.getRandomInt(0, 1)==1){
				xLength += yLength;
				yLength = xLength-yLength;
				xLength -= yLength;
			}
			x = gameManager.getRandomInt(0, 10-xLength)*gameManager.rowWidth+25;
			y = gameManager.getRandomInt(0, 10-yLength)*gameManager.columnHeight+25;
			
		var simShip = new Ship(0, x-gameManager.rowWidth, y-gameManager.columnHeight, "A0", xLength+2, yLength+2);
		}while(this.shipsColliding(simShip.x, simShip.y, this.enemyShips, simShip.xUnits, simShip.yUnits).length > 0);
		
		this.enemyShips.push(new Ship(0, x, y, gameManager.gridLegendX[x]+(y+1), xLength, yLength));
	}
		
	//check if a shipp is colliding with an other ship
	shipsColliding(x, y, ships, width, height){
		var colliderLength = width*gameManager.rowWidth-5;
		var colliderHeight = height*gameManager.columnHeight-5;
			
		return ships.filter((ship)=>{
			if(!ship.selected){
				var shipWidth = ship.xUnits*gameManager.rowWidth-5;
				var shipHeight = ship.yUnits*gameManager.columnHeight-5;
				return this.doCollide(x, y, colliderLength, colliderHeight, ship.x, ship.y, shipWidth, shipHeight);
			}
			return false;
		});
	}
	
	//check if two areas are colliding
	doCollide(x1, y1, width1, height1, x2, y2, width2, height2){
		return ( x1 >= x2 && x1 <= x2+width2 || x2 >= x1 && x2 <= x1+width1 ) && ( y1 >= y2 && y1 <= y2+height2 || y2 >= y1 && y2 <= y1+height1 );
	}
	
	//try to place a ship
	unselectShip(tryToPlace){
		if(gameManager.gameState != "PREPEARING")return;
		if(this.selectedShip == null)return;
		if(tryToPlace){
			var row = Math.floor((this.selectedShip.drawX-20)/gameManager.rowWidth);
			var column = Math.floor((this.selectedShip.drawY-20)/gameManager.columnHeight);
			if(row >= 0 && row+this.selectedShip.xUnits <= 10 && column >= 0 && column < 10){
				var x = row*gameManager.rowWidth+25;
				var y = column*gameManager.columnHeight+25;
				
				var simShip = new Ship(0, x-1*gameManager.rowWidth, y-1*gameManager.columnHeight, "A0", this.selectedShip.xUnits+2, this.selectedShip.yUnits+2);
				
				if(!this.shipsColliding(simShip.x, simShip.y, this.ships, simShip.xUnits, simShip.yUnits).length >0){
					this.selectedShip.x = x;
					this.selectedShip.y = y;
					this.selectedShip.coordinate = gameManager.gridLegendX[row]+(column+1);
					
					if(this.ships.indexOf(this.selectedShip) == -1){
						this.ships.push(Object.create(this.selectedShip));
						this.reduceShipToPlace(this.selectedShip);
					}
				}
			}
		}
		this.selectedShip.selected = false;
		this.selectedShip.drawX = this.selectedShip.x;
		this.selectedShip.drawY = this.selectedShip.y;
		this.selectedShip = null;
	}
	
	//reduce the amount of ships to place from a typ of ship, if its placed on the grid
	reduceShipToPlace(shipPlaced){
		var max = Math.max(shipPlaced.xUnits, shipPlaced.yUnits);
		var shipTemplate = this.shipsToPlace.filter((ship)=>ship.xUnits == max);
		if(shipTemplate.length > 0){
			shipTemplate = shipTemplate[0];
			shipTemplate.amount--;
		}
	}
	
	//rotate selectet shipt with key "r"
	keyUp(event){
		if(gameManager.gameState == "PREPEARING" 
			&& event.key.toLowerCase() == "r"
			&& this.selectedShip != null){
				this.selectedShip.xUnits += this.selectedShip.yUnits;
				this.selectedShip.yUnits = this.selectedShip.xUnits-this.selectedShip.yUnits;
				this.selectedShip.xUnits -= this.selectedShip.yUnits;
		}
	}
	
	//place a moved ship, and check if all ships are placed
	mousUpMyCanvas(canvas, event){
		if(gameManager.gameState != "PREPEARING")return;
		this.unselectShip(true);
		if(this.ships.length == 10){
			canvasManager.readyButton.classList.remove("hide");
		}
	}
	
	
	//select the clicked ship to move arround
	mousClickMyCanvas(canvas, e){
		if(gameManager.gameState != "PREPEARING")return;
		var rect = canvas.getBoundingClientRect();
		var mouseX = e.clientX - rect.left;
		var mouseY = e.clientY - rect.top;
		
		if(this.selectedShip == null){
			var ship = this.shipsColliding(mouseX, mouseY, this.ships, 1, 1);
			if(ship.length > 0){
				ship = ship[0];
				this.selectedShip = ship;
					ship.selected = true;
					ship.drawX = mouseX;
					ship.drawY = mouseY;
			}else{
				ship = this.shipsColliding(mouseX, mouseY, this.shipsToPlace, 1, 1);
				if(ship.length > 0 && ship[0].amount > 0){
					this.selectedShip = Object.create(ship[0]);
					this.selectedShip.selected = true;
					this.selectedShip.drawX = mouseX;
					this.selectedShip.drawY = mouseY;
				}
			}
		}
	}
	
	//move the selected ship with the cursor
	mousMoveMyCanvas(canvas, event){
		if(gameManager.gameState != "PREPEARING")return;
		var rect = canvas.getBoundingClientRect();
		var mouseX = event.clientX - rect.left;
		var mouseY = event.clientY - rect.top;
		
		if(this.selectedShip != null){
			this.selectedShip.drawX = mouseX;
			this.selectedShip.drawY = mouseY;
		}
	}
	
}

//instance of the ShipManager
var shipManager = new ShipManager();