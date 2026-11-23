"use client";

import { useState, useEffect, type ComponentType } from "react";

// Module-level cache so App only loads once and never re-triggers the spinner on navigations
let cachedAppModule: ComponentType | null = null;
let appLoadingPromise: Promise<ComponentType> | null = null;

// Spinner shown during the loading phase (SSR and initial client load)
function Spinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #E8E2D5",
          borderTopColor: "#C9A227",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AppShell() {
  // Synchronously initialize with cachedAppModule if already loaded, preventing spinner flash
  const [App, setApp] = useState<ComponentType | null>(() => cachedAppModule);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedAppModule) {
      if (!App) {
        setApp(() => cachedAppModule);
      }
      return;
    }

    if (!appLoadingPromise) {
      appLoadingPromise = import("./App").then((mod) => {
        cachedAppModule = mod.default as ComponentType;
        return cachedAppModule;
      });
    }

    appLoadingPromise
      .then((comp) => {
        setApp(() => comp);
      })
      .catch((err) => {
        console.error("Failed to load App module:", err);
        setError(err instanceof Error ? err.message : String(err));
      });
  }, [App]);

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>
        <h2 style={{ color: "#e11d48" }}>Application Initialization Error</h2>
        <pre style={{ background: "#f1f5f9", padding: 16, borderRadius: 8, display: "inline-block", textAlign: "left" }}>
          {error}
        </pre>
      </div>
    );
  }

  if (!App) return <Spinner />;
  return <App />;
}
