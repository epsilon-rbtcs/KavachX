import React, { useState } from "react";
import { 
  Accessibility, 
  X, 
  Eye, 
  Contrast, 
  Moon, 
  Droplet, 
  Minus, 
  Plus, 
  Link, 
  ImageOff, 
  Space, 
  AlignJustify, 
  VolumeX,
  Volume2,
  RefreshCw
} from "lucide-react";

interface AccessibilityControlsProps {
  // Saturation: normal, grayscale (mono), hyper-saturated (high)
  saturation: "normal" | "mono" | "high";
  setSaturation: (val: "normal" | "mono" | "high") => void;

  // Light Contrast high-contrast toggle
  lightContrast: boolean;
  setLightContrast: (val: boolean) => void;

  // Dark Mode high-contrast toggle
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;

  // Color invert state 
  invert: boolean;
  setInvert: (val: boolean) => void;

  // Custom text size controllers
  textSize: number;
  setTextSize: (val: number | ((prev: number) => number)) => void;

  // Highlight all hyperlinks 
  highlightLinks: boolean;
  setHighlightLinks: (val: boolean) => void;

  // Hide or display images
  hideImages: boolean;
  setHideImages: (val: boolean) => void;

  // Custom spacing parameters
  textSpacing: "normal" | "wide" | "widest";
  setTextSpacing: (val: "normal" | "wide" | "widest") => void;

  lineHeight: "normal" | "relaxed" | "loose";
  setLineHeight: (val: "normal" | "relaxed" | "loose") => void;

  // Reset defaults function
  onReset: () => void;

