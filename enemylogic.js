class EnemyLogic{
	
	constructor(){
		this.target = null;
		this.research = "DOWN";
	}
	
	
	//makes a turn
	playTurn(){
		if(this.target == null){
			this.shotRandom();
		}else{
			switch(this.research){
				case "DOWN":
					for(var y = this.target.column+1; y <= 10; y++){
						var tipp = gameManager.getTipp(this.target.row, y, gameManager.enemyPossibleTipps);
						//if tipp out of the gird, or dosnt hit, change searchdircetion to up
						if( tipp == null || tipp.shot && !tipp.collided){
							this.research = "UP";
							this.playTurn();
							break;
						}else if(!tipp.shot){
							//shoot on the field. if it not hit change search direction to up
							tipp = gameManager.shotAtPlayer(tipp.row, tipp.column);
							if(tipp != null && !tipp.collided){
								this.research = "UP";
							}
							return;
						}
					}
					break;
				
				case "UP":
					for(var y = this.target.column-1; y >= -1; y--){
						var tipp = gameManager.getTipp(this.target.row, y, gameManager.enemyPossibleTipps);
						//if tipp out of the gird, or dosnt hit, change searchdircetion to right
						if( tipp == null || tipp.shot && !tipp.collided){
							this.research = "RIGHT";
							this.playTurn();
							break;
						}else if(!tipp.shot){
							//shoot on the field. if it not hit change search direction to right
							tipp = gameManager.shotAtPlayer(tipp.row, tipp.column);
							if(tipp != null && !tipp.collided){
								this.research = "RIGHT";
							}
							break;
						}
					}
					break;
					
				case "RIGHT":
					for(var x = this.target.row+1; x <= 10; x++){
						var tipp = gameManager.getTipp(x, this.target.column, gameManager.enemyPossibleTipps);
						//if tipp out of the gird, or dosnt hit, change searchdircetion to left
						if( tipp == null || tipp.shot && !tipp.collided){
							this.research = "LEFT";
							this.playTurn();
							break;
						}else if(!tipp.shot){
							//shoot on the field. if it not hit change search direction to left
							tipp = gameManager.shotAtPlayer(tipp.row, tipp.column);
							if(tipp != null && !tipp.collided){
								this.research = "LEFT";
							}
							break;
						}
					}
					break;
					
				case "LEFT":
				
					for(var x = this.target.row-1; x >= -1; x--){
						var tipp = gameManager.getTipp(x, this.target.column, gameManager.enemyPossibleTipps);
						//if tipp out of the gird, or dosnt hit, change searchdircetion to left and the target shipp is destroyed
						if( tipp == null || tipp.shot && !tipp.collided){
							this.research = "DOWN";
							this.target = null;
							this.playTurn();
							break;
						}else if(!tipp.shot){
							//shoot on the field. if it not hit change search direction to up and the target shipp is destroyed
							tipp = gameManager.shotAtPlayer(tipp.row, tipp.column);
							if(tipp != null && !tipp.collided){
								this.research = "DOWN";
								this.target = null;
							}
							break;
						}
					}
					break;
					
				default:
					console.log("Something went wrong. Set searchdirection to DOWN.");
					this.research = "DOWN";
					break;
			}
		}
	}
	
	//Shoot at a random Position
	shotRandom(){
		var avaiblePosition = gameManager.enemyPossibleTipps.filter((tipp)=>!tipp.shot);
		var tipp = avaiblePosition[gameManager.getRandomInt(0, avaiblePosition.length-1)];
		var tipp = gameManager.shotAtPlayer(tipp.row, tipp.column);
		if(tipp != null && tipp.collided){
			this.target = tipp;
			this.research = "DOWN";
		}
	}
}

var enemyLogic = new EnemyLogic();