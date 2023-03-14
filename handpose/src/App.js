import './App.css';
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

// Imports for hand tracking
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose"
import { drawHand } from "./utilities";

// Imports for gesture tracking
import * as fp from "fingerpose";
import peace from "./peace.png";
import thumbsUp from "./thumbsup.png"

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Emoji use states
  const [emoji, setEmoji] = useState(null);
  const images = {thumbsUp:thumbsUp, peace:peace};

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  // "net" is actually our neural network from handpose.
  const detect = async (net) => {

    // Check data is available
    if (typeof webcamRef.current !== "undefined" &&
              webcamRef.current !== null &&
              webcamRef.current.video.readyState === 4
        ) {
          // Get video properties
          const video = webcamRef.current.video;

          // Get and set video height and width to variables vidWidth and vidHeight.
          const vidWidth = webcamRef.current.video.videoWidth;
          const vidHeight = webcamRef.current.video.videoHeight;

          webcamRef.current.video.width = vidWidth;
          webcamRef.current.video.height = vidHeight;

          // Now set canvas height and width
          canvasRef.current.width = vidWidth;
          canvasRef.current.height = vidHeight;

          // Detections with our existing neural network using the handpose
          // from tensorflow. This will find and detect our hand and joints and stuff.
          const hand = await net.estimateHands(video);
          console.log(hand);

          // Append gesture detection from fingerpose library of gestures
          if (hand.length > 0) {

            // Set up a gesture estimator (fingerpose)
            const GE = new fp.GestureEstimator ([

              fp.Gestures.VictoryGesture, // peace sign
              fp.Gestures.ThumbsUpGesture,

            ])

            const gesture = await GE.estimate(hand[0].landmarks, 8);
            console.log(gesture);

            if (gesture.gestures !== undefined && gesture.gestures.length > 0) {

              // predict most confident gesture
              const confidence = gesture.gestures.map(

                (prediction) => prediction.score

              );

              const maxConfidence = confidence.indexOf(

                Math.max.apply(null, confidence)

              );
              console.log(maxConfidence)

              setEmoji(gesture.gestures[maxConfidence].name);
    
    

            }

          }

          // Draw the hand mesh.
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hand, ctx);

        }

  };

useEffect(() => { runHandpose() } , []);

  return (
    
    <div className = "App">

      <header className = "App-header">

        <Webcam ref = {webcamRef}

          style = {{

              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480

          }}
        
        />

        <canvas ref = {canvasRef}

          style = {{

            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480

          }}
        
        />

        {emoji !== null ? (

          <img

            src = {images[emoji]}
            style = {{

              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            
            }}

          />

        ) : (

          ""

        )}

      </header>

    </div>

  );
}

export default App;
