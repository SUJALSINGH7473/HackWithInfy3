import { useState } from "react";
import VideoPlayer from "./Youtube";

export default function Home() {
  const [url, setUrl] = useState("");
  return (
    <>
      <div style={{ display: "flex" }}>
        <input type="text" id="urlIn" />
        <button
          onClick={() => {
            setUrl(document.getElementById("urlIn").value);
          }}
        >
          Submit
        </button>
      </div>
      {url != "" && <VideoPlayer videoUrl={url} />}
    </>
  );
}
