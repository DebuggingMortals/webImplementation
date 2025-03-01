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
    reviews: Review[] | null;
}

export default function TopReviews({ reviews }: GeminiPromptProps) {
    const [overview, setOverview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSummary = async () => {
        if (!reviews || reviews.length === 0) {
            alert("No reviews available to summarize.");
            return;
        }

        // Take top 5 reviews
        const topReviews = reviews.slice(0, 5);
        
        setLoading(true);
        setOverview('');
        setError(null);

        try {
            const res = await axios.post('http://127.0.0.1:5001/generate-gemini-overview', { 
                reviews: topReviews 
            });
            setOverview(res.data.overview || "No overview received.");
        } catch (error) {
            console.error("Error fetching overview:", error);
            setError("Error: Unable to fetch overview.");
        }

        setLoading(false);
    };

    return (
        <div className="mt-6">
            <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200 w-full"
                onClick={handleGenerateSummary}
                disabled={loading || !reviews || reviews.length === 0}
            >
                {loading ? "Generating..." : "Summary of Top Reviews"}
            </button>

            {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 mt-4">
                    {error}
                </div>
            )}

            {overview && (
                <div className="p-4 border rounded bg-gray-50 mt-4">
                    <h3 className="font-semibold mb-2">Summary:</h3>
                    <p className="text-gray-800">{overview}</p>
                </div>
            )}
        </div>
    );
}