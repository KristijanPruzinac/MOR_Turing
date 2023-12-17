function minRotationDistance(theta1, theta2) {
    let absDiff = Math.abs(theta2 - theta1);
    let minRotation = Math.min(absDiff, 360 - absDiff);
    return minRotation;
}

class State {
  constructor(x, y, name, target) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.radius = 50;
    this.target = target; //True, false
    
    this.connections = [];
  }

  addConnectionTo(node, startX, startY, endX, endY, letterRead, letterWrite, move, startAngle, endAngle) {
    if (this.connections.length < 20) {
      //Same node is start and end
      if (this == node){
        if (minRotationDistance(startAngle, endAngle) >= 90){return false;}
      }
      const newConnection = new Connection(this, node, startX, startY, endX, endY, letterRead, letterWrite, move, startAngle, endAngle);
      this.connections.push(newConnection);
      return true;
    }
    else {return false;}
  }
  
  removeConnectionTo(node) {
    connections = connections.filter(connection => !(connection.startNode === this && connection.endNode === node) && !(connection.startNode === node && connection.endNode === this));
  }
  
  checkHover() {
    let distToMouse = dist(nMouseX, nMouseY, this.x, this.y);
    let angle = atan2(nMouseY - this.y, nMouseX - this.x);
    angle = ((-(degrees(angle) - 180.0)) + 180.0) % 360.0;
    if (distToMouse >= this.radius - 10 && distToMouse <= this.radius + 10) {
      let closestSnapAngle = round(angle / 18) * 18; // Find closest snap angle with 18 degrees
      if (closestSnapAngle === 0){closestSnapAngle = 360;}
      
      let found = false;
      for (let connection of this.connections){
        if (abs(connection.startAngle - closestSnapAngle) <= 5){
          found = true;
          break;
        }
      }
      
      strokeWeight(2);
      stroke(170, 170, 170);
      if (found === true){
        fill(255, 160, 160);
      }
      else {
        fill(160, 255, 160);
      }
      
      ellipse(this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius, 15, 15);
      
      if (found){
        return { valid: false, angle: closestSnapAngle, x: this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, y: this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius };
      }
      else {
        return { valid: true, angle: closestSnapAngle, x: this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, y: this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius };
      }
    }
    
    // Return a default value if the condition isn't met
    return { valid: false, angle: 0, x: 0, y: 0 };
  }
  
  checkNextHover(prevAngle) {
    let distToMouse = dist(nMouseX, nMouseY, this.x, this.y);
    let angle = atan2(nMouseY - this.y, nMouseX - this.x);
    angle = ((-(degrees(angle) - 180.0)) + 180.0) % 360.0;
    if (distToMouse >= this.radius - 10 && distToMouse <= this.radius + 10) {
      let closestSnapAngle = round(angle / 18) * 18; // Find closest snap angle with 18 degrees
      
      if (closestSnapAngle != (360 + 180 - prevAngle) % 360){return { valid: false, angle: 0, x: 0, y: 0 };} //Dont allow non parallel
      
      let found = false;
      for (let connection of this.connections){
        if (abs(connection.startAngle - closestSnapAngle) <= 5){
          found = true;
          break;
        }
      }
      
      strokeWeight(2);
      stroke(170, 170, 170);
      if (found === true){
        fill(255, 160, 160);
      }
      else {
        fill(160, 255, 160);
      }
      
      ellipse(this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius, 15, 15);
      
      if (found){
        return { valid: false, angle: closestSnapAngle, x: this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, y: this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius };
      }
      else {
        return { valid: true, angle: closestSnapAngle, x: this.x + cos(2*PI - radians(closestSnapAngle)) * this.radius, y: this.y + sin(2*PI - radians(closestSnapAngle)) * this.radius };
      }
    }
    
    // Return a default value if the condition isn't met
    return { valid: false, angle: 0, x: 0, y: 0 };
  }

  display() {
    // Display the node
    fill(225, 225, 255);
    strokeWeight(2);
    stroke(150, 150, 150);
    ellipse(this.x, this.y,this.radius*2, this.radius*2);
    //If target, display double circle
    if (this.target === true){
      ellipse(this.x, this.y,this.radius*2 - 13, this.radius*2 - 13);
    }
    
    //Text
    fill(0);
    textSize(18);
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    text("Q", this.x, this.y);
    
    textSize(13);
    textAlign(LEFT, CENTER);
    text(this.name, this.x + 8, this.y + 5);

    // Display connections from this node
    for (let connection of this.connections) {
      connection.display();
    }
  }
}
