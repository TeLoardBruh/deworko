let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";

let state;
let targetLabel;
let squat_u;
let squat_d;
let jack_u;
let jack_d;

function keyPressed() {

  if (key == 's') {
    brain.saveData('userDataSet');

  }
}



function setup() {
  let div = createCanvas(900, 700);
  // div.addClass('container mx-auto px-4')
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  let start = document.getElementById("start");
  let sq = document.getElementById("sq");
  let ja = document.getElementById("ja");
  let hk = document.getElementById("hk");
  // console.log(sq);
  start.addEventListener("click", () => {
    // alert('hello');
    setTimeout(function () {
      console.log('collecting');
      targetLabel = 'start'
      state = 'collecting'
      console.log(targetLabel);
      setTimeout(function () {
        console.log('not collecting');
        state = 'waiting'
      }, 10000)
    }, 10000);
  });
  sq.addEventListener("click", () => {
    // alert('hello');
    setTimeout(function () {
      console.log('collecting');
      targetLabel = 'sqaut'
      state = 'collecting'
      console.log(targetLabel);
      setTimeout(function () {
        console.log('not collecting');
        state = 'waiting'
      }, 10000)
    }, 10000);
  });
  ja.addEventListener("click", () => {
    // alert('hello');
    setTimeout(function () {
      console.log('collecting');
      targetLabel = 'jack'
      state = 'collecting'
      console.log(targetLabel);
      setTimeout(function () {
        console.log('not collecting');
        state = 'waiting'
      }, 10000)
    }, 10000);
  });
  hk.addEventListener("click", () => {
    setTimeout(function () {
      console.log('collecting');
      targetLabel = 'high_knees'
      state = 'collecting'
      console.log(targetLabel);
      setTimeout(function () {
        console.log('not collecting');
        state = 'waiting'
      }, 10000)
    }, 10000);
  })
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  classifyPose();
}

function dataReady() {
  brain.normalizeData();
  brain.train({
    epochs: 50
  }, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
  classifyPose();
}







function gotPoses(poses) {

  // console.log(poses); 
  if (poses.length > 0) {

    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(85, 224, 16);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(85, 224, 16);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  // text(poseLabel, width / 2, height / 2);

}