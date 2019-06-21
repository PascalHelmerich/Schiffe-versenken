class Ship{
	constructor(amount, x, y, coordinate, xUnits, yUnits){
		this.amount = amount;
		this.x = x;
		this.y = y;
		this.drawX = this.x;
		this.drawY = this.y;
		this.coordinate = coordinate;
		this.xUnits = xUnits;
		this.yUnits = yUnits;
		this.collisions = 0;
		this.selected = false;
	}
}