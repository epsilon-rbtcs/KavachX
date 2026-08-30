import React from "react";
import { AlertCircle, Terminal, HelpCircle, ArrowRight, Settings, ShieldAlert, BadgeInfo } from "lucide-react";

interface SecurityRecommendationsViewProps {
  firmware?: any;
  highContrast: boolean;
  isEmptyFile?: boolean;
}

export default function SecurityRecommendationsView({ firmware, highContrast, isEmptyFile = false }: SecurityRecommendationsViewProps) {
  const riskLevel = firmware?.riskLevel || "Critical";
  const isCritical = riskLevel === "Critical";
  const isHigh = riskLevel === "High";
  const isMedium = riskLevel === "Medium";
  const isSafe = riskLevel === "Low";
  
  const scanResults = firmware?.scanResults?.engines || [];
  const staticEngine = scanResults.find((e: any) => e.engine_name === "Static Analysis")?.data;
  const suspiciousCount = staticEngine?.suspicious_string_count || 0;
  
  const severityText = isCritical ? "CRITICAL REMEDIATION" : isHigh ? "HIGH PRIORITY" : isMedium ? "MODERATE PRIORITY" : "LOW RISK";
  const severityColor = isCritical ? "text-red-600" : isHigh ? "text-orange-600" : isMedium ? "text-yellow-600" : "text-emerald-600";
  const severityBg = isCritical ? "bg-red-500" : isHigh ? "bg-orange-500" : isMedium ? "bg-yellow-500" : "bg-emerald-500";
  const severityPing = isCritical ? "bg-red-400" : isHigh ? "bg-orange-400" : isMedium ? "bg-yellow-400" : "bg-emerald-400";
  
  const issueTitle = isCritical ? "Hardcoded Cryptographic Keys Detected" : isHigh ? "Weak Cryptographic Algorithms Identified" : isMedium ? "Elevated Entropy Levels Found" : "No Major Vulnerabilities Detected";
  const issueDesc = isCritical 
    ? `Analysis identified hardcoded AES/RSA keys within the firmware binary and found ${suspiciousCount} suspicious strings. This allows attackers to easily decrypt device communications or firmware updates, compromising the entire device line.` 
    : isHigh ? `Analysis found outdated encryption algorithms (e.g., DES, RC4) and ${suspiciousCount} suspicious strings which can be broken by modern hardware. Replace these immediately with AES-256 or ChaCha20.`
    : isMedium ? `Portions of the binary have elevated entropy, indicating possible packing or obfuscation (alongside ${suspiciousCount} suspicious strings). Verify that this matches your build processes.`
    : `The firmware scan did not detect any known high-risk vulnerabilities, hardcoded keys, or dangerous functions (Suspicious strings: ${suspiciousCount}).`;

  const recommendationsEngine = scanResults.find((e: any) => e.engine_name === "Recommendations")?.data || [];

  return (
    <div
      className={`p-6 md:p-8 rounded-3xl shadow-xl border w-full font-sans transition-all duration-500 hover:shadow-2xl ${highContrast
        ? "bg-black text-yellow-400 border-2 border-yellow-400"
        : "bg-[#F8FAFC] text-slate-800 border-slate-200"
        }`}
      id="security-recommendations-container"
    >
      {/* Header section */}
      <div
        className={`mb-6 p-4 md:p-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8 rounded-t-3xl border-b transition-colors ${highContrast
          ? "bg-black border-yellow-400 text-yellow-400"
          : "bg-[#040817] border-white/10 text-white"
          }`}
        id="rec-header"
      >
        <h2 className={`text-3xl font-extrabold tracking-tight uppercase font-noto animate-fade-in ${highContrast ? "text-yellow-400" : "text-white"}`} id="rec-title">
          Security Recommendations
        </h2>
        <p className={`text-xs font-medium leading-relaxed mt-1 ${highContrast ? "text-yellow-300" : "text-slate-355"}`} id="rec-subtitle">
          Remediation guidance and actionable intelligence based on recent firmware scans.
        </p>
      </div>

      {isEmptyFile || recommendationsEngine.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 mb-8 relative hover:border-slate-300 transition-colors" id="critical-remediation-banner-card">
          <div className="flex flex-col items-center justify-center p-8 text-slate-400">
            <ShieldAlert className="w-12 h-12 mb-4 text-emerald-500" />
            <h3 className="text-lg font-black text-slate-900 leading-snug mb-2">No Vulnerabilities Detected</h3>
            <p className="text-xs font-semibold">The file provided was empty or no remediation actions are required.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendationsEngine.map((rec: any, index: number) => {
            const isCrit = rec.priority === "critical";
            const isHi = rec.priority === "high";
            const isMed = rec.priority === "medium";
            
            const sevText = isCrit ? "CRITICAL REMEDIATION" : isHi ? "HIGH PRIORITY" : isMed ? "MODERATE PRIORITY" : "LOW RISK";
            const sevColor = isCrit ? "text-red-600" : isHi ? "text-orange-600" : isMed ? "text-yellow-600" : "text-emerald-600";
            const sevBg = isCrit ? "bg-red-500" : isHi ? "bg-orange-500" : isMed ? "bg-yellow-500" : "bg-emerald-500";
            const sevPing = isCrit ? "bg-red-400" : isHi ? "bg-orange-400" : isMed ? "bg-yellow-400" : "bg-emerald-400";
            
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 relative hover:border-slate-300 transition-colors" id={`remediation-card-${index}`}>
                {/* Banner metadata row */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                  <div className="flex items-center space-x-1.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      {isCrit && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sevPing} opacity-75`}></span>}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${sevBg}`}></span>
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${sevColor}`}>{sevText}</span>
                  </div>
                  {rec.cwe && (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{rec.cwe}</span>
                  )}
                </div>

                {/* Title & context */}
                <h3 className="text-lg font-black text-slate-900 leading-snug mb-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-5">
                  {rec.detail}
                </p>

                <div className="flex flex-col gap-3 mb-5">
                  <div className={`flex items-start ${isCrit || isHi ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-blue-50 text-blue-800 border-blue-100'} p-3 rounded-lg border text-[11px]`}>
                    <AlertCircle className={`w-4 h-4 shrink-0 mr-2 mt-0.5 ${isCrit || isHi ? 'text-slate-400' : 'text-blue-500'}`} />
                    <span className="font-semibold leading-relaxed">
                      Remediation Action: {isCrit ? "Apply patches and update architecture immediately." : "Schedule mitigation in the next sprint."}
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Ignore Risk
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-black text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                  >
                    Apply Patch Workflow
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}


    </div>
  );
}
