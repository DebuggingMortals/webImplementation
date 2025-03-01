'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AmazonReviewScraper() {
    const [url, setUrl] = useState('');
    interface Review {
        Rating: string;
        Title: string;
        Author: string;
        Date: string;
        Review: string;
    }

    interface ReviewsData {
        Product: string;
        Rating: string;
        Reviews: Review[];
    }

    const [reviews, setReviews] = useState<ReviewsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('Date');

    const fetchReviews = async () => {
        if (!url.includes('amazon')) {
            alert('Invalid Amazon URL');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5001/api/scrape', { url });
            setReviews(response.data);
        } catch (error) {
            alert('Error fetching reviews');
        }
        setLoading(false);
    };

    const sortedReviews = () => {
        if (!reviews) return [];
        return [...reviews.Reviews].sort((a, b) => {
            if (sortBy === 'Rating') return b.Rating.localeCompare(a.Rating);
            if (sortBy === 'Date') return new Date(b.Date).getTime() - new Date(a.Date).getTime();
            return 0;
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Amazon Product Review Scraper</h1>
            <input
                type="text"
                placeholder="Enter Amazon Product URL"
                className="w-full p-2 border rounded mb-2"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button
                onClick={fetchReviews}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                disabled={loading}
            >
                {loading ? 'Fetching...' : 'Scrape Reviews'}
            </button>

            {reviews && (
                <div>
                    <h2 className="text-lg font-semibold">Product: {reviews.Product}</h2>
                    <p className="mb-2">Overall Rating: {reviews.Rating}</p>

                    <label>Sort by: </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border p-1 rounded mb-4"
                    >
                        <option value="Date">Date</option>
                        <option value="Rating">Rating</option>
                    </select>

                    {sortedReviews().map((review, index) => (
                        <div key={index} className="border p-2 my-2 rounded">
                            <h3 className="font-semibold">⭐ {review.Rating} - {review.Title}</h3>
                            <p className="text-sm">By {review.Author} on {review.Date}</p>
                            <p>{review.Review}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

 
