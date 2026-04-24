import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResponse(null);

    let parsedData;

    try {
      // Allow user to enter comma-separated or JSON
      if (input.startsWith("[")) {
        parsedData = JSON.parse(input);
      } else {
        parsedData = input.split(",").map(item => item.trim());
      }
    } catch (e) {
      setError("Invalid input format");
      return;
    }

    try {
      const res = await fetch("https://bfhl-project-yyw3.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: parsedData })
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("API request failed");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🌳 BFHL Tree Builder</h1>

      <textarea
        rows="5"
        cols="60"
        placeholder='Enter data like: ["A->B","B->C"] OR A->B, B->C'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response</h2>
          <pre style={{ background: "#f4f4f4", padding: "15px" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;