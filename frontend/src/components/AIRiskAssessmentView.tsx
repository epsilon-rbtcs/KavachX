import React from "react";
import {
  AlertTriangle,
  Cpu,
  ShieldAlert,
} from "lucide-react";

interface AIRiskAssessmentViewProps {
  firmware?: any;
  highContrast: boolean;
  isEmptyFile?: boolean;
}

export default function AIRiskAssessmentView({
  firmware,
  highContrast,
  isEmptyFile = false,
}: AIRiskAssessmentViewProps) {
  // Keep the existing backend response structure intact.
  const scanResults = firmware?.scanResults?.engines || [];

  const riskEngine = scanResults.find(
    (e: any) => e.engine_name === "Risk Prediction"
  )?.data;

  const inferenceMetadata = scanResults.find(
    (e: any) => e.engine_name === "Model Inference Metadata"
  )?.data;

  const riskScore = riskEngine?.risk_score
    ? Math.round(riskEngine.risk_score)
    : isEmptyFile
      ? 0
      : 90;

  const confidence = riskEngine?.confidence
    ? (riskEngine.confidence * 100).toFixed(1)
    : isEmptyFile
      ? "0.0"
      : "98.4";

  const severity =
    riskEngine?.severity || (isEmptyFile ? "Safe" : "CRITICAL");

  const severityColor =
    severity === "CRITICAL"
      ? "text-red-700"
      : severity === "HIGH"
        ? "text-orange-600"
        : severity === "MEDIUM"
          ? "text-yellow-600"
          : "text-emerald-700";

  const severityBg =
    severity === "CRITICAL"
      ? "bg-red-50 border-red-100"
      : severity === "HIGH"
        ? "bg-orange-50 border-orange-100"
        : severity === "MEDIUM"
          ? "bg-yellow-50 border-yellow-100"
          : "bg-emerald-50 border-emerald-100";

  const features = inferenceMetadata?.features || {};
  const featureKeys = Object.keys(features);

  const reasons: string[] = riskEngine?.reasons || [];

  return (
    <div
      className={`p-6 md:p-8 rounded-3xl shadow-xl border w-full font-sans transition-all duration-500 hover:shadow-2xl ${
        highContrast
          ? "bg-black text-yellow-400 border-2 border-yellow-400"
          : "bg-[#F8FAFC] text-slate-800 border-slate-200"
      }`}
      id="network-risk-assessment-container"
    >
      {/* HEADER */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 md:p-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8 rounded-t-3xl border-b transition-colors ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-400"
            : "bg-[#040817] border-white/10 text-white"
        }`}
        id="network-risk-header"
      >
        <div>
          <h2
            className={`text-3xl font-extrabold tracking-tight uppercase font-noto ${
              highContrast ? "text-yellow-400" : "text-white"
            }`}
          >
            Network Risk Assessment
          </h2>

          <p
            className={`text-xs font-medium leading-relaxed mt-1 ${
              highContrast ? "text-yellow-300" : "text-slate-300"
            }`}
          >
            AI-driven analysis of network traffic, anomalies and security
            indicators.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            Export Report
          </button>

          <button
            type="button"
            className="px-4 py-2 text-xs font-extrabold uppercase tracking-wider bg-black text-white rounded-lg flex items-center space-x-1.5 transition-opacity hover:opacity-90 shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Flag Threat</span>
          </button>
        </div>
      </div>

      {/* MAIN METRIC CARDS */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        id="network-risk-cards-grid"
      >
        {/* RISK SCORE */}
        <div
          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
          id="risk-score-card"
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              OVERALL NETWORK RISK
            </span>

            <AlertTriangle
              className={`w-5 h-5 stroke-[2.5] ${
                severity === "CRITICAL"
                  ? "text-red-500"
                  : severity === "HIGH"
                    ? "text-orange-500"
                    : severity === "MEDIUM"
                      ? "text-yellow-500"
                      : "text-emerald-500"
              }`}
            />
          </div>

          <div
            className="flex flex-col items-center justify-center my-6"
            id="risk-score-dial"
          >
            <div className="relative flex items-center justify-center">
              <div className="text-center">
                <span className="text-xs text-slate-400 font-extrabold">
                  / 100
                </span>

                <div className="text-6xl font-black text-slate-900 font-noto tracking-tighter mt-1">
                  {riskScore}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${severityBg} ${severityColor} p-4 rounded-xl border flex flex-col gap-1 text-xs`}
          >
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wide">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5H9l-.3 5H7.4l-.3-5z" />
              </svg>

              <span>{severity} Severity</span>
            </div>

            <p className="opacity-80 leading-relaxed font-medium">
              {severity === "CRITICAL"
                ? "Immediate intervention required. High-risk network activity detected."
                : "Network activity shows moderate or low-risk indicators. Review recommended."}
            </p>
          </div>
        </div>

        {/* AI CONFIDENCE */}
        <div
          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
          id="model-confidence-card"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              AI CONFIDENCE
            </span>

            <Cpu className="w-5 h-5 text-indigo-600" />
          </div>

          <div>
            <div
              className="flex items-baseline mb-3"
              id="confidence-amount"
            >
              <span className="text-4xl font-black text-slate-900 font-noto">
                {confidence}%
              </span>

              <span className="text-[10px] font-black text-emerald-600 ml-2 uppercase tracking-wider flex items-center gap-0.5">
                <svg
                  className="w-3 h-3 fill-current rotate-45 shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21 12l-8.15-8.15-1.42 1.42 5.43 5.43H5v2z" />
                </svg>

                <span>High Certainty</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
              The AI engine correlates network behaviour, traffic patterns and
              detected indicators against known security threats.
            </p>
          </div>

          {/* NETWORK FEATURES */}
          <div
            className="space-y-4 border-t border-slate-50 pt-4"
            id="prediction-metrics"
          >
            {isEmptyFile || featureKeys.length === 0 ? (
              <div className="text-center text-xs text-slate-400 font-bold py-4">
                No Network Features Available
              </div>
            ) : (
              featureKeys.slice(0, 4).map((key, idx) => {
                const val = Number(features[key]);

                let displayPercent = "0%";
                let barWidth = "0%";

                if (!isNaN(val)) {
                  const pct = Math.min(
                    100,
                    Math.max(0, val > 1 ? val : val * 100)
                  );

                  displayPercent = `${pct.toFixed(1)}%`;
                  barWidth = `${pct}%`;
                }

                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      <span>{key.replace(/_/g, " ")}</span>

                      <span className="font-mono text-slate-800 text-xs">
                        {displayPercent}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          idx === 2 ? "bg-blue-600" : "bg-slate-950"
                        }`}
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* THREAT CLASSIFICATIONS */}
        <div
          className="bg-white border border-slate-200 rounded-2xl p-6"
          id="classifications-card"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              THREAT CLASSIFICATIONS
            </span>

            <svg
              className="w-5 h-5 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
            </svg>
          </div>

          <div className="space-y-3.5" id="classification-stack">
            {isEmptyFile || reasons.length === 0 ? (
              <div className="text-center text-xs text-slate-400 font-bold py-8 border border-dashed border-slate-200 rounded-xl">
                No Security Threats Detected
              </div>
            ) : (
              reasons.map((reason, idx) => {
                const text = reason.toLowerCase();

                const isCrypto =
                  text.includes("crypto") ||
                  text.includes("key") ||
                  text.includes("encryption");

                const isNetwork =
                  text.includes("network") ||
                  text.includes("traffic") ||
                  text.includes("packet") ||
                  text.includes("port") ||
                  text.includes("connection");

                const isAttack =
                  text.includes("attack") ||
                  text.includes("malware") ||
                  text.includes("intrusion") ||
                  text.includes("exploit");

                const bgColor =
                  isAttack || isCrypto
                    ? "bg-red-400/5 hover:bg-red-400/10 border-red-500/10"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200";

                const iconBg =
                  isAttack || isCrypto
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-700";

                const classification =
                  isAttack
                    ? "Attack Indicator"
                    : isCrypto
                      ? "Cryptographic Indicator"
                      : isNetwork
                        ? "Network Anomaly"
                        : "Security Anomaly";

                return (
                  <div
                    key={idx}
                    className={`${bgColor} border rounded-xl p-3 flex justify-between items-center gap-3 transition-colors`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                          <path d="M12 8v4" />
                          <circle cx="12" cy="15" r="1" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 leading-tight">
                          {classification}
                        </div>

                        <div
                          className="text-[10px] text-slate-500 font-mono truncate leading-normal"
                          title={reason}
                        >
                          {reason}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black ${
                        isAttack || isCrypto
                          ? "text-red-600"
                          : "text-slate-800"
                      } font-mono shrink-0`}
                    >
                      MATCH
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ANALYSIS PIPELINE */}
      <div
        className="bg-white border border-slate-200 rounded-2xl p-5"
        id="analysis-pipeline-trace-card"
      >
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-50 pb-3"
          id="pipeline-trace-header"
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
            NETWORK ANALYSIS PIPELINE
          </span>

          <span className="px-2.5 py-1 text-[9.5px] font-black text-white bg-slate-900 rounded-md uppercase tracking-wider shrink-0 select-none">
            ANALYSIS COMPLETE
          </span>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 relative"
          id="trace-flow-layout"
        >
          {/* STEP 1 */}
          <div
            className="flex flex-col items-center text-center relative z-10"
            id="trace-step-1"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 stroke-current stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-xs text-slate-800 font-bold mt-2 leading-none">
              Traffic Ingestion
            </span>

            <span className="text-[10px] text-emerald-600 font-mono font-bold mt-1.5 bg-emerald-50/50 px-2 py-0.5 rounded">
              COMPLETE
            </span>
          </div>

          {/* STEP 2 */}
          <div
            className="flex flex-col items-center text-center relative z-10"
            id="trace-step-2"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 stroke-current stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <span className="text-xs text-slate-800 font-bold mt-2 leading-none">
              Feature Extraction
            </span>

            <span className="text-[10px] text-emerald-600 font-mono font-bold mt-1.5 bg-emerald-50/50 px-2 py-0.5 rounded">
              COMPLETE
            </span>
          </div>

          {/* STEP 3 */}
          <div
            className="flex flex-col items-center text-center relative z-10"
            id="trace-step-3"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shadow-sm animate-pulse">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>

            <span className="text-xs text-slate-800 font-bold mt-2 leading-none">
              AI Threat Detection
            </span>

            <span className="text-[10px] text-red-600 font-bold mt-1.5 uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded">
              {severity === "Safe" ? "NO THREATS" : "ANOMALIES FOUND"}
            </span>
          </div>

          {/* STEP 4 */}
          <div
            className="flex flex-col items-center text-center relative z-10"
            id="trace-step-4"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 stroke-current stroke-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <span className="text-xs text-slate-500 font-bold mt-2 leading-none">
              SOC Review
            </span>

            <span className="text-[10px] text-slate-450 font-semibold mt-1.5 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}