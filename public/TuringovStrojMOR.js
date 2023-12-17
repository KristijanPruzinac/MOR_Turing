let nodes = []; // Collection of nodes

//Connections
let newConnectionStartX = -1;
let newConnectionStartY = -1;
let newConnectionEndX = -1;
let newConnectionEndY = -1;

let newConnectionStartAngle;
let newConnectionEndAngle;

let newConnectionStartNode;
let newConnectionEndNode;

//Node gui
let GuiNodeActive = false;
let GuiNodeWidth = 150;
let GuiNodeHeight = 130;
let GuiNodeTextSelected = false;
let GuiNodeIndex = 0;
let GuiNodeText = "a";
let GuiNodeTarget = false;

//Creating connection
let newConnectionActive = false;
let newConnectionRef;
let newConnectionSegment;

//Variables

const NODE_DISTANCE = 175;

let nMouseX = 0;
let nMouseY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create nodes and add them to the collection
  nodes.push(new State(0, 0, "0"));
}

function keyPressed(){
  //Block special key input while waiting for connection input
  if (newConnectionActive === true){return;}
  
  if (keyCode == ESCAPE){
     newConnectionStartX = -1;
     newConnectionStartY = -1;
     newConnectionEndX = -1;
     newConnectionEndY = -1;
  }
  
  //GUI node
  if (GuiNodeActive === true){
    if (GuiNodeTextSelected === true){
      if (keyCode == BACKSPACE){
        GuiNodeText = GuiNodeText.slice(0, -1);
      }
    }
  }
}

function keyTyped(){
  if (newConnectionActive === true){
    //Rewrite e to ɛ
    if (key == 'e'){key = 'ɛ';}
    
    if (newConnectionSegment === 0){
      newConnectionRef.letterRead = key;
      
      newConnectionSegment++;
    }
    else if (newConnectionSegment === 1){
      newConnectionRef.letterWrite = key;
      
      newConnectionSegment++;
    }
    else if (newConnectionSegment === 2){
      if (key.toUpperCase() == "L" || key.toUpperCase() == "S" || key.toUpperCase() == "D"){
        newConnectionRef.move = key.toUpperCase();
        
        newConnectionActive = false;
      }
    }
  }
  else {
    //GUI node
    if (GuiNodeActive === true){
      if (GuiNodeTextSelected === true){
        if (GuiNodeText.length < 3){
          GuiNodeText += key;
        }
      }
    }
  }
}

