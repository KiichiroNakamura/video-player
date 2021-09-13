import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this._video = null;
    this._fullScreenActive = null;
    this._fullScreenIntervalSeconds = 5;
    this.state = {
      fullScreen: false,
      playing: false,
      showSettings: false,
      dur: "00:00:00",
      progress: "0"
    };
  }

  secondsToTime(s) {
    const pad = (n, z = 2) => ("00" + n).slice(-z);
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;
    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
  }

  componentDidMount() {}

  maskClick = () => {
    this.setState(
      prevState => ({
        fullScreen: !prevState.fullScreen
      }),
      () => {
        if (!this.state.fullScreen) {
          this._fullScreenActive = setTimeout(() => {
            this.setState({ fullScreen: true });
          }, this._fullScreenIntervalSeconds * 1000);
        } else {
          clearTimeout(this._fullScreenActive);
        }
      }
    );
  };

  playPauseClick = () => {
    this.setState(
      prevState => ({
        playing: !prevState.playing
      }),
      () => {
        if (!this.state.playing) {
          this._video.pause();
        } else {
          this._video.play();
        }
      }
    );
  };

  settingsOpen = () => {
    this.setState({ showSettings: true });
  };
  settingsClose = () => {
    this.setState({ showSettings: false });
  };
  onLoadStart = () => {
    setTimeout(() => {
      this.setState({ dur: this.secondsToTime(this._video.duration) });
    }, 100);
  };
  onProgress = () => {
    console.log(this._video.currentTime);
    this.setState({
      dur: this.secondsToTime(
        Math.round(this._video.duration - this._video.currentTime)
      ),
      progress: `${((this._video.currentTime + 0.25) / this._video.duration) *
        100}%`
    });
  };

  toggleFullScreen = () => {
    var el = document.getElementById("full-screenVideo");
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  render() {
    return (
      <div className="App">
        <h1>Video Player</h1>
        <div className="player">
          <div className="mask" onClick={this.maskClick} />
          <div
            className={`layer-setting ${this.state.showSettings && "visible"}`}
          >
            <div className="layer-setting_modal">
              <div className="modal-close">
                <button onClick={this.settingsClose}>
                  <i className="ion-close" />
                </button>
              </div>
              <div className="modal-content">
                <div className="content-list">
                  <span>Servidores</span>
                  <li>Vidlox</li>
                  <li>Rapidvideo</li>
                  <li>Openload</li>
                </div>
                <div className="content-list">
                  <span>Idioma</span>
                  <li>Latino</li>
                  <li>Ingles Subtitulado</li>
                </div>
              </div>
            </div>
          </div>

          <video
            id="full-screenVideo"
            src={"https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"}
            ref={video => (this._video = video)}
            onLoadStart={this.onLoadStart}
            onTimeUpdate={this.onProgress}
            style={{ width: "100%", height: "100%" }}
          />

          <div className={`top-bar ${this.state.fullScreen && "active"}`}>
            <div className="top-bar_back">
              <i className="ion-chevron-left" />
            </div>
            <div className="top-bar_title">Hide Controls</div>
            <img className="chromecast" src="/cast.svg" />
          </div>

          <div className={`controls ${this.state.fullScreen && "active"}`}>
            <button className="button--play" onClick={this.playPauseClick}>
              <i
                className={`icon ${
                  this.state.playing ? "ion-pause" : "ion-play"
                }`}
              />
            </button>
            <div className="progress">
              <div
                className="progress__bar"
                style={{ width: this.state.progress }}
              />
              <div className="progress__pointer" />
            </div>

            <div className="lang" onClick={this.toggleFullScreen}>
              <span>Full Screen</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
