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
titleElement.textContent = "Contextual Cooking Guide - AI-Driven Suggestions for Indian Households";
document.head.appendChild(titleElement);

// Set meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "An AI-driven platform that helps Indian families decide what to cook for daily routines and special occasions based on cultural context and preferences.";
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
