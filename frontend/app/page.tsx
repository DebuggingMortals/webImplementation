import Image from "next/image";
import Navbar from "./components/navbar";
import AmazonReviewScraper from "./components/webscrapper";
import GeminiPrompt from "./components/gemini";

export default function Home() {
  return (
    <div>
      <Navbar />
      <AmazonReviewScraper/>



    </div>
  );
}
