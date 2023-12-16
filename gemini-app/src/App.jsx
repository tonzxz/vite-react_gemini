// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import './App.css';

function App() {
  const [generatedText, setGeneratedText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleGeneratedText = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Set the generated text instantly without any delay
      setGeneratedText(data.generatedText);
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // You can keep the initial fetch on component mount if needed
    handleGeneratedText();
  }, []); // This will run only once on component mount

  return (
    <div className="App">
      <h1>sagot</h1>
      <div>
        <label htmlFor="promptInput">bff ni wa:</label>
        <input
          type="text"
          id="promptInput"
          value={userPrompt}
          onChange={handlePromptChange}
        />
        <button onClick={handleGeneratedText}>payo</button>
      </div>
      <div className="loading-container">
        <ClipLoader loading={loading} size={30} color="#36D7B7" />
      </div>
      <h3>{!loading && generatedText}</h3>
    </div>
  );
}

export default App;
