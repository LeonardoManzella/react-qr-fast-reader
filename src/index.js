import React, { Component } from 'react';
import './_style.scss';
import jsQR from "jsqr";


export default class QRscanner extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
            webcamMediaStream: null,
            status: null
        };

        this.closeCamera = this.closeCamera.bind(this);
    }

    componentDidMount(){
        try {
            var video = document.createElement("video");
            var canvasElement = document.getElementById("canvas");
            var overlayElement = document.getElementById("overlay");
            var canvas = canvasElement.getContext("2d");
            var loadingMessage = document.getElementById("loadingMessage");
            var outputContainer = document.getElementById("output");
            var outputMessage = document.getElementById("outputMessage");
            var outputData = document.getElementById("outputData");
            var self = this;
      
            function drawLine(begin, end, color) {
              canvas.beginPath();
              canvas.moveTo(begin.x, begin.y);
              canvas.lineTo(end.x, end.y);
              canvas.lineWidth = 4;
              canvas.strokeStyle = color;
              canvas.stroke();
            }
      
            // Use facingMode: environment to attemt to get the front camera on phones
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(mediaStream) {
                console.warn("Camera open and auto-close callback set!");
                self.setState({webcamMediaStream: mediaStream}); // To take down the video stream and avoid open video leaks (yes like momery leaks but video)
                setTimeout( (
                    () => {
                    console.log("Creating closure");
                    var lastMediaStream = mediaStream;
                    return ()=>{
                        try{ 
                            console.warn("Going to close camera");
                            lastMediaStream.getTracks().forEach(function(track) {
                                track.stop();
                            });
                        } catch (error){
                            console.error("=== Cannot close webcam ===");
                            console.error(error);
                            console.trace();
                        }
                    }
                    }
                )(), 30*1000);

                video.srcObject = mediaStream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            });
                  
            const tick = function() {
              requestAnimationFrame(tick);
              const NEXT_JS_CYCLE = 0;
              setTimeout(() => {
                try {
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        loadingMessage.hidden = true;
                        canvasElement.hidden = false;
                        overlayElement.hidden = false;
                        outputContainer.hidden = false;
            
                        canvasElement.height = video.videoHeight;
                        canvasElement.width = video.videoWidth;
                        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                        var code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "dontInvert",
                        });
                        if (code) {
                            self.props.handleScan(code.data);
                            // DONT DELETE!: Code to draw green rectangle helper
                            // var color = "#05B328";
                            // drawLine(code.location.topLeftCorner, code.location.topRightCorner, color);
                            // drawLine(code.location.topRightCorner, code.location.bottomRightCorner, color);
                            // drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, color);
                            // drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, color);
                            // outputMessage.hidden = true;
                            // // outputData.parentElement.hidden = false;
                            // outputData.innerText = code.data;
            
                            // if(self.props.canScan){
                            //     setTimeout(() => {
                            //         self.props.handleScan(code.data);
                            //     }, 0.30*1000); //Time to draw lines over QR code
                            // }
                        } else {
                            // outputMessage.hidden = false;
                            outputData.parentElement.hidden = true;
                        }
                    }
                    
                } catch (error) {
                    self.props.handleError(error);
                }
              }, NEXT_JS_CYCLE);
            }

            setTimeout(() => {
                loadingMessage.innerText = "🎥 No se puede acceder a la cámara (asegúrese de aceptar los permisos necesarios)";
            }, 10*1000);
        } catch (error) {
            this.props.handleError(error);
        }
    }

    componentWillUnmount(){
        this.closeCamera();
    }

    closeCamera(){
        try{ 
            if(this.state.webcamMediaStream){
                this.state.webcamMediaStream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }
        } catch (error){
            console.error("=== Cannot close webcam ===");
            console.error(error);
            console.trace();
        }
    }

    render() {
        return(
        <div className="QRScanner-page">
            <div id="loadingMessage" style={{ display: this.props.canScan ? 'inherit' : 'none'}}> Aguarde un instante... </div>
            <div id="overlay" className={ this.props.overlayType==='area' ? "overlay overlay-area" : 'overlay overlay-wristband' } hidden style={{ display: this.props.canScan ? 'inherit' : 'none' }}></div>
            <canvas id="canvas" hidden style={{height: "100vw", width: "100vw", display: this.props.canScan ? 'inherit' : 'none'}}></canvas>
            <div id="output" hidden>
              <div hidden id="outputMessage">No QR code detected.</div>
              <div hidden><b>Data:</b> <span id="outputData"></span></div>
            </div>
        </div>
        )
    }
}
