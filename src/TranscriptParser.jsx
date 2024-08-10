function parseTranscript(rawText) {
  const lines = rawText.split("\n");
  const transcript = [];
  let currentEntry = null;

  lines.forEach((line) => {
    const timeMatch = line.match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
    if (timeMatch) {
      if (currentEntry) {
        transcript.push(currentEntry);
      }
      const [, hours, minutes, seconds] = timeMatch.map(Number);
      const time = hours * 3600 + minutes * 60 + seconds;
      currentEntry = { time, text: line.substring(timeMatch[0].length).trim() };
    } else if (currentEntry) {
      currentEntry.text += " " + line.trim();
    }
  });

  if (currentEntry) {
    transcript.push(currentEntry);
  }

  return formatTranscript(transcript);
}

function formatTranscript(transcript) {
  return transcript;
}

// Assuming you have the raw transcript text in a variable called rawTranscriptText
export default parseTranscript;

// If you want to save it to a file (Node.js environment)
