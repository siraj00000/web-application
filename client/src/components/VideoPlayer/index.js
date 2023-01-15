import { useRef, useState } from "react";
import "./video_player.css";
// Mui Icon
import Replay5Icon from '@mui/icons-material/Replay5';
import Forward5Icon from '@mui/icons-material/Forward5';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';

function VideoPlayer({ source }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [progress, setProgress] = useState(0);

    const videoHandler = (control) => {
        if (control === "play") {
            videoRef.current.play();
            setPlaying(true);
            var vid = document.getElementById("video1");
            setVideoTime(vid.duration);
        } else if (control === "pause") {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    const fastForward = () => {
        videoRef.current.currentTime += 5;
    };

    const revert = () => {
        videoRef.current.currentTime -= 5;
    };

    window.setInterval(function () {
        setCurrentTime(videoRef.current?.currentTime);
        setProgress((videoRef.current?.currentTime / videoTime) * 100);
    }, 1000);

    return (
        <div className="app">
            <video
                id="video1"
                ref={videoRef}
                className="video"
                src={source}
            ></video>

            <div className="controlsContainer">
                <div className="controls">
                    <Replay5Icon
                        onClick={revert}
                        className="controlsIcon"
                    />
                    {playing ? (
                        <PauseCircleOutlineOutlinedIcon
                            onClick={() => videoHandler("pause")}
                            className="controlsIcon--small"
                        />
                    ) : (
                        <PlayCircleOutlineOutlinedIcon
                            onClick={() => videoHandler("play")}
                            className="controlsIcon--small"
                        />
                    )}
                    <Forward5Icon
                        onClick={fastForward}
                        className="controlsIcon"
                    />
                </div>
            </div>

            <div className="timecontrols">
                <p className="controlsTime">
                    {Math.floor(currentTime / 60) +
                        ":" +
                        ("0" + Math.floor(currentTime % 60)).slice(-2)}
                </p>
                <div className="time_progressbarContainer">
                    <div
                        style={{ width: `${progress}%` }}
                        className="time_progressBar"
                    ></div>
                </div>
                <p className="controlsTime">
                    {Math.floor(videoTime / 60) +
                        ":" +
                        ("0" + Math.floor(videoTime % 60)).slice(-2)}
                </p>
            </div>
        </div>
    );
}

export default VideoPlayer;