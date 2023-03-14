import logo from './logo.svg';
import './App.css';
import React, {useRef} from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose"
import {drawHand} from "./utilities";

const WebcamComponent = () => <Webcam />;

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandpose = async () => {

    const net = await handpose.load()
    console.log('Model loaded.')

    // Loop and detect hands using setInterval
    setInterval( () => {
      // detect the handpose neural network
      detect(net)

    }, 100) // every 100ms, detect hand in frame

  }

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

          // Draw the hand mesh.
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hand, ctx);

        }

  }

  runHandpose();

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

      </header>

    </div>

  );
}

export default App;
