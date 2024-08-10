import React, { useState, useRef, useEffect } from "react";
import { st } from "./Transcript";
// import { YoutubeTranscript } from "youtube-transcript";
import "./youtube.css";
import YouTube from "react-youtube";
import parseTranscript from "./TranscriptParser";
import { useQuery } from "@tanstack/react-query";
const transcript = parseTranscript(st);
//console.log(transcript);
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
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    }
  }, [currentTime]);
  const { isLoading, error, data } = useQuery({
    queryKey: `${videoId}-transcript`,
    queryFn: () =>
      fetch(`http://localhost:5000/api/data?vId=${videoId}`).then((res) =>
        res.json()
      ),
  });
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
  if (isLoading) return <div>Loading...</div>;
  //console.log(data);

  return (
    <div>
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        style={{ position: "fixed", top: "3rem", left: "20rem" }}
      />

      <div
        className="transcript"
        ref={transcriptRef}
        style={{ position: "fixed", top: "26rem", left: "30rem" }}
      >
        {data.map((entry, index) => (
          <p
            key={index}
            className={
              currentTime >= entry.start && entry.start >= currentTime - 2.75
                ? "active"
                : ""
            }
            onClick={() => handleTranscriptClick(entry.start)}
          >
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default VideoPlayer;
