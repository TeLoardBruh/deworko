let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";
let poseArray = ["start", "sqaut", "jack", "high_knees"]
let workoutMovement = 0;
let poseCounter = 0;


function setup() {
  createCanvas(640, 480);
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
  const modelInfo = {
    model: '/model/v10/model.json',
    metadata: '/model/v10/model_meta.json',
    weights: '/model/v10/model.weights.bin',
  };

  brain.load(modelInfo, brainLoaded);



  // noLoop();
  setInterval(checkPose, 1000)



}

function checkPose() {
  if (poseLabel.toLocaleLowerCase() == poseArray[poseCounter]) {
    workoutMovement++;
    // console.log('outer : ', workoutMovement);
    console.log(workoutMovement);
    if (workoutMovement >= 5) {
      console.log("posecounter", poseCounter);
      poseCounter++;

      workoutMovement = 0;

      console.log("workoutMovement", workoutMovement);

    }


  } else if (poseCounter >= poseArray.length) {
    poseCounter = 0;
  }


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
  // console.log(results);
  if (results[0].confidence > 0.70) {
    poseLabel = results[0].label.toUpperCase();

  }


  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
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
      strokeWeight(5);
      stroke(85, 224, 16);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 5; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(85, 224, 16);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255);
  noStroke();
  textSize(50);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);

  if (workoutMovement >= 5) {
    text("You did it!", 100, 100)

  } else {
    text("Keep going!", 100, 100)
  }

}