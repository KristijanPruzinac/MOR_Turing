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

//Writing Turing track
let changeTuringLetterActive = false;
let changeTuringLetterIndex;

//TTS
let TuringTrack = ['ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ', 'ɛ'];
let TuringHead = 6;
let TuringHeadSelected = false;

//Simulation
let SimulationRunning = false;
let TuringTrackBackup;
let TuringHeadBackup;
let SimulationSelectedState;
let SimulationSelectedConnection;
let SimulationShowCounter;
let SimulationStatus;

//Variables
const TURING_DISTANCE = 30;
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
  if (newConnectionActive === true){return;} if (SimulationRunning === true) {return;}
  
  if (changeTuringLetterActive === true){
    if (keyCode == BACKSPACE){
      if (TuringTrack.length > 1){
        TuringTrack.splice(changeTuringLetterIndex, 1);
        
        if (TuringHead >= changeTuringLetterIndex){
          TuringHead--; if (TuringHead < 0){TuringHead = 0;}
        }
      }
      else {
        TuringTrack[0] = 'ɛ';
      }
      
      changeTuringLetterActive = false;
    }
  }
  else {
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
}

function keyTyped(){
   if (SimulationRunning === true) {return;}
  if (newConnectionActive === true || changeTuringLetterActive === true){
    if (key == 'e'){key = 'ɛ';} //Rewrite e to ɛ
    
    if (key == 'h'){key = '💖';} //Rewrite h to heart
    if (key == '*'){key = '⭐';} //Rewrite * to star
    if (key == 'm'){key = '🐜';}
    
    if (key == '$'){key = '💲';}
    if (key == 'č'){key = '🌐';} if (key == 'Č'){key = '🌍';}
    if (key == 'ć'){key = '🖱️';} if (key == 'Ć'){key = '⌨️';}
    if (key == 'š'){key = '🌪️';} if (key == 'Š'){key = '🌋';}
    if (key == 'đ'){key = '🐉';} if (key == 'Đ'){key = '🌟';}
    if (key == 'ž'){key = '🦄';} if (key == 'Ž'){key = '🚀';}
    
    if (key == 'ž'){key = '🦄';} if (key == 'Ž'){key = '🚀';}
    
    if (keyCode == ENTER){key = '😊';}
    
    if (newConnectionActive === true){
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
          
          //Remove connection if letter read already exists
          let letterReadCount = 0;
          for (let connection of newConnectionRef.startNode.connections){
            if (connection.letterRead === newConnectionRef.letterRead){
              letterReadCount++;
            }
          }
          if (letterReadCount > 1){
            newConnectionRef.startNode.connections = newConnectionRef.startNode.connections.filter(connection => connection !== newConnectionRef);
          }
          
          newConnectionActive = false;
        }
      }
    }
    else if (changeTuringLetterActive === true){
      TuringTrack[changeTuringLetterIndex] = key;
      changeTuringLetterActive = false;
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

function mouseClicked() {
  //Block mouse input while waiting for connection input or changing turing letter
  if (newConnectionActive === true){return;} if (changeTuringLetterActive === true){return;}
  
  //GUI Simulation start/stop button
  if (sqrt(pow(mouseX - (width - 42), 2) + pow(mouseY - (height - 50), 2)) <= 25){
    //Start simulation
    if (SimulationRunning === false){
      TuringTrackBackup = TuringTrack.slice();
      TuringHeadBackup = TuringHead;
      
      SimulationSelectedState = nodes[0];
      SimulationShowCounter = 0;
      
      SimulationStatus = 0;
      
      SimulationRunning = true;
    }
    //Stop simulation
    else {
      TuringTrack = TuringTrackBackup.slice();
      TuringHead = TuringHeadBackup;
      
      SimulationRunning = false;
    }
  }
  
  //GUI Simulation next button
  if (SimulationRunning === true && (sqrt(pow(mouseX - (width - 42), 2) + pow(mouseY - (height - 110), 2)) <= 25 || sqrt(pow(mouseX - (width - 42), 2) + pow(mouseY - (height - 170), 2)) <= 25)){
    let stepRepeat = 1;
    if (sqrt(pow(mouseX - (width - 42), 2) + pow(mouseY - (height - 170), 2)) <= 25){stepRepeat = 1000;}
    
    for (let c = 0; c < stepRepeat; c++){
      //State to connection
      if (SimulationShowCounter === 0){
        let currentLetter = TuringTrack[TuringHead];
        
        SimulationSelectedConnection = null;
        for (let connection of SimulationSelectedState.connections){
          if (connection.letterRead === currentLetter){
            SimulationSelectedConnection = connection;
            break;
          }
        }
        
        //Found target node, program finishes
        if (SimulationSelectedState.target === true){
          SimulationStatus = 1;
        }
        else if (SimulationSelectedConnection === null){ //No connections moving forward
          //Simulation stopped but node is not target, throw error
          SimulationStatus = -1;
        }
        //Found next connection, move
        else {
          let headOffset = 0;
          if (SimulationSelectedConnection.move === 'L'){
            headOffset--;
          }
          else if (SimulationSelectedConnection.move === 'D') {
            headOffset++;
          }
          
          if (TuringHead + headOffset < 0 || TuringHead + headOffset > TuringTrack.length - 1){
            SimulationStatus = -1;
          }
          else {
            TuringTrack[TuringHead] = SimulationSelectedConnection.letterWrite;
            TuringHead += headOffset;
          
            SimulationShowCounter = 1;
          }
        }
      }
      //Connection to State
      else {
        SimulationSelectedState = SimulationSelectedConnection.endNode;
        
        SimulationShowCounter = 0;
      }
    }
  }
  
  if (SimulationRunning !== true){
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
    
    //GUI Turing track add letter - Limit to 25 letters
    let TuringTrackWidth = TuringTrack.length * TURING_DISTANCE;
    
    //Right
    if (sqrt(pow(mouseX - (width / 2 + TuringTrackWidth / 2 + 25), 2) + pow(mouseY - (height - 25), 2)) <= 10 && TuringTrack.length < 25){
      TuringTrack.push('ɛ');
    }
    //Left
    if (sqrt(pow(mouseX - (width / 2 - TuringTrackWidth / 2 - 25), 2) + pow(mouseY - (height - 25), 2)) <= 10 && TuringTrack.length < 25){
      TuringTrack.unshift('ɛ');
      TuringHead++;
    }
    
    //GUI Turing track change letter
    if (mouseX >= width / 2 - TuringTrackWidth / 2 &&
        mouseX <= width / 2 + TuringTrackWidth / 2 &&
        mouseY >= height - 25 - 15 &&
        mouseY <= height - 25 + 15 ){
      let LetterIndex = int((mouseX - (width / 2 - TuringTrackWidth / 2)) / TURING_DISTANCE);
      
      changeTuringLetterActive = true;
      changeTuringLetterIndex = LetterIndex;
    }
  }
}

function mousePressed(){
  //Block mouse input while waiting for connection input or changing turing letter
  if (newConnectionActive === true){return;} if (changeTuringLetterActive === true){return;}
    
  if (SimulationRunning !== true) {
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
    
    //GUI Turing click head
    let TuringTrackWidth = TuringTrack.length * TURING_DISTANCE;
    
    if (sqrt(pow(mouseX - (width / 2 - TuringTrackWidth / 2 + (TuringHead + 0.5) * TURING_DISTANCE), 2) + pow(mouseY - (height - 25 - 30), 2)) <= 10){
      TuringHeadSelected = true;
    }
  }
}

function mouseReleased(){
  //Block mouse input while waiting for connection input
  if (newConnectionActive === true){return;} if (changeTuringLetterActive === true){return;} if (SimulationRunning === true) {return;}
  
  //Deselect turing head
  TuringHeadSelected = false;
  
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
  //Add node button
  else {
    noStroke();
    fill(200);
    rectMode(CENTER);
    rect(width - 40, 40, 40, 40, 40);
    fill(250);
    rect(width - 40, 40, 3, 22, 3);
    rect(width - 40, 40, 22, 3, 3);
  }
  
  //Turing track
  let TuringTrackWidth = TuringTrack.length * TURING_DISTANCE;
  
  //Outline
  noFill();
  stroke(120);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height - 25, TuringTrackWidth, 30);
  for (let i = 0; i < TuringTrack.length - 1; i++){
    line(width / 2 - TuringTrackWidth / 2 + (i + 1) * TURING_DISTANCE, height - 25 - 15, width / 2 - TuringTrackWidth / 2 + (i + 1) * TURING_DISTANCE, height - 25 + 15);
  }
  
  //Buttons
  rect(width / 2 + TuringTrackWidth / 2 + 25, height - 25, 20, 20, 20);
  rect(width / 2 - TuringTrackWidth / 2 - 25, height - 25, 20, 20, 20);
  
  fill(120);
  rect(width / 2 + TuringTrackWidth / 2 + 25, height - 25, 12, 2, 2);
  rect(width / 2 + TuringTrackWidth / 2 + 25, height - 25, 2, 12, 2);
  
  rect(width / 2 - TuringTrackWidth / 2 - 25, height - 25, 12, 2, 2);
  rect(width / 2 - TuringTrackWidth / 2 - 25, height - 25, 2, 12, 2);
  
  //Head
  if (TuringHeadSelected === true){
      TuringHead = int((mouseX - (width / 2 - TuringTrackWidth / 2)) / TURING_DISTANCE);
      
      if (TuringHead < 0){TuringHead = 0;}
      if (TuringHead > TuringTrack.length - 1){TuringHead = TuringTrack.length - 1;}
  }
  noStroke();
  fill(100);
  ellipseMode(CENTER);
  ellipse(width / 2 - TuringTrackWidth / 2 + (TuringHead + 0.5) * TURING_DISTANCE, height - 25 - 30, 12, 12);
  
  //Letters
  noStroke();
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < TuringTrack.length; i++){
    text(TuringTrack[i], width / 2 - TuringTrackWidth / 2 + (i + 0.5) * TURING_DISTANCE, height - 25);
  }
  
  //Simulation play
  if (SimulationRunning === false){
    noStroke();
    fill(100, 220, 100);
    ellipse(width - 42, height - 50, 50, 50);
    fill(245);
    triangle(width - 42 - 6, height - 50 - 10, width - 42 + 10, height - 50, width - 42 - 6, height - 50 + 10);
  }
  else {
    noStroke();
    fill(220, 100, 100);
    ellipse(width - 42, height - 50, 50, 50);
    fill(245);
    rectMode(CENTER);
    rect(width - 42, height - 50, 18, 18, 2);
    
    noStroke();
    fill(180);
    ellipse(width - 42, height - 110, 50, 50);
    fill(245);
    triangle(width - 42 - 6 - 5, height - 110 - 10, width - 42 + 10 - 5, height - 110, width - 42 - 6 - 5, height - 110 + 10);
    triangle(width - 42 - 6 + 5, height - 110 - 10, width - 42 + 10 + 5, height - 110, width - 42 - 6 + 5, height - 110 + 10);
    
    noStroke();
    fill(180);
    ellipse(width - 42, height - 170, 50, 50);
    fill(245);
    triangle(width - 42 - 6 - 10, height - 170 - 10, width - 42 + 10 - 10, height - 170, width - 42 - 6 - 10, height - 170 + 10);
    triangle(width - 42 - 6, height - 170 - 10, width - 42 + 10, height - 170, width - 42 - 6, height - 170 + 10);
    triangle(width - 42 - 6 + 10, height - 170 - 10, width - 42 + 10 + 10, height - 170, width - 42 - 6 + 10, height - 170 + 10);
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
  
  //Turing track change letter switching animation
  if (changeTuringLetterActive === true){
    if (frameCount % 60 <= 30){
      TuringTrack[changeTuringLetterIndex] = "_";
    }
    else{
      TuringTrack[changeTuringLetterIndex] = "  ";
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
    //Simulation
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
  if (newConnectionActive !== true && changeTuringLetterActive !== true && SimulationRunning !== true){
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
