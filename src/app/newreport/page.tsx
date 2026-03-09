"use client";
import React, { useRef, useState, useEffect } from "react";

export default function Newreport() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request camera access on mount
    async function getCamera() {
      console.log("Requesting camera...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Could not access camera.");
        // setLoading(false);
        console.error(err);
      }
    }
    getCamera();
    // setTimeout(() => setLoading(false), 1000);
    console.log("Camera setup complete.");
    // Cleanup: stop camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      // setLoading(false);
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 300);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedImage(dataUrl);
        console.log(dataUrl); // For debugging
      }
    }
    // Stop camera after capture
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  };

  const handleUpload = () => {
    // Implement upload logic here
    alert("Uploading...");
  };

  // Speech Recognition State
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if the browser supports Speech Recognition API
    if (typeof window !== 'undefined') {
      const isSupported =
        typeof window.SpeechRecognition !== 'undefined' ||
        typeof window.webkitSpeechRecognition !== 'undefined';

      if (!isSupported) {
        setError('Your browser does not support Speech Recognition.');
        return;
      }

      // Initialize SpeechRecognition
      const recognitionInstance =
        new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      setRecognition(recognitionInstance);

      // Set up the recognition properties
      recognitionInstance.lang = 'en-US'; // You can change this to any supported language like 'hi-IN' for Hindi
      recognitionInstance.continuous = true; // Keep recognition running
      recognitionInstance.interimResults = true; // Show interim results

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionInstance.onresult = (event: any) => {
        const latestTranscript =
          event.results[event.results.length - 1][0].transcript;
        console.log('Listened:', latestTranscript);
        setTranscript(latestTranscript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech Recognition error:', event.error);
        setError(`Error: ${event.error}`);
      };

      // Clean up when component unmounts
      return () => {
        recognitionInstance.stop();
      };
    }
  }, []);

  // Start the speech recognition
  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setError('');
      recognition.start();
    }
  };

  // Stop the speech recognition
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-xl shadow border border-zinc-800 p-6 flex flex-col items-center gap-4 w-full max-w-md">
        {/* {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-gray-600 text-lg">Loading camera...</span>
          </div> */}
        {/* ): */}
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width={400}
              height={300}
              className="rounded-xl bg-zinc-950 shadow-sm border border-zinc-800"
            />
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              style={{ display: "none" }}
            />
            <button
              className="mt-6 w-full px-6 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-50 rounded-lg font-medium text-lg transition-colors shadow-sm"
              onClick={() => { window.location.href = '/' }}
            >
              Go Back
            </button>
            <button
              className="mt-3 w-full px-6 py-3 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 rounded-lg font-medium text-lg transition-colors shadow-sm"
              onClick={handleCapture}
            >
              Capture Image
            </button>
          </>
        ) : (
          <>
            <img
              src={capturedImage}
              alt="Preview"
              className="rounded-xl w-full h-auto shadow-sm"
            />
            <button
              className="mt-3 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-zinc-300 text-sm font-medium transition-colors"
              onClick={handleRetake}
            >
              Retake
            </button>
            <div className="w-full flex-col auto">
              <div className="flex flex-row w-full gap-2">
                <input
                  type="text"
                  className="mt-4 w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-shadow"
                  placeholder="Enter description..."
                  value={transcript || description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors" onClick={() => { setDescription(""); setTranscript(""); }}>Clear</button></div>
              <div className="flex gap-2 w-full">
                <button className="mt-4 flex-1 px-6 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-50 rounded-lg font-medium transition-colors shadow-sm" onClick={startListening}>🎙️ Listen</button>
                <button className="mt-4 flex-1 px-6 py-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-500 rounded-lg font-medium transition-colors shadow-sm" onClick={stopListening}>⏹️ Stop</button>
              </div>
            </div>
            {isListening ? (<p className="text-zinc-400 mt-2 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Listening...</p>) : (<p className="text-zinc-500 mt-2 text-sm">Not listening</p>)}
            {error && <p className="text-red-500 mt-2 text-sm">Error: {error}</p>}
            <button
              className="mt-6 w-full px-6 py-3 bg-zinc-50 hover:bg-zinc-200 text-zinc-950 rounded-lg font-medium text-lg transition-colors shadow-sm"
              onClick={handleUpload}
            >
              Upload Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}

