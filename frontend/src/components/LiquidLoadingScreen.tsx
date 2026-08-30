import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, RefreshCw, Layers } from "lucide-react";

interface LiquidLoadingScreenProps {
  highContrast: boolean;
  fileName?: string;
}

export default function LiquidLoadingScreen({ highContrast, fileName = "SYS_IMG_v4.2.9.bin" }: LiquidLoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Establishing secured sandbox boundary...",
    "Mounting cryptographically isolated diagnostic channel...",
    "Uploading binary target to pipeline...",
    "Scanning entropy thresholds...",
    "Synthesizing complete security analysis..."
  ];

  useEffect(() => {
    // Progress increment over 5 seconds (5000ms)
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 45); // ~100 steps in 4.5s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle through steps every 1s
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 950);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden ${
        highContrast 
          ? "bg-black text-yellow-400" 
          : "bg-slate-900 text-white"
      }`}
      id="liquid-loader-viewport"
    >
      {/* SVG Liquid Metaballs Filter definition */}
      <svg className="absolute w-0 h-0" id="liquid-svg-filter">
        <defs>
          <filter id="liquid-physics-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="liquid" />
            <feBlend in="SourceGraphic" in2="liquid" />
          </filter>
        </defs>
      </svg>

      {/* Background Liquid blobs container */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 filter"
        style={{ filter: "url(#liquid-physics-filter)" }}
        id="liquid-blobs-layer"
      >
        {/* Giant morphing blob 1 */}
        <motion.div
          animate={{
            x: ["-20%", "30%", "-10%"],
            y: ["-10%", "20%", "-20%"],
            scale: [1, 1.3, 0.9],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF671F] to-amber-500 blur-xs"
        />

        {/* Giant morphing blob 2 */}
        <motion.div
          animate={{
            x: ["40%", "-20%", "20%"],
            y: ["25%", "-15%", "10%"],
            scale: [1.2, 0.8, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#046A38] to-emerald-450 blur-xs"
        />

        {/* Medium morphing blob 3 */}
        <motion.div
          animate={{
            x: ["-30%", "20%", "-10%"],
            y: ["40%", "-10%", "30%"],
            scale: [0.8, 1.2, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 blur-xs"
        />
      </div>

      {/* Central Content Panel Card */}
      <div 
        className={`relative z-10 w-full max-w-lg p-8 rounded-3xl text-center border shadow-2xl backdrop-blur-md ${
          highContrast 
            ? "bg-black border-yellow-400 text-yellow-400" 
            : "bg-slate-950/80 border-slate-800 text-white"
        }`}
        id="liquid-loader-card"
      >
        {/* Tricolor Border Top */}
        <div className="w-full h-1.5 flex absolute top-0 left-0 overflow-hidden rounded-t-3xl" id="loader-tricolor">
          <span className="flex-1 bg-[#FF671F]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#046A38]" />
        </div>

        {/* Orbit spinner with Shield */}
        <div className="flex justify-center mb-6" id="loader-shield-container">
          <div className="relative">
            {/* Spinning decorative orbit rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-slate-650 flex items-center justify-center"
            />
            
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-double border-[#ff5d24]/50"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-[#FF671F] animate-pulse" />
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono tracking-[0.2em] font-extrabold uppercase text-[#FF671F]" id="loader-pre-headline">
          SECURED HANDSHAKE DIAGNOSTICS
        </span>

        <h3 className="text-xl font-black uppercase tracking-wider mt-2 mb-1.5 font-noto" id="loader-main-headline">
          Initializing Sandbox
        </h3>

        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-slate-400 font-bold mb-6" id="loader-filename-label">
          <span>Target File:</span>
          <span className="text-slate-200 bg-slate-850 px-2 py-0.5 rounded border border-slate-800 font-extrabold">
            {fileName}
          </span>
        </div>

        {/* Interactive progress meters */}
        <div className="space-y-4 text-left" id="loader-meters">
          {/* Progress Percent Text */}
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#046A38] font-mono">
              SYSTEM INITIALIZATION
            </span>
            <span className="font-mono text-xl font-black text-white leading-none">
              {percent}%
            </span>
          </div>

          {/* Glowing bar */}
          <div className="w-full h-3 bg-slate-850 rounded-full overflow-hidden border border-slate-850" id="loader-progress-rail">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-[#FF671F] to-[#046A38] rounded-full shadow-lg"
            />
          </div>

          {/* Stepped progress indicators */}
          <div className="h-6 overflow-hidden relative text-center" id="loader-status-ticks">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="text-[11px] text-slate-400 font-medium font-sans italic"
              >
                {steps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
