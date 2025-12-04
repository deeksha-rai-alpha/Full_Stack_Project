import React, { useState } from "react";
import "./Main.css";

function Main() {
     const questions = [
    "List matches played at 'Chinnaswamy Stadium.'",
    "Find the player with the highest total runs.",
    "Show the bowler who took the most wickets in the tournament.",
    "Retrieve teams with the most match wins.",
    "Identify umpires who officiated more than 10 matches.",
    "Calculate the average runs scored per match.",
    "Find players who won both 'Best Batsman' and 'Man of the Match.'",
    "Show matches that ended in a tie.",
    "Retrieve players who contributed in both batting and bowling.",
    "Find the team with the highest number of catches.",
    "Identify semifinal and final match winners.",
    "List teams that did not qualify for knockouts.",
  ];

  const [selected, setSelected] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selected) return alert("Please select a question!");

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: selected }),
      });

      const data = await res.json();
      setAnswer(JSON.stringify(data.result, null, 2));
    } catch {
      setAnswer("Error fetching data!");
    }

    setLoading(false);
  }

  return (
      <div>
      <div className="navbar">
        <h1> Cricket League Dashboard</h1>
        
      </div>

      <div className="container">
        <h2>Queries</h2>

        <div className="questions">
          {questions.map((q, i) => (
            <button
              key={i}
              className={selected === q ? "selected" : ""}
              onClick={() => setSelected(q)}
            >
              {i + 1}. {q}
            </button>
          ))}
        </div>

        <div className="input-box">
          <input
            type="text"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            placeholder="Click a question or type here..."
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>

        <div className="result-box">
          {loading ? <p>Loading...</p> : <pre>{answer || "Result will appear here..."}</pre>}
        </div>
      </div>
    </div>
  )
}

export default Main
