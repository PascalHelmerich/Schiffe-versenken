class GameManager{
	constructor(){
		this.gameState = "PREPEARING";
	
		this.tipps = [];
		this.enemyPossibleTipps = [];
		this.enemyTipps=[];
		
		this.gridLegendX = "ABCDEFGHIJ";
		this.rowWidth = 40;
		this.columnHeight = 40;
		
	}
	
	//starts the game and initzialise the enemys ships
	startGame(){
		this.gameState = "READY";
		canvasManager.readyButton.classList.add("hide");
		
		shipManager.placeShipForEnemy(5, 1);
		shipManager.placeShipForEnemy(4, 1);
		shipManager.placeShipForEnemy(4, 1);
		shipManager.placeShipForEnemy(3, 1);
		shipManager.placeShipForEnemy(3, 1);
		shipManager.placeShipForEnemy(3, 1);
		shipManager.placeShipForEnemy(2, 1);
		shipManager.placeShipForEnemy(2, 1);
		shipManager.placeShipForEnemy(2, 1);
		shipManager.placeShipForEnemy(2, 1);
		this.gameState = "TURN";
		
		//preapear for the computer tipps
		for(var row = 0; row < 10; row++){
			for(var column = 0; column < 10; column++){
				this.enemyPossibleTipps.push({row: row, column: column, shot: false, collided: false});
			}
		}
	}
	
	//end the game and display the winner
	won(who){
		this.gameState="FINISH";
		document.getElementById('winner').innerHTML = who;
		document.getElementById("finish").style.display = "flex";
	}	

	//check if a winner is avaible
	checkForWinn(ships, tipps){
		return ships.reduce((accumulator, currentValue)=>accumulator +currentValue.xUnits*currentValue.yUnits, 0)/tipps.filter((tipp)=>tipp.collided).length == 1;
	}
	
	//calculate clicked Position on enemy grid to shoot
	mousClickEnemyCanvas(canvas, event){
		if(this.gameState != "TURN")return;
		var rect = canvas.getBoundingClientRect();
		var mouseX = event.clientX - rect.left;
		var mouseY = event.clientY - rect.top;
		
		var row = Math.floor((mouseX-20)/this.rowWidth);
		var column = Math.floor((mouseY-20)/this.columnHeight);
		
		var tipp = this.getTipp(row, column, this.tipps);
		if(tipp == null || !tipp.shot){
			this.tippForShip(row, column, this.tipps, shipManager.enemyShips);
			//after players turn ist over, enemys turn start
			enemyLogic.playTurn();
		}
	}
	
	//called by the PC to shoot at the players field
	shotAtPlayer(row, column){
		var tipp = this.getTipp(row, column, this.enemyPossibleTipps);
		if(tipp == null)return null;
		var collided = shipManager.shipsColliding(tipp.row*this.rowWidth+25, tipp.column*this.columnHeight+25, shipManager.ships, 1, 1);
		collided.forEach((ship)=>{ship.collisions++});
		tipp.shot = true;
		tipp.collided = collided.length > 0;
		this.enemyTipps.push(tipp);
		return tipp;
	}
	
	//returns a tipp object from the tippholder on the row and column position 
	getTipp(row, column, tippHolder){
		return tippHolder.filter((tipp)=> tipp.row == row && tipp.column == column)[0];
	}
	
	//Check if there is already a tipp
	hasAlreadyShotAt(row, column, tippHolder){
		return tippHolder.filter((tipp)=> tipp.row == row && tipp.column == column && tipp.shot).length > 0;
	}
	
	//mark a field as tipped and damage a ship on hit
	tippForShip(row, column, tippHolder, shipsToTipp){
		var collided = shipManager.shipsColliding(row*this.rowWidth+25, column*this.columnHeight+25, shipsToTipp, 1, 1);
		collided.forEach((ship)=>{ship.collisions++});
		tippHolder.push({row: row, column: column, shot:true, collided: collided.length > 0});
	}
	
	//return a random int between min and max inluding both
	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
}

var gameManager = new GameManager();