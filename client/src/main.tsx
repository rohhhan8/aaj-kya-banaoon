import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Google Fonts for the food-friendly typography
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap";
document.head.appendChild(linkElement);

// Add Font Awesome for icons
const fontAwesomeElement = document.createElement("link");
fontAwesomeElement.rel = "stylesheet";
fontAwesomeElement.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeElement);

// Set meta title
const titleElement = document.createElement("title");
titleElement.textContent = "RasaRoots - AI-Powered Indian Cooking Companion";
document.head.appendChild(titleElement);

// Set meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Discover the perfect dishes for your Indian kitchen with RasaRoots - your AI-powered cooking companion tailored to time, season, and special occasions.";
document.head.appendChild(metaDescription);

// Update Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.setAttribute("name", "og:title");
ogTitle.setAttribute("content", "RasaRoots - AI-Powered Indian Cooking Companion");
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.setAttribute("name", "og:description");
ogDescription.setAttribute("content", "Discover the perfect dishes for your Indian kitchen with RasaRoots - tailored to your day, time, and special occasions.");
document.head.appendChild(ogDescription);

createRoot(document.getElementById("root")!).render(<App />);
