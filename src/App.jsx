import React from "react";
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";

//for code color style
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import "./App.css";

export default function App() {
  //code write and edite on problem statement
  const [code, setCode] = useState(`  function sum(){ return 1 + 1 ; } `);

  // review for the sollution on the display
  const [review, setReview] = useState(``);

  //for Loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    try {
      setLoading(true); // loading start
      const response = await axios.post("https://reviewx-backend.onrender.com/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review");
      console.error(error);
    } finally {
      setLoading(false); // stop loading
    }
  }

  return (
    <main>
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 12,
              border: "1px solid #ddd",
              borderRadius: "5px",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div className="review" onClick={reviewCode}>
          {loading ? (
            <span className="loader"></span> //spinner
          ) : (
            "Review"
          )}
        </div>
      </div>
      <div className="right">
        {loading ? (
          <p>Reviewing your code...</p>
        ) : (
          <Markdown>{review}</Markdown>
        )}
      </div>
    </main>
  );
}
