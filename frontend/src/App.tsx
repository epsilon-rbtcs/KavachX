import React, { useEffect, useState } from "react";

import NationalLandingPage from "./components/NationalLandingPage";
import AccessibilityControls from "./components/AccessibilityControls";
import OfficialDashboard from "./components/OfficialDashboard";
import AuditLogsView from "./components/AuditLogsView";

type CurrentView = "landing" | "dashboard" | "audit_logs";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(14);

  const [currentView, setCurrentView] =
    useState<CurrentView>("landing");

  const [autoOpenUploadModal, setAutoOpenUploadModal] =
    useState(false);

  // Accessibility controls
  const [saturation, setSaturation] = useState<
    "normal" | "mono" | "high"
  >("normal");

  const [lightContrast, setLightContrast] = useState(false);
  const [invert, setInvert] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [hideImages, setHideImages] = useState(false);

  const [textSpacing, setTextSpacing] = useState<
    "normal" | "wide" | "widest"
  >("normal");

  const [lineHeight, setLineHeight] = useState<
    "normal" | "relaxed" | "loose"
  >("normal");

  const [isAccOpen, setIsAccOpen] = useState(false);

  // Apply text-size changes globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}px`;

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textSize]);

  const handleResetAccessibility = () => {
    setSaturation("normal");
    setLightContrast(false);
    setHighContrast(false);
    setInvert(false);
    setTextSize(14);
    setHighlightLinks(false);
    setHideImages(false);
    setTextSpacing("normal");
    setLineHeight("normal");
    setIsAccOpen(false);
  };

  // Landing-page search
  const handleLandingSearch = (
    query: string,
    category: string
  ) => {
    console.log(
      "Network security search:",
      query,
      category
    );
  };

  // Navigation from landing page to SOC/dashboard features
  const handleLandingNavigation = (
    tab:
      | "submit"
      | "registry"
      | "standards"
      | "ai_crypto_profiler"
      | "upload_firmware"
  ) => {
    console.log(
      "KavachX navigation:",
      tab
    );

    if (tab === "registry") {
      setAutoOpenUploadModal(false);
      setCurrentView("dashboard");
      return;
    }

    if (tab === "upload_firmware") {
      setAutoOpenUploadModal(true);
      setCurrentView("dashboard");
      return;
    }
  };

  const handleLogin = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    setIsLoggedIn(true);
    setUserEmail(email.trim());

    // Existing CINDER admin convention retained.
    // Admin accounts beginning with "admin@" can access audit history.
    setIsAdmin(normalizedEmail.startsWith("admin@"));

    setCurrentView("landing");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setIsAdmin(false);
    setCurrentView("landing");
    setAutoOpenUploadModal(false);
  };

  return (
    <div
      id="root-layout-wrapper"
      className={`
        min-h-screen
        flex
        flex-col
        font-sans
        transition-all
        selection:bg-yellow-200

        ${
          highContrast
            ? "high-contrast bg-black text-white"
            : lightContrast
            ? "light-contrast-mode bg-white text-black"
            : "bg-[#F4F6F9] text-gray-800"
        }

        ${
          saturation === "mono"
            ? "saturate-mono"
            : saturation === "high"
            ? "saturate-high"
            : ""
        }

        ${invert ? "inverted-mode" : ""}
        ${highlightLinks ? "highlight-links-active" : ""}
        ${hideImages ? "hide-images-active" : ""}
      `}
      style={{
        fontSize: `${textSize}px`,
        letterSpacing:
          textSpacing === "wide"
            ? "0.15em"
            : textSpacing === "widest"
            ? "0.25em"
            : "normal",
        lineHeight:
          lineHeight === "relaxed"
            ? "1.8"
            : lineHeight === "loose"
            ? "2.2"
            : "normal",
      }}
    >
      {currentView === "landing" && (
        <NationalLandingPage
          onSearch={handleLandingSearch}
          onNavigateTab={handleLandingNavigation}
          onToggleContrast={() =>
            setHighContrast(!highContrast)
          }
          highContrast={highContrast}
          onOpenAccessibility={() =>
            setIsAccOpen(!isAccOpen)
          }
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userEmail={userEmail}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onGoToAuditLogs={() =>
            setCurrentView("audit_logs")
          }
        />
      )}

      {currentView === "dashboard" && (
        <OfficialDashboard
          onBackToPortal={() => {
            setCurrentView("landing");
            setAutoOpenUploadModal(false);
          }}
          highContrast={highContrast}
          initialShowUploadModal={autoOpenUploadModal}
        />
      )}

      {currentView === "audit_logs" && (
        <AuditLogsView
          userEmail={userEmail}
          highContrast={highContrast}
          onBackToPortal={() =>
            setCurrentView("landing")
          }
        />
      )}

      <AccessibilityControls
        saturation={saturation}
        setSaturation={setSaturation}
        lightContrast={lightContrast}
        setLightContrast={setLightContrast}
        darkMode={highContrast}
        setDarkMode={setHighContrast}
        invert={invert}
        setInvert={setInvert}
        textSize={textSize}
        setTextSize={setTextSize}
        highlightLinks={highlightLinks}
        setHighlightLinks={setHighlightLinks}
        hideImages={hideImages}
        setHideImages={setHideImages}
        textSpacing={textSpacing}
        setTextSpacing={setTextSpacing}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        onReset={handleResetAccessibility}
        isOpen={isAccOpen}
        setIsOpen={setIsAccOpen}
      />
    </div>
  );
}