import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, RefreshCw, Layers, ShieldCheck, Download, Loader2 } from "lucide-react";
import CryptoAnalysisView from "./CryptoAnalysisView";
import AIRiskAssessmentView from "./AIRiskAssessmentView";
import SecurityRecommendationsView from "./SecurityRecommendationsView";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface DiagnosticAnalysisReportProps {
  fileName?: string;
  firmware?: any; // To receive the firmware record with dynamic riskLevel
  onBackToDashboard: () => void;
  highContrast: boolean;
  isEmptyFile?: boolean;
}

export default function DiagnosticAnalysisReport({ 
  fileName = "SYS_IMG_v4.2.9.bin", 
  firmware,
  onBackToDashboard, 
  highContrast,
  isEmptyFile = false
}: DiagnosticAnalysisReportProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Stagger configurations for our beautiful "filling format"
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18, // Stagger delays to make panels "fill-in" one after another
      }
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.99 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15 
      } 
    }
  };

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById("diagnostic-report-viewport");
    if (!reportElement) return;

    setIsGeneratingPdf(true);
    try {
      // Find element and temporarily hide navigation action bars for high aesthetic output
      const backBtn = document.getElementById("report-back-to-dashboard-btn");
      const batchActions = document.getElementById("report-batch-actions");
      const exportBtn = document.getElementById("ai-risk-export");
      const quarantineBtn = document.getElementById("ai-risk-quarantine");

      const originalBackBtnDisplay = backBtn ? backBtn.style.display : "";
      const originalBatchActionsDisplay = batchActions ? batchActions.style.display : "";
      const originalExportDisplay = exportBtn ? exportBtn.style.display : "";
      const originalQuarantineDisplay = quarantineBtn ? quarantineBtn.style.display : "";

      if (backBtn) backBtn.style.display = "none";
      if (batchActions) batchActions.style.display = "none";
      if (exportBtn) exportBtn.style.display = "none";
      if (quarantineBtn) quarantineBtn.style.display = "none";

      // Render viewport with html2canvas (high resolution render scale: 2)
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: highContrast ? "#000000" : "#F1F5F9",
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          // Replace oklch(...) inside all <style> tags of clonedDoc with standard hsl/hsla to prevent parsing error
          const styleTags = clonedDoc.getElementsByTagName("style");
          for (let i = 0; i < styleTags.length; i++) {
            const style = styleTags[i];
            try {
              let cssText = style.innerHTML;
              if (cssText.includes("oklch")) {
                cssText = cssText.replace(/oklch\(([^)]+)\)/g, (match, content) => {
                  try {
                    const parts = content.trim().split(/\s+/);
                    const cleanParts = parts.filter((p: string) => p !== "/");
                    if (cleanParts.length < 3) return "rgb(128,128,128)";

                    const lVal = cleanParts[0];
                    let l = parseFloat(lVal) || 0;
                    if (lVal.includes("%")) {
                      l = parseFloat(lVal) / 100;
                    }
                    const c = parseFloat(cleanParts[1]) || 0;
                    const h = parseFloat(cleanParts[2]) || 0;

                    let alpha = 1;
                    const alphaPart = content.split("/");
                    if (alphaPart.length > 1) {
                      alpha = parseFloat(alphaPart[1].trim()) || 1;
                    }

                    // Convert C (Chroma) to Saturation percent (approximate max chroma is 0.4)
                    const s = Math.min(100, Math.round((c / 0.4) * 100));
                    const lPercent = Math.min(100, Math.round(l * 100));

                    if (alpha < 1) {
                      return `hsla(${Math.round(h)}, ${s}%, ${lPercent}%, ${alpha})`;
                    }
                    return `hsl(${Math.round(h)}, ${s}%, ${lPercent}%)`;
                  } catch (e) {
                    return "rgb(128, 128, 128)";
                  }
                });
                style.innerHTML = cssText;
              }
            } catch (err) {
              console.warn("Failed to rewrite style tag with oklch replacement:", err);
            }
          }
        }
      });

      // Restore elements visually on completion
      if (backBtn) backBtn.style.display = originalBackBtnDisplay;
      if (batchActions) batchActions.style.display = originalBatchActionsDisplay;
      if (exportBtn) exportBtn.style.display = originalExportDisplay;
      if (quarantineBtn) quarantineBtn.style.display = originalQuarantineDisplay;

      const imgWidth = 210; // A4 layout width in mm
      const pageHeight = 297; // A4 layout height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const doc = new jsPDF("p", "mm", "a4");
      let position = 0;

      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const cleanFileName = fileName.replace(/[^a-zA-Z0-9_\.-]/g, "_");
      doc.save(`Firmware_Compliance_Report_${cleanFileName}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF document:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8 font-sans bg-[#F1F5F9]" id="diagnostic-report-viewport">
      {/* Upper Navigation Bar */}
      <div 
        className={`w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 mb-8 rounded-2xl border ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-400"
            : "bg-slate-900 border-slate-800 text-white shadow-xl"
        }`}
        id="report-navigation-box"
      >
        <div className="flex items-center space-x-3.5">
          <button 
            type="button"
            onClick={onBackToDashboard}
            className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all border ${
              highContrast
                ? "border-yellow-400 hover:bg-yellow-400 hover:text-black bg-black"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-350 hover:text-white"
            } cursor-pointer`}
            id="report-back-to-dashboard-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Report</span>
          </button>
          
          <div className="border-l pl-4 border-slate-700/60">
            <h1 className="text-xl font-black uppercase tracking-wider font-noto flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF671F]" />
              <span>Inspection Handshake Report</span>
            </h1>
            <p className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
              highContrast ? "text-yellow-300" : "text-[#FF671F]"
            }`}>
              COMPLETED IN 5.00s
            </p>
          </div>
        </div>

        {/* Action icons right header */}
        <div className="flex items-center gap-3 mt-4 sm:mt-0" id="report-batch-actions">
          <span className="text-[10px] uppercase font-mono bg-slate-800 border border-slate-700/50 px-2.5 py-1 text-slate-400 rounded-md">
            PID: {Math.floor(Math.random() * 90000 + 10000)}
          </span>
          <button 
            type="button"
            onClick={() => {
              if (firmware?.scanResults?.job_id) {
                window.open(`/api/analyst/engine/scan/${firmware.scanResults.job_id}/report/csv`, "_blank");
              } else {
                alert("Scan data not available on backend yet. Please run a scan first.");
              }
            }}
            className={`p-2 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer select-none font-bold uppercase tracking-wider text-[10px] border ${
              highContrast
                ? "bg-black border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                : "bg-white/5 border-white/10 text-sky-400 hover:text-white hover:bg-white/10"
            }`}
            title="Download CSV Summary"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button 
            type="button"
            onClick={() => {
              if (firmware?.scanResults?.job_id) {
                window.open(`/api/analyst/engine/scan/${firmware.scanResults.job_id}/report/pdf`, "_blank");
              } else {
                handleDownloadPdf(); // Fallback to UI PDF generation
              }
            }}
            disabled={isGeneratingPdf}
            className={`p-2 rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer select-none font-bold uppercase tracking-wider text-[10px] border ${
              isGeneratingPdf 
                ? "opacity-60 bg-white/10 border-white/25 cursor-not-allowed text-white" 
                : highContrast
                  ? "bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-500"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
            title="Download PDF Report"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FF671F]" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container of the stacked staggered views */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full space-y-8" 
        id="dynamic-staggered-panels"
      >
        <motion.div variants={panelVariants} id="staggered-panel-crypto">
          <CryptoAnalysisView fileName={fileName} firmware={firmware} highContrast={highContrast} isEmptyFile={isEmptyFile} />
        </motion.div>

        <motion.div variants={panelVariants} id="staggered-panel-risk">
          <AIRiskAssessmentView firmware={firmware} highContrast={highContrast} isEmptyFile={isEmptyFile} />
        </motion.div>

        <motion.div variants={panelVariants} id="staggered-panel-security">
          <SecurityRecommendationsView firmware={firmware} highContrast={highContrast} isEmptyFile={isEmptyFile} />
        </motion.div>
      </motion.div>
    </div>
  );
}
