class CanvasManager{
	
	constructor(){
		//initialize the canvas elements and add the evnetListeners to it
		this.myCanvas = document.getElementById("myCanvas");
		this.myContext = this.myCanvas.getContext("2d");
		this.myCanvas.addEventListener("mousedown", (event)=>{shipManager.mousClickMyCanvas(this.myCanvas, event)});
		this.myCanvas.addEventListener("mousemove", (event)=>{shipManager.mousMoveMyCanvas(this.myCanvas, event)});
		this.myCanvas.addEventListener("mouseup", (event)=>{shipManager.mousUpMyCanvas(this.myCanvas, event)});
		window.addEventListener("keyup", (event)=>{shipManager.keyUp(event)})
		this.readyButton = document.getElementById("readyButton");
		
		this.enemyCanvas = document.getElementById("enemyCanvas");
		this.enemyContext = this.enemyCanvas.getContext("2d");
		this.enemyCanvas.addEventListener("mousedown", (event)=>{gameManager.mousClickEnemyCanvas(this.enemyCanvas, event)});
		
		//the size of a grid
		
		this.gridWidth = 400;
		this.gridHeight = 400;
		
		//draw every 20 mIlliseconds the grid with the shipps;
		this.taskID = setInterval(()=>{
			
			//check for Winner
			if(gameManager.checkForWinn(shipManager.enemyShips, gameManager.tipps)){
				gameManager.won("Player");
			}else if(gameManager.checkForWinn(shipManager.ships, gameManager.enemyTipps)){
				gameManager.won("Computer");
			}
			
			//draw the grid
			this.drawGrid(this.myContext, this.myCanvas);
			this.drawGrid(this.enemyContext, this.enemyCanvas);
			
			//draw the shipps
			this.drawShippsToPlace(this.myContext, shipManager.shipsToPlace)
			this.drawShipps(this.myContext, shipManager.ships);
			this.drawSelectedShip(this.myContext, shipManager.selectedShip);
			
			//Draw the tipps
			this.drawTipps(this.myContext, gameManager.enemyTipps);
			this.drawTipps(this.enemyContext, gameManager.tipps);
			
		}, 20);
	}
	
	drawGrid(context, canvas){
		
		//remove the old content from the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		//draw the borders
		context.strokeStyle="grey";
		context.strokeRect(20, 20, this.gridWidth, this.gridHeight);
		context.strokeStyle="black";
		//zeichnet das Gitter
		context.beginPath();
		context.lineWidth = 1;
		
		//vertical lines and grid x legend
		for(var i = 1; i <= 9; i++){
			var x = gameManager.rowWidth*i+20;
			context.moveTo(x, 20);
			context.lineTo(x, this.gridHeight+20);
			
			x-=gameManager.rowWidth/2;
			context.fillText(gameManager.gridLegendX[i-1], x, 15);
		}
		
		context.fillText(gameManager.gridLegendX[gameManager.gridLegendX.length-1], canvas.width-gameManager.rowWidth/2, 15);
		
		//horizontal lines and grid y legend
		for(var i = 1; i <= 9; i++){
			var y = gameManager.columnHeight*i+20;
			context.moveTo(20, y);
			context.lineTo(canvas.width, y);
			
			y -= gameManager.columnHeight/2;
			context.fillText(i, 5, y);
		}
		
		context.fillText("10", 5, (this.gridHeight+25)-gameManager.columnHeight/2);
		
		context.stroke();
	}
	
	//draw an array of ships on passed context
	drawShipps(context, ships){
		ships.forEach((ship)=>{
			context.fillRect(ship.drawX, ship.drawY, ship.xUnits*gameManager.rowWidth - 10, ship.yUnits*gameManager.columnHeight-10);
		});
	}
	
	//draw an array of ships on passed context wich amount of avaible ships
	drawShippsToPlace(context, ships){
		ships.forEach((ship)=>{
			if(ship.amount > 0){
				context.fillRect(ship.drawX, ship.drawY, ship.xUnits*gameManager.rowWidth - 10, ship.yUnits*gameManager.columnHeight-10);
				context.fillText(ship.amount, ship.drawX-16, ship.drawY+20);
			}
		});
	}
	
	
	//draw an ship on passed context with a green border to display its selected
	drawSelectedShip(context, ship){
		if(ship != null){
			context.fillStyle = "lime";
			context.fillRect(ship.drawX-2, ship.drawY-2, ship.xUnits*gameManager.rowWidth-6, ship.yUnits*gameManager.columnHeight-6);
			context.fillStyle = "black";
			context.fillRect(ship.drawX, ship.drawY, ship.xUnits*gameManager.rowWidth - 10, ship.yUnits*gameManager.columnHeight-10);
		}
	}
	
	//draw an array of tipps on passed context
	drawTipps(context, tipps){
		tipps.forEach((tipp)=>{
			if(tipp.shot){
				context.fillStyle = tipp.collided?"lime":"red";
				context.fillRect(tipp.row*40+25, tipp.column*gameManager.columnHeight+25, gameManager.rowWidth-10, gameManager.columnHeight-10);
				context.fillStyle = "black";
			}
		});
	}
	
}

//initzialise this the CanvasManager on load
var canvasManager = new CanvasManager();