  // Controlled visibility state
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function AccessibilityControls({
  saturation,
  setSaturation,
  lightContrast,
  setLightContrast,
  darkMode,
  setDarkMode,
  invert,
  setInvert,
  textSize,
  setTextSize,
  highlightLinks,
  setHighlightLinks,
  hideImages,
  setHideImages,
  textSpacing,
  setTextSpacing,
  lineHeight,
  setLineHeight,
  onReset,
  isOpen,
  setIsOpen
}: AccessibilityControlsProps) {

  // Cycle Saturation state logic
  const handleToggleSaturation = () => {
    if (saturation === "normal") setSaturation("mono");
    else if (saturation === "mono") setSaturation("high");
    else setSaturation("normal");
  };

  // Cycle text spacing state logic
  const handleToggleSpacing = () => {
    if (textSpacing === "normal") setTextSpacing("wide");
    else if (textSpacing === "wide") setTextSpacing("widest");
    else setTextSpacing("normal");
  };

  // Cycle line height state logic
  const handleToggleLineHeight = () => {
    if (lineHeight === "normal") setLineHeight("relaxed");
    else if (lineHeight === "relaxed") setLineHeight("loose");
    else setLineHeight("normal");
  };

  return (
    <>
      {/* Slide-out Sidebar Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end"
          id="acc-modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            id="acc-drawer-container"
          >
            {/* Header section matching precisely the image title and styling */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between" id="acc-header">
              <div className="flex items-center space-x-3">
                <Accessibility className="w-6 h-6 text-[#155e75] acc-control-icon font-bold" />
                <h2 className="text-lg font-black text-gray-800 tracking-tight" id="acc-title">
                  Accessibility Controls
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer active:scale-95"
                id="acc-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner controls layout */}
            <div className="p-6 flex-1 space-y-5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  Accessibility Options
                </span>
                <button
                  onClick={onReset}
                  className="px-4 py-1.5 bg-[#e0f2fe] text-[#0369a1] text-xs font-black uppercase tracking-widest rounded-lg hover:bg-[#bae6fd] hover:text-[#0c4a6e] transition-all cursor-pointer active:scale-95 flex items-center space-x-1"
                  id="acc-reset-button"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 10 Working Control Feature grid (2 Columns) */}
              <div className="grid grid-cols-2 gap-3.5" id="acc-controls-grid">
                
                {/* 1. SATURATION */}
                <button
                  onClick={handleToggleSaturation}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    saturation !== "normal"
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-saturation"
                >
                  <Eye className={`w-6 h-6 ${saturation !== "normal" ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Saturation</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mt-1">
                      {saturation === "normal" ? "Normal" : saturation === "mono" ? "Grayscale" : "High Sat"}
                    </span>
                  </div>
                </button>

                {/* 2. LIGHT CONTRAST */}
                <button
                  onClick={() => {
                    setLightContrast(!lightContrast);
                    if (!lightContrast) {
                      setDarkMode(false);
                    }
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    lightContrast
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-light-contrast"
                >
                  <Contrast className={`w-6 h-6 ${lightContrast ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider font-sans">Light Contrast</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">
                      {lightContrast ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </button>

                {/* 3. DARK MODE */}
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    if (!darkMode) {
                      setLightContrast(false);
                    }
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    darkMode
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-dark-mode"
                >
                  <Moon className={`w-6 h-6 ${darkMode ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Dark Mode</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">
                      {darkMode ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </button>

                {/* 4. INVERT */}
                <button
                  onClick={() => setInvert(!invert)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    invert
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-invert"
                >
                  <Droplet className={`w-6 h-6 ${invert ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Invert</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">
                      {invert ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </button>

                {/* 5. DECREASE TEXT */}
                <button
                  onClick={() => setTextSize((prev) => Math.max(12, prev - 1))}
                  className="p-4 rounded-xl border bg-white border-gray-250 text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95"
                  id="acc-btn-minus-text"
                >
                  <div className="text-lg font-black font-mono text-gray-650 h-6 flex items-center justify-center">A-</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Decrease Text</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mt-1">
                      Size: {textSize}px
                    </span>
                  </div>
                </button>

                {/* 6. INCREASE TEXT */}
                <button
                  onClick={() => setTextSize((prev) => Math.min(24, prev + 1))}
                  className="p-4 rounded-xl border bg-white border-gray-250 text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95"
                  id="acc-btn-plus-text"
                >
                  <div className="text-lg font-black font-mono text-gray-650 h-6 flex items-center justify-center w-full">A+</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Increase Text</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mt-1">
                      Size: {textSize}px
                    </span>
                  </div>
                </button>

                {/* 7. HIGHLIGHT LINKS */}
                <button
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    highlightLinks
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-highlight-links"
                >
                  <Link className={`w-6 h-6 ${highlightLinks ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Highlight Links</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">
                      {highlightLinks ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </button>

                {/* 8. HIDE IMAGES */}
                <button
                  onClick={() => setHideImages(!hideImages)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    hideImages
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-hide-images"
                >
                  <ImageOff className={`w-6 h-6 ${hideImages ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Hide Images</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">
                      {hideImages ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </button>

                {/* 9. TEXT SPACING */}
                <button
                  onClick={handleToggleSpacing}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    textSpacing !== "normal"
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-text-spacing"
                >
                  <Space className={`w-6 h-6 ${textSpacing !== "normal" ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Text Spacing</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mt-1">
                      {textSpacing === "normal" ? "Normal" : textSpacing === "wide" ? "Wide" : "Widest"}
                    </span>
                  </div>
                </button>

                {/* 10. LINE HEIGHT */}
                <button
                  onClick={handleToggleLineHeight}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer active:scale-95 ${
                    lineHeight !== "normal"
                      ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                      : "bg-white border-gray-250 text-gray-600 hover:bg-gray-50"
                  }`}
                  id="acc-btn-line-height"
                >
                  <AlignJustify className={`w-6 h-6 ${lineHeight !== "normal" ? "text-sky-600" : "text-gray-400"}`} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">Line Height</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mt-1">
                      {lineHeight === "normal" ? "Normal" : lineHeight === "relaxed" ? "Relaxed" : "Loose"}
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* No bottom disclaimer info */}
          </div>
        </div>
      )}
    </>
  );
}
