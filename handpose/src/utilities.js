// Dictionary of points for each finger
// We want to join the fingers together to create a "skeleton" hand
const fingerJoints = {

    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],

}

// Hand drawing function, passing 2 parameters:
// predictions: locations of hand areas from our webcam
// ctx: our canvas to determine where to draw
export const drawHand = (predictions, ctx) => {

    // Loop through our predictions
    // First, check for predictions:
    if (predictions.length > 0) {

        predictions.forEach((prediction) => {

            const landmarks = prediction.landmarks;

            // Loop through fingers
            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {

                let finger = Object.keys(fingerJoints)[j];

                // Loop through joint pairs
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {

                    // Get each pair
                    const firstJointIndex = fingerJoints[finger][k];
                    const secJointIndex = fingerJoints[finger][k + 1];

                    // Draw a path from first to second joint.
                    ctx.beginPath();
                    ctx.moveTo(

                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1],

                    );
                    ctx.lineTo(

                        landmarks[secJointIndex][0],
                        landmarks[secJointIndex][1],

                    )
                    ctx.strokeStyle = "green";
                    ctx.lineWidth = 4;
                    ctx.stroke();

                }

            }
            
            // Loop through landmarks, drawing them out
            for (let i = 0; i < landmarks.length; i++) {

                // We just need x and y, but there is a z value
                // in the predictions array to allow us to draw the hand detection in 3d.

                const x = landmarks[i][0];
                const y = landmarks[i][1];

                // Drawing using HTML canvas arc() method (available online)
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3 * Math.PI);

                // Set lines color:
                ctx.fillStyle = "red";
                ctx.fill();

            }

        })

    }
    
}