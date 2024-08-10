import React, { useState, useRef, useEffect } from "react";
import { st } from "./Transcript";
import { YoutubeTranscript } from "youtube-transcript";
import "./youtube.css";
import YouTube from "react-youtube";
import parseTranscript from "./TranscriptParser";
const transcript = parseTranscript(st);
console.log(transcript);
function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}
function VideoPlayer({ videoUrl }) {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const transcriptRef = useRef(null);
  const videoId = youtube_parser(videoUrl);
  console.log(videoId);
  useEffect(() => {
    const activeEntry = transcript.find(
      (entry, index) =>
        currentTime >= entry.time &&
        (index === transcript.length - 1 ||
          currentTime < transcript[index + 1].time)
    );

    if (activeEntry && transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector(".active");
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, transcript]);
  // Transcript data (you'd typically load this from an API or file)

  //   const fetchTranscript = async () => {
  //     try {
  //       const response = await YoutubeTranscript.fetchTranscript(videoId);
  //       const data = await response.json();
  //       console.log(data);
  //       // Process the caption data...
  //     } catch (error) {
  //       console.error("Error fetching transcript:", error);
  //     }
  //   };
  //fetchTranscript();

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    // Update currentTime regularly when video is playing
    if (event.data === YouTube.PlayerState.PLAYING) {
      const interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 100);
      return () => clearInterval(interval);
    }
  };

  const handleTranscriptClick = (time) => {
    if (player) {
      player.seekTo(time);
    }
  };

  return (
    <div>
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      <div className="transcript" ref={transcriptRef}>
        {transcript.map((entry, index) => (
          <p
            key={index}
            className={currentTime >= entry.time ? "active" : ""}
            onClick={() => handleTranscriptClick(entry.time)}
          >
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default VideoPlayer;
