import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import '/src/App.css';


function GeminiPro() {
  const [generatedText, setGeneratedText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleKeyPress = (e) => {
    if(e.key === 'Enter') {
        handleGeneratedText();
    }
  };

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const colorsGradient = ["#ec4899", "#8b5cf6"];
  const handleGeneratedText = async () => {
    try {
      setLoading(true);
      setGeneratedText("");
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      setLoading(false);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.body.getReader();
      const decoder = new TextDecoder();
      while(true){
        const  {value , isDone} = await data.read();
        if(value == undefined){
          break;
        }
        const chunk = decoder.decode(value, {stream : true});
        const text = String(chunk).replaceAll("**", "");
        setGeneratedText(generatedText => generatedText + text);
      }
      // Set the generated text instantly without any delay
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      
    }
  };

  useEffect(() => {
    // You can keep the initial fetch on component mount if needed
    handleGeneratedText();
  }, []); // This will run only once on component mount

  return (
    <div className="relative">
    {/* Loading spinner centered in the middle of the screen */}
    {loading && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ClipLoader size={30} color={colorsGradient} />
      </div>
    )}
    
    <div> 
    <p className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-center pb-14"> BFF ni Wa</p>
    </div>
    {/* Content section */}
   <div className="text-left text-lg px-24 py-1 bg-zinc rounded-3xl">
      <h3>{!loading && <pre className="text-wrap">{generatedText}</pre>}</h3>
    </div>
  
    {/* Input fixed at the bottom */}
    <div className="fixed bottom-6 px-40 w-10/12 content-end gap-8 items-center">
      <Input
        type="text"
        id="promptInput"
        value={userPrompt}
        onChange={handlePromptChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  </div>
  
    
  );
}

export default GeminiPro;