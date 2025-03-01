'use client';
import { useState } from 'react';
import axios from 'axios';

interface Review {
    Rating: string;
    Title: string;
    Author: string;
    Date: string;
    Review: string;
}

interface GeminiPromptProps {
    selectedReviews: Review[];
}

export default function GeminiPrompt({ selectedReviews }: GeminiPromptProps) {
    const [overview, setOverview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateOverview = async () => {
        if (!selectedReviews || selectedReviews.length === 0) {
            alert("Please select reviews first.");
            return;
        }

        setLoading(true);
        setOverview('');
        setError(null);

        try {
            const res = await axios.post('http://127.0.0.1:5001/generate-gemini-overview', { reviews: selectedReviews });
            setOverview(res.data.overview || "No overview received.");
        } catch (error) {
            console.error("Error fetching overview:", error);
            setError("Error: Unable to fetch overview.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Gemini AI Overview Generator</h1>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleGenerateOverview}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Overview"}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {overview && (
                <div className="mt-4 p-2 border rounded bg-gray-800">
                    <h2 className="font-semibold">Overview:</h2>
                    <p>{overview}</p>
                </div>
            )}
        </div>
    );
}

