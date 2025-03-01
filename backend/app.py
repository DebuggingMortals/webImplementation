from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def scrape_amazon_reviews(url, max_reviews=10):
    """Scrapes Amazon product title, rating, and reviews."""
    try:
        parsed_url = urlparse(url)
        if "amazon" not in parsed_url.netloc:
            return {"error": "Invalid Amazon URL"}

        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            return {"error": f"Failed to fetch data. Status code: {response.status_code}"}

        soup = BeautifulSoup(response.text, "html.parser")
        product_title = soup.select_one("#productTitle")
        product_title = product_title.get_text(strip=True) if product_title else "Unknown Product"

        rating = soup.select_one(".a-icon-alt")
        rating = rating.get_text(strip=True) if rating else "No rating"

        reviews = soup.select(".review")
        review_data = []

        for review in reviews[:max_reviews]:
            review_text = review.select_one(".review-text").get_text(strip=True) if review.select_one(".review-text") else "No Review"
            review_text = review_text.replace("Read more", "").strip()  # Remove "Read more"

            review_data.append({
                "Title": review.select_one(".review-title").get_text(strip=True) if review.select_one(".review-title") else "No Title",
                "Author": review.select_one(".a-profile-name").get_text(strip=True) if review.select_one(".a-profile-name") else "Anonymous",
                "Date": review.select_one(".review-date").get_text(strip=True) if review.select_one(".review-date") else "Unknown Date",
                "Rating": review.select_one(".review-rating").get_text(strip=True) if review.select_one(".review-rating") else "No Rating",
                "Review": review_text,  # Use the cleaned review text
            })


        return {"Product": product_title, "Rating": rating, "Reviews": review_data}

    except Exception as e:
        return {"error": str(e)}

@app.route("/api/scrape", methods=["POST"])
def scrape():
    data = request.get_json()
    url = data.get("url", "")
    result = scrape_amazon_reviews(url)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001) 