function mousePressed(){
  //Block mouse input while waiting for connection input
  if (newConnectionActive === true){return;}
  
  if (newConnectionStartX != -1){return;}
  for (let node of nodes) {
    let hoverTest = node.checkHover();
    if (hoverTest.valid === true){
      newConnectionStartX = hoverTest.x;
      newConnectionStartY = hoverTest.y;
      newConnectionStartNode = node;
      newConnectionStartAngle = hoverTest.angle;
      
      return;
    }
    else {
      //Remove connection
      for (let i = 0; i < node.connections.length; i++) {
        if (node.connections[i].startAngle === hoverTest.angle) {
          node.connections.splice(i, 1);
          break;
        }
      }
    }
  }
  
  // --- CLICK EVENTS ---
  
  //Select node check
  for (let i = 0; i < nodes.length; i++) {
    if (sqrt(pow(nMouseX - nodes[i].x, 2) + pow(nMouseY - nodes[i].y, 2)) <= 30){
      GuiNodeActive = true;
      GuiNodeIndex = i;
      GuiNodeText = nodes[i].name;
      GuiNodeTarget = nodes[i].target;
      
      GuiNodeTextSelected = false;
      
      break;
    }
  }
  
  //GUI Node
  if (GuiNodeActive === true){
    //Select GUI node text
    if (mouseX >= width - GuiNodeWidth - 10 + 90 &&
        mouseX <= width - GuiNodeWidth - 10 + 90 + GuiNodeWidth - 100 &&
        mouseY >= 20 &&
        mouseY <= 20 + 30){
      if (GuiNodeTextSelected === true){GuiNodeTextSelected = false;} else {GuiNodeTextSelected = true;}
    }
    else {
      GuiNodeTextSelected = false;
    }
    
    //Select GUI node target
    if (abs(mouseX - (width - GuiNodeWidth - 10 + 100)) <= 7 && abs(mouseY - 75) <= 7){
      if (GuiNodeTarget === true){GuiNodeTarget = false;} else {GuiNodeTarget = true;}
      if (nodes[GuiNodeIndex].target === true){nodes[GuiNodeIndex].target = false;} else {nodes[GuiNodeIndex].target = true;}
    }
    
    //Select GUI node BRIŠI
    //width - GuiNodeWidth - 10 + 45, 118, 55, 25
    if (mouseX >= width - GuiNodeWidth - 10 + 45 - 55 / 2 &&
        mouseX <= width - GuiNodeWidth - 10 + 45 + 55 / 2 &&
        mouseY >= 118 - 12 &&
        mouseY <= 118 + 12){
          
          //Check if there is more than one node
          if (nodes.length > 1){
            //Delete all connections associated with node
            for (let node of nodes){
              node.connections = node.connections.filter(connection => {
                return !(connection.startNode === nodes[GuiNodeIndex] || connection.endNode === nodes[GuiNodeIndex]);
              });
            }
            
            //Adjust x positions of connections
            for (let node of nodes){
              for (let connection of node.connections){
                if (connection.startX > nodes[GuiNodeIndex].x){connection.startX -= NODE_DISTANCE;}
                if (connection.endX > nodes[GuiNodeIndex].x){connection.endX -= NODE_DISTANCE;}
              }
            }
            
            //Adjust x positions of nodes
            for (let node of nodes){
              if (node.x > nodes[GuiNodeIndex].x){node.x -= NODE_DISTANCE;}
            }
            
            //Remove the node
            nodes.splice(GuiNodeIndex, 1);
          }
          
          //Disable UI
          GuiNodeActive = false;
    }
    
    //Select GUI node OK
    if (mouseX >= width - GuiNodeWidth - 10 + 110 - 20 &&
        mouseX <= width - GuiNodeWidth - 10 + 110 + 20 &&
        mouseY >= 118 - 12 &&
        mouseY <= 118 + 12){
          //Save node name
          nodes[GuiNodeIndex].name = GuiNodeText;
          
          //Disable UI
          GuiNodeActive = false;
    }
  }
  else {
    //GUI add node
    if (sqrt(pow(mouseX - (width - 40), 2) + pow(mouseY - 40, 2)) <= 40){
      if (nodes.length < 9){
        nodes.push(new State(nodes[nodes.length - 1].x + NODE_DISTANCE, 0, (nodes.length).toString()));
      }
    }
  }
}

