"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./_style.scss");

var _jsqr = _interopRequireDefault(require("jsqr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var QRscanner = /*#__PURE__*/function (_Component) {
  _inherits(QRscanner, _Component);

  function QRscanner(props) {
    var _this;

    _classCallCheck(this, QRscanner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QRscanner).call(this, props));
    _this.state = {
      webcamMediaStream: null,
      status: null
    };
    _this.closeCamera = _this.closeCamera.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(QRscanner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      try {
        var drawLine = function drawLine(begin, end, color) {
          canvas.beginPath();
          canvas.moveTo(begin.x, begin.y);
          canvas.lineTo(end.x, end.y);
          canvas.lineWidth = 4;
          canvas.strokeStyle = color;
          canvas.stroke();
        }; // Use facingMode: environment to attemt to get the front camera on phones


        var video = document.createElement("video");
        var canvasElement = document.getElementById("canvas");
        var overlayElement = document.getElementById("overlay");
        var canvas = canvasElement.getContext("2d");
        var loadingMessage = document.getElementById("loadingMessage");
        var outputContainer = document.getElementById("output");
        var outputMessage = document.getElementById("outputMessage");
        var outputData = document.getElementById("outputData");
        var self = this;
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment"
          }
        }).then(function (mediaStream) {
          console.warn("Camera open and auto-close callback set!");
          self.setState({
            webcamMediaStream: mediaStream
          }); // To take down the video stream and avoid open video leaks (yes like momery leaks but video)

          setTimeout(function () {
            console.log("Creating closure");
            var lastMediaStream = mediaStream;
            return function () {
              try {
                console.warn("Going to close camera");
                lastMediaStream.getTracks().forEach(function (track) {
                  track.stop();
                });
              } catch (error) {
                console.error("=== Cannot close webcam ===");
                console.error(error);
                console.trace();
              }
            };
          }(), 30 * 1000);
          video.srcObject = mediaStream;
          video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen

          video.play();
          requestAnimationFrame(tick);
        });

        var tick = function tick() {
          requestAnimationFrame(tick);
          var NEXT_JS_CYCLE = 0;
          setTimeout(function () {
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
                var code = (0, _jsqr["default"])(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: "dontInvert"
                });

                if (code) {
                  self.props.handleScan(code.data); // DONT DELETE!: Code to draw green rectangle helper
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
        };

        setTimeout(function () {
          loadingMessage.innerText = "🎥 No se puede acceder a la cámara (asegúrese de aceptar los permisos necesarios)";
        }, 10 * 1000);
      } catch (error) {
        this.props.handleError(error);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.closeCamera();
    }
  }, {
    key: "closeCamera",
    value: function closeCamera() {
      try {
        if (this.state.webcamMediaStream) {
          this.state.webcamMediaStream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
      } catch (error) {
        console.error("=== Cannot close webcam ===");
        console.error(error);
        console.trace();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        className: "QRScanner-page"
      }, _react["default"].createElement("div", {
        id: "loadingMessage",
        style: {
          display: this.props.canScan ? 'inherit' : 'none'
        }
      }, " Aguarde un instante... "), _react["default"].createElement("div", {
        id: "overlay",
        className: this.props.overlayType === 'area' ? "overlay overlay-area" : 'overlay overlay-wristband',
        hidden: true,
        style: {
          display: this.props.canScan ? 'inherit' : 'none'
        }
      }), _react["default"].createElement("canvas", {
        id: "canvas",
        hidden: true,
        style: {
          height: "100vw",
          width: "100vw",
          display: this.props.canScan ? 'inherit' : 'none'
        }
      }), _react["default"].createElement("div", {
        id: "output",
        hidden: true
      }, _react["default"].createElement("div", {
        hidden: true,
        id: "outputMessage"
      }, "No QR code detected."), _react["default"].createElement("div", {
        hidden: true
      }, _react["default"].createElement("b", null, "Data:"), " ", _react["default"].createElement("span", {
        id: "outputData"
      }))));
    }
  }]);

  return QRscanner;
}(_react.Component);

exports["default"] = QRscanner;
