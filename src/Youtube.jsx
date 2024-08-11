import React, { useState, useRef, useEffect } from "react";
import { st } from "./Transcript";
import "./youtube.css";
import YouTube from "react-youtube";
import parseTranscript from "./TranscriptParser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const transcript = parseTranscript(st);

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}
const chatMessages = [{ text: "Hey there I am your help desk", id: 1 }];

function VideoPlayer({ videoUrl }) {
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [inputValue, setInputValue] = useState(""); // State for input field
  const transcriptRef = useRef(null);
  const videoId = youtube_parser(videoUrl);
  const [active, setActive] = useState(true);

  async function getResponse(transcript, message) {
    setActive(false);
    axios
      .post("https://9mxq95pv-3000.inc1.devtunnels.ms/api/chat", {
        message,
        transcript,
      })
      .then((res) => {
        console.log(chatMessages.length);
        chatMessages.push({ text: res.data.Assistant, id: 1 });
        setActive(true);
      })
      .catch((err) => {
        console.log(err);
        setActive(true);
      });
    console.log("posdfio");
  }
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

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
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
            marginRight: "40px",
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
                  currentTime >= entry.start &&
                  entry.start >= currentTime - 2.75
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
              height: "300px", // Adjust the height as needed
              width: "100%",
              padding: "1rem",
              overflowY: "auto", // Allow vertical scrolling
              overflowX: "hidden", // Prevent horizontal scrolling
            }}
          >
            {chatMessages.map((dt, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: dt.id ? "#b7a3a3" : "#ddd",
                  float: dt.id ? "left" : "right",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginBottom: "0.5rem",
                  width: "80%", // Ensure chat message stays within the box
                  wordWrap: "break-word", // Break long words to prevent overflow
                  textAlign: "left",
                  //  textAlign: dt.id % 2 === 0 ? "right" : "left", // Example alignment
                }}
              >
                {dt.text}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
            }}
          >
            <textarea
              style={{
                flexGrow: 1,
                border: "2px solid grey",
                padding: "0.5rem",
                margin: "2px",
              }}
              id="txt" // Bind input field value to state
              // Update state on input change
            />
            {active && (
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
                  const dat = document.getElementById("txt").value;
                  document.getElementById("txt").value = "";
                  chatMessages.push({ text: dat, id: 0 });
                  //setChatMessages([...chatMessages, { text: dat, id: 0 }]);
                  getResponse(data, dat);
                }}
              >
                {">>>"}
              </button>
            )}
            {!active && <div>...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