function mouseReleased(){
  //Block mouse input while waiting for connection input
  if (newConnectionActive === true){return;}
  
  if (newConnectionStartX != -1){
    for (let node of nodes) {
      let hoverTest = 0;
      if (node == newConnectionStartNode){
        hoverTest = node.checkHover();
      }
      else {
        hoverTest = node.checkNextHover(newConnectionStartAngle);
      }
      if (hoverTest.valid === true){
        newConnectionEndX = hoverTest.x;
        newConnectionEndY = hoverTest.y;
        newConnectionEndNode = node;
        newConnectionEndAngle = hoverTest.angle;
        
        //Create connection
        if (newConnectionStartX != -1 &&
            newConnectionStartY != -1 &&
            newConnectionEndX != -1 &&
            newConnectionEndY != -1 &&
            newConnectionStartNode &&
            newConnectionEndNode)
            { //When on same node, start angle must not be 0 / 360 or 180
              if (newConnectionStartNode === newConnectionEndNode && newConnectionStartAngle % 180 == 0){break;}
              //Cant be same node and same angle start and end
              if (newConnectionStartNode === newConnectionEndNode && newConnectionStartAngle === newConnectionEndAngle){break;}
                if (newConnectionStartNode.addConnectionTo(newConnectionEndNode, newConnectionStartX, newConnectionStartY, newConnectionEndX, newConnectionEndY, "_", "_", "_", newConnectionStartAngle, newConnectionEndAngle))
                {
                  newConnectionActive = true;
                  newConnectionRef = newConnectionStartNode.connections[newConnectionStartNode.connections.length - 1];
                  newConnectionSegment = 0;
                }
            }
        
        break;
      }
    }
  }
  
  newConnectionStartX = -1;
  newConnectionStartY = -1;
  newConnectionEndX = -1;
  newConnectionEndY = -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

newConnectionStartX = -1;
newConnectionStartY = -1;
newConnectionEndX = -1;
newConnectionEndY = -1;

function DrawGUI(){
  //Gui node
  if (GuiNodeActive === true){
    noStroke();
    fill(235);
    rectMode(CORNER);
    rect(width - GuiNodeWidth - 10, 10, GuiNodeWidth, GuiNodeHeight, 20);
    
    //Prvi red
    fill(0);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Oznaka", width - GuiNodeWidth - 10 + 20, 35);
    
    fill(250);
    rectMode(CORNER);
    if (GuiNodeTextSelected === true){
      strokeWeight(2);
      stroke(100);
    }
    rect(width - GuiNodeWidth - 10 + 90, 20, GuiNodeWidth - 100, 30, 10);
    noStroke();
    
    fill(0);
    textSize(15);
    textAlign(LEFT, CENTER);
    text(GuiNodeText, width - GuiNodeWidth - 10 + 100, 35);
    
    //Drugi red
    fill(0);
    textSize(15);
    textAlign(LEFT, CENTER);
    text("Konačno", width - GuiNodeWidth - 10 + 20, 75);
    
    if (GuiNodeTarget === true){
      fill(100);
    }
    else {
      noFill();
    }
    stroke(100);
    strokeWeight(2);
    rectMode(CENTER);
    rect(width - GuiNodeWidth - 10 + 100, 75, 15, 15, 4);
    
    //Treci red
    fill(250);
    stroke(150);
    strokeWeight(1);
    rect(width - GuiNodeWidth - 10 + 45, 118, 55, 25, 4);
    
    fill(0);
    textSize(15);
    textAlign(CENTER, CENTER);
    noStroke();
    text("BRIŠI", width - GuiNodeWidth - 10 + 45, 120);
    
    fill(250);
    stroke(150);
    strokeWeight(1);
    rect(width - GuiNodeWidth - 10 + 110, 118, 40, 25, 4);
    
    fill(0);
    textSize(15);
    textAlign(CENTER, CENTER);
    noStroke();
    text("OK", width - GuiNodeWidth - 10 + 110, 120);
  }
  else {
    noStroke();
    fill(200);
    rectMode(CENTER);
    rect(width - 40, 40, 40, 40, 40);
    fill(250);
    rect(width - 40, 40, 3, 22, 3);
    rect(width - 40, 40, 22, 3, 3);
  }
}

function draw() {
  background(255);
  
  push();
  
  //New connection switching animation
  if (newConnectionActive === true){
    if (frameCount % 60 <= 30){
      if (newConnectionSegment === 0){
        newConnectionRef.letterRead = "_";
      }
      else if (newConnectionSegment === 1){
        newConnectionRef.letterWrite = "_";
      }
      else if (newConnectionSegment === 2){
        newConnectionRef.move = "_";
      }
    }
    else{
      if (newConnectionSegment === 0){
        newConnectionRef.letterRead = "  ";
      }
      else if (newConnectionSegment === 1){
        newConnectionRef.letterWrite = "  ";
      }
      else if (newConnectionSegment === 2){
        newConnectionRef.move = "  ";
      }
    }
  }
  
  fill(0);
  noStroke();
  strokeWeight(1);
  textSize(30);
  textAlign(CENTER, BOTTOM);
  if (height >= 500){
    text("Simulator Turingovog stroja", width / 2, 50);
  }
  
  //Translate to center nodes on screen
  translate(-(nodes[nodes.length - 1].x - nodes[0].x) / 2 + width / 2, height / 2);
  nMouseX = mouseX + (nodes[nodes.length - 1].x - nodes[0].x) / 2 - width/2;
  nMouseY = mouseY - height / 2;

  // Display nodes
  for (let node of nodes) {
    node.display();
  }
  
  //Display start node enter connection
  noFill();
  strokeWeight(2);
  stroke(100, 100, 100);
  line(nodes[0].x - nodes[0].radius - 60, nodes[0].y, nodes[0].x - nodes[0].radius, nodes[0].y);
  
  line(nodes[0].x - nodes[0].radius, nodes[0].y, nodes[0].x - nodes[0].radius - 5, nodes[0].y - 5);
  line(nodes[0].x - nodes[0].radius, nodes[0].y, nodes[0].x - nodes[0].radius - 5, nodes[0].y + 5);

  // Check mouse proximity to node borders IF not creating new connection
  if (newConnectionActive !== true){
    for (let node of nodes) {
      if (newConnectionStartX != -1){
        if (node == newConnectionStartNode){
          node.checkHover();
        }
        else {
          node.checkNextHover(newConnectionStartAngle);
        }
      }
      else {
        node.checkHover();
      }
    }
  }
  
  //Display new connection being drawn
  if (newConnectionStartX != -1 && newConnectionStartY != -1){
    strokeWeight(2);
    stroke(220, 220, 255);
    line(newConnectionStartX, newConnectionStartY, nMouseX, nMouseY);
  }
  
  pop();
  
  DrawGUI();
}
