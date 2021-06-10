let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";
// arrays of workouts movement
let poseArray = ["start", "sqaut", "jack", "single_leg_stand_r", "single_leg_stand_l", "high_knees", "jumping_lunge_r", "jumping_lunge_l", "lateral_shuffles"]
let workoutMovement = 0;
let poseCounter = 0;
// body postiions
// right
let rightHipX = 0;
let rightHipY = 0;
let rightKneeX = 0;
let rightKneeY = 0;
let rightUnderKneeX = 0;
let rightUnderKneeY = 0;

// left
let leftHipX = 0;
let leftHipY = 0;
let leftKneeX = 0;
let leftKneeY = 0;
let leftUnderKneeX = 0;
let leftUnderKneeY = 0;
let rightShoulderX = 0;
let rightShoulderY = 0;


// timer 
let timer = 5;
let sec = 0;
let counter = 0;
let d_prev = 0;
let pCount = 7;
let count = 0;
let state;
let sumAve = 0;
let moveArr = [];


function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    video.size(width, height);
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
        model: './data/model.json',
        metadata: './data/model_meta.json',
        weights: './data/model.weights.bin',
    };

    brain.load(modelInfo, brainLoaded);



    // noLoop();
    //   setInterval(checkPose, 1000)



}

function ave() {
    for (var i = 0; i < 5; i++) {
        sumAve += parseInt(moveArr[i], 10); //don't forget to add the base
    }
    console.log(sumAve);
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

function calPose() {


    // let v0 = createVector(rightShoulderX, rightShoulderY);

    // let v1 = createVector(rightHipX, rightHipY);
    // let angleBetween = v0.angleBetween(v1);
    // console.log(d);
    if (poseArray[pCount] == "sqaut") {
        let d = dist(rightHipX, rightHipY, rightKneeX, rightKneeY);
        // console.log("in here");
        if (d < 90) {
            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);
        // ellipse(rightShoulderX, rightShoulderY, 30);
        // text(angleBetween, rightShoulderX, rightShoulderY);
        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 95 && d_prev >= 100) {
            count++;
            moveArr.push(d);
            console.log(count);
            // console.log("d_prev" + d_prev);

            // mySound.play();
        }


        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            ave();
            console.log("suc");


        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;

        // console.log(counter);
        // console.log(d);

    } else if (poseArray[pCount] == "jack") {
        let d = dist(rightHipX, rightHipY, rightShoulderX, rightShoulderY);
        if (d < 60) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 60 && d_prev >= 100) {
            count++;
            console.log(count);
            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 10) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "single_leg_stand_r") {
        let d = parseInt(dist(rightUnderKneeX, rightUnderKneeY, leftUnderKneeX, leftUnderKneeY));
        if (d < 50) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 10 && frameCount % 60 == 0) {
            sec++;
            text('leg down', 100, 100);
            console.log(sec);
            if (sec >= 5) {
                count++;
                console.log('in counter : ' + count);
                sec = 0;
                text('leg down', 100, 100);
            }

            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "single_leg_stand_l") {
        let d = parseInt(dist(rightUnderKneeX, rightUnderKneeY, leftUnderKneeX, leftUnderKneeY));
        if (d < 50) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 10 && frameCount % 60 == 0) {
            sec++;
            text('leg down', 100, 100);
            console.log(sec);
            if (sec >= 5) {
                count++;
                console.log('in counter : ' + count);
                sec = 0;
                text('leg down', 100, 100);
            }

            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "high_knees") {
        let d = parseInt(dist(rightHipX, rightHipY, rightKneeX, rightKneeY));
        if (d < 80) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 80 && d_prev >= 100) {
            count++;
            console.log(count);
            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "jumping_lunge_r") {
        let d = parseInt(dist(rightHipX, rightHipY, rightKneeX, rightKneeY));

        if (d < 80) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 100 && d_prev >= 110) {
            count++;
            console.log(count);
            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "jumping_lunge_l") {
        // let d = parseInt(dist(leftHipX, leftHipY, leftKneeX, leftKneeY));
        let d = parseInt(dist(rightHipX, rightHipY, rightKneeX, rightKneeY));

        if (d < 100) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 100 && d_prev >= 110) {


            count++;

            console.log('after 5 : ' + count);


            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else if (poseArray[pCount] == "lateral_shuffles") {
        let d = parseInt(dist(rightHipX, rightHipY, rightKneeX, rightKneeY));

        if (d < 80) {

            stroke(0, 255, 0);
        } else {
            stroke(255, 0, 0);
        }
        ellipse(rightHipX, rightHipY, d);

        textSize(50);
        text(d, rightHipX, rightHipY);
        // if a squat is detected (when someone sits down, and up), increase the counter by 1
        if (d < 80 && d_prev >= 100) {
            count++;
            console.log(count);
            // console.log("d_prev" + d_prev);

            // mySound.play();
        }
        // if the counter reaches at 5, display "You did it" otherwise "keep going!"
        textSize(50);
        fill(255);
        if (count >= 5) {
            // text("You did it!", 100, 100);
            pCount++;
            console.log("suc");
        } else {
            // text("Keep going!", 100, 100)
        }
        d_prev = d;
        // console.log(counter);
        // console.log(d);
    } else {
        noLoop();
    }
    // else if(poseArray)
}


function gotPoses(poses) {
    if (poses.length > 0) {
        // right pose
        rightShoulderX = poses[0].pose.keypoints[8].position.x;
        rightShoulderY = poses[0].pose.keypoints[8].position.y;
        rightHipX = poses[0].pose.keypoints[12].position.x;
        rightHipY = poses[0].pose.keypoints[12].position.y;
        rightKneeX = poses[0].pose.keypoints[14].position.x;
        rightKneeY = poses[0].pose.keypoints[14].position.y;
        // left pose 
        leftHipX = poses[0].pose.keypoints[11].position.x;
        leftHipY = poses[0].pose.keypoints[11].position.y;
        leftKneeX = poses[0].pose.keypoints[13].position.x;
        leftKneeY = poses[0].pose.keypoints[13].position.y;
        rightUnderKneeX = poses[0].pose.keypoints[16].position.x;
        rightUnderKneeY = poses[0].pose.keypoints[16].position.y;
        leftUnderKneeX = poses[0].pose.keypoints[15].position.x;
        leftUnderKneeY = poses[0].pose.keypoints[15].position.y;


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
    // new code
    calPose()

    // ===================================


}