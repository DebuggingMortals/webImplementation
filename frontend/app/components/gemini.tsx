'use client';
import { useState } from 'react';
import axios from 'axios';

export default function GeminiPrompt() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const API_KEY = "AIzaSyAq0NgfDDhGuToolkWrNkDF-Rq_Fd1-8LI"; // Replace with your actual Gemini API key

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            const res = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`,
                {
                    prompt: { text: prompt },
                }
            );

            setResponse(res.data.candidates?.[0]?.output || "No response received.");
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Error: Unable to fetch response.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Gemini AI Prompt Generator</h1>
            
            <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4 as number}
            />

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>

            {response && (
                <div className="mt-4 p-2 border rounded bg-gray-100">
                    <h2 className="font-semibold">Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
