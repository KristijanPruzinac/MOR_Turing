class Connection {
  constructor(startNode, endNode, startX, startY, endX, endY, letterRead, letterWrite, move, startAngle, endAngle) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.letterRead = letterRead;
    this.letterWrite = letterWrite;
    this.move = move;
    
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  display() {
    // Display connection line
    //line(this.connectionStartX, this.connectionStartY, this.connectionEndX, this.connectionEndY);
    
    let connectionCenterX = this.startX + (this.endX - this.startX) / 2;
    let connectionCenterY = this.startY + (this.endY - this.startY) / 2;
    
    let connectionWidth = sqrt(pow(this.endX - this.startX, 2) + pow(this.endY - this.startY, 2));
    let connectionHeight = 1 + abs(50 * sin(radians(this.startAngle)));
    
    let textOffsetHeight = 10 + abs(22 * sin(radians(this.startAngle)));
    
    //Add height for faraway nodes
    let ndist = abs(this.endX - this.startX);
    if (ndist > NODE_DISTANCE){
      connectionHeight *= 2;
      textOffsetHeight *= 1.87;
    }
    if (ndist > NODE_DISTANCE * 2){
      connectionHeight *= 2;
      textOffsetHeight *= 1.87;
    }
    if (ndist > NODE_DISTANCE * 3){
      connectionHeight *= 1.5;
      textOffsetHeight *= 1.435;
    }
    
    push();
    translate(connectionCenterX, connectionCenterY);
    //Hotfixes for same node
    let angle = atan2(this.endY - this.startY, this.endX - this.startX);
    angle = ((-(degrees(angle) - 180.0)) + 180.0) % 360.0;
    if (this.startNode === this.endNode){
      rotate(radians(360 - angle));
      connectionHeight = 50;
    }
    
    noFill();
    strokeWeight(2);
    stroke(100, 100, 100);
    textAlign(CENTER, CENTER);
    if (this.startNode === this.endNode){
      if (abs(this.startAngle - this.endAngle) >= 90){
        if (this.startAngle > this.endAngle){
          arc(0, 0, connectionWidth, connectionHeight, 0, PI);
          
          //Text
          fill(0);
          textSize(12);
          strokeWeight(1);
          //More hotfixes for same node
          if (this.startNode === this.endNode){
            translate(0, 45);
            rotate(-radians(360 - angle));
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
          }
          else {
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 + textOffsetHeight);
          }
        }
        else {
          arc(0, 0, connectionWidth, connectionHeight, PI, TWO_PI);
          
          //Text
          fill(0);
          textSize(12);
          strokeWeight(1);
          //More hotfixes for same node
          if (this.startNode === this.endNode){
            translate(0, -45);
            rotate(-radians(360 - angle));
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
          }
          else {
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 - textOffsetHeight);
          }
        }
      }
      else {
        if (this.startAngle < this.endAngle){
          arc(0, 0, connectionWidth, connectionHeight, 0, PI);
          
          //Text
          fill(0);
          textSize(12);
          strokeWeight(1);
          //More hotfixes for same node
          if (this.startNode === this.endNode){
            translate(0, 45);
            rotate(-radians(360 - angle));
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
          }
          else {
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 + textOffsetHeight);
          }
        }
        else {
          arc(0, 0, connectionWidth, connectionHeight, PI, TWO_PI);
          
          //Text
          fill(0);
          textSize(12);
          strokeWeight(1);
          //More hotfixes for same node
          if (this.startNode === this.endNode){
            translate(0, -45);
            rotate(-radians(360 - angle));
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
          }
          else {
            text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 - textOffsetHeight);
          }
        }
      }
    }
    else {
      if ((this.startAngle <= 180.0 && this.endAngle <= 180.0)){
        arc(0, 0, connectionWidth, connectionHeight, PI, TWO_PI);
        
        //Text
        fill(0);
        textSize(12);
        strokeWeight(1);
        //More hotfixes for same node
        if (this.startNode === this.endNode){
          translate(0, 45);
          rotate(-radians(360 - angle));
          text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
        }
        else {
          text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 - textOffsetHeight);
        }
      }
      else {
        arc(0, 0, connectionWidth, connectionHeight, 0, PI);
        
        //Text
        fill(0);
        textSize(12);
        strokeWeight(1);
        //More hotfixes for same node
        if (this.startNode === this.endNode){
          translate(0, 45);
          rotate(-radians(360 - angle));
          text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0);
        }
        else {
          text(this.letterRead + " : " + this.letterWrite + " , " + this.move, 0, 0 + textOffsetHeight);
        }
      }
    }
    pop();
    
    //Arrow
    push();
    noFill();
    strokeWeight(2);
    stroke(80, 80, 80);
    translate(this.endX, this.endY);
    rotate(-radians(this.endAngle + 180));
    line(0, 0, -5, -5);
    line(0, 0, -5, 5);
    pop();
    // You might add other visual elements specific to the connection if needed
  }
}
