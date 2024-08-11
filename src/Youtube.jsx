import React, { useState, useRef, useEffect } from "react";
import { st } from "./Transcript";
// import { YoutubeTranscript } from "youtube-transcript";
import "./youtube.css";
import YouTube from "react-youtube";
import parseTranscript from "./TranscriptParser";
import { useQuery } from "@tanstack/react-query";
const transcript = parseTranscript(st);
//console.log(transcript);
const chats = [
  { text: "dskjhgbksbakjbgks", id: 0 },
  { text: "iodsyfius", id: 1 },
];
function youtube_parser(url) {
  var regExp =  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  console.log(url)
  return match && match[7].length == 11 ? match[7] : false;
}
function VideoPlayer({ videoUrl }) {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const transcriptRef = useRef(null);
  const videoId = youtube_parser(videoUrl);
  //console.log(videoId);
  useEffect(() => {
    const activeEntry = transcript.find(
      (entry, index) =>
        currentTime >= entry.time &&
        (index === transcript.length - 1 ||
          currentTime < transcript[index + 1].time)
    );

    if (activeEntry && transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector(".active");
      // console.log(activeElement.value);
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
        <div style={{ backgroundColor: "#f0f0f0", padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "2rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                flex: "2",
                marginRight: "40px", // added some margin to the right
              }}
            >
              <YouTube
                videoId={videoId}
                onReady={onReady}
                onStateChange={onStateChange}
                style={{ maxWidth: "700px" }}
              />
              <div
                className="transcript"
                ref={transcriptRef}
                style={{
                  maxWidth: "700px",
                  padding: "0 1rem",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  overflow: "auto",
                  height: "150px",
                  marginTop: "1rem",
                }}
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
            <div
              style={{
                flex: "1",
                maxWidth: "400px",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  padding: "1rem",
                  overflowY: "auto",
                }}
              >
                {chats.map((dt, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: "#ddd",
                        padding: "0.5rem",
                        borderRadius: "5px",
                        marginBottom: "0.5rem",
                        width: "80%",
                        textAlign: dt.id ? "left" : "right",
                      }}
                    >
                      {dt.text}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                }}
              >
                <textarea style={{ flexGrow: 1, border: "none", background: "none" }} />
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  
                  onClick={() => {
                    console.log("pikachu");
                  }}
                >
                  {">>>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default VideoPlayer;