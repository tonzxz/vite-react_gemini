import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import '/src/App.css';

function GeminiPro() {
  const [generatedText, setGeneratedText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedPrompt, setDisplayedPrompt] = useState('');

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleSendClick = () => {
    setDisplayedPrompt(userPrompt); // This will trigger the useEffect below
    setUserPrompt(''); // Clear input after sending
  };

  const colorsGradient = ["#ec4899", "#8b5cf6"];

  const handleGeneratedText = async (prompt) => {
    if (!prompt) return; // Only proceed if there is a prompt

    try {
      setLoading(true);
      setGeneratedText(""); // Clear previous text
      console.log("Sending prompt:", prompt);
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.body.getReader();
      const decoder = new TextDecoder();
      let chunkText = '';
      while (true) {
        const { value, done } = await data.read();
        if (done) break;
        chunkText += decoder.decode(value, {stream: true});
      }
      setGeneratedText(chunkText.replaceAll("**", ""));
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGeneratedText(displayedPrompt);
  }, [displayedPrompt]); // React to changes in displayedPrompt


  return (
    <div className="relative lg:mx-4 lg:my-2 mx-0 my-0 h-full w-full flex flex-col items-center">
    {/* Loading indicator */}
    {loading && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ClipLoader size={30} color={colorsGradient} />
      </div>
    )}
    
    
   
    {/* Content section */}
   <div className=" text-center lg:h-4/5  h-full w-11/12 lg:mx-10 mx-14 lg:w-3/5   lg:text-lg lg:mb-32 my-4 overflow-y-auto  bg-zinc rounded-xl font-normal">
   
   <div className="mt-4"> 
    <h1 className="lg:text-6xl text-4xl lg:mx-10 mx-12 font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500  text-center pb-4"> QuanBot</h1>
    </div>
        {/* <h1>{!loading && <pre className="my-4 mx-10 text-wrap h-3/5 text-black "> {generatedText}</pre>}</h1> */}
  
  
        <div class="h-3/4 w-full overflow-y-auto my-4">
    
    <div class="flex items-start max:w-11/12 mb-4">
        <img src="https://media.licdn.com/dms/image/C4E03AQGGx7q55zEuEg/profile-displayphoto-shrink_800_800/0/1606211581882?e=2147483647&v=beta&t=vODPBATqE5vyEqsRHBuPbxrOpsuAs2uEX0X6uO91y9c" alt="Gemini Avatar" class="w-14 h-14 rounded-full mr-4" />
        <div class="bg-gray-300 max-w-9/12 p-4 rounded-xl">
            <p class="text-left text-sm px-2">Hi! I'm QuanBot, do you need help?
            </p>
        </div>
    </div>
  

  
    {displayedPrompt && (
  <div class="flex justify-end items-start max:w-11/12 mb-4">
    <div class="bg-blue-500 max-w-9/12  p-4 rounded-xl">
      <p class="text-left text-white text-sm px-2">{displayedPrompt}</p>
    </div>
    <img src="https://pbs.twimg.com/profile_images/1439953850471911426/s4pE9SYa_400x400.jpg" alt="User Avatar" class="w-14 h-14 rounded-full ml-4" />
  </div>
)}


{generatedText && (
  <div class="flex items-start max:w-11/12 mb-4">
    <img src="https://media.licdn.com/dms/image/C4E03AQGGx7q55zEuEg/profile-displayphoto-shrink_800_800/0/1606211581882?e=2147483647&v=beta&t=vODPBATqE5vyEqsRHBuPbxrOpsuAs2uEX0X6uO91y9c" alt="Gemini Avatar" class="w-14 h-14 rounded-full mr-4" />
    <div class="bg-gray-300 max-w-9/12 p-4 rounded-xl">
      <p class="text-left text-sm px-2">{generatedText}</p>
    </div>
  </div>
)}
  
  
</div>


   
    </div>
  
    {/* Input fixed at the bottom */}
    <div className="fixed bottom-9 lg:w-3/5 w-10/12 lg:mx-0 text-black content-end items-center">
        <div className="relative flex">
          <Input
            type="text"
            id="promptInput"
            value={userPrompt}
            onChange={handlePromptChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendClick();
              }
            }}
            className="pr-20" // Adjust padding if necessary
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-3xl ml-2 absolute right-1 w-16 h-10 top-0 bottom-0 my-auto"
            onClick={handleSendClick}
          >
            Send
          </button>
        </div>
      </div>

 
  </div>
    
  );
}

export default GeminiPro;




