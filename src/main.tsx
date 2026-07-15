import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadRuntimeConfig } from "./lib/config";

async function removeLegacyPwaArtifacts() {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      );
    }

    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("deokgil-"))
          .map((cacheName) => caches.delete(cacheName)),
      );
    }
  } catch (error) {
    console.warn("기존 앱 캐시를 정리하지 못했습니다:", error);
  }
}

// Load runtime configuration before rendering the app
async function initializeApp() {
  // Prerendered blog pages are served as pure static HTML for SEO.
  // Intentionally skip React mounting so the crawler-facing markup stays
  // lightweight and self-contained — no client-side hydration needed.
  if (
    document
      .querySelector('meta[name="prerender-static-page"]')
      ?.getAttribute("content") === "blog"
  ) {
    return;
  }

  await removeLegacyPwaArtifacts();

  try {
    await loadRuntimeConfig();
    console.log("Runtime configuration loaded successfully");
  } catch (error) {
    console.warn(
      "Failed to load runtime configuration, using defaults:",
      error,
    );
  }

  // Render the app
  createRoot(document.getElementById("root")!).render(<App />);
}

// Initialize the app
initializeApp();
