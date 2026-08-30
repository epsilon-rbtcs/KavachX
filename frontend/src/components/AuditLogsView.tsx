import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  User,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Server,
  FileSpreadsheet,
  RotateCcw,
  CheckCircle,
  Lock,
  Network,
  Activity,
  Database,
  Eye,
} from "lucide-react";

interface AuditLogsViewProps {
  userEmail?: string;
  highContrast: boolean;
  onBackToPortal: () => void;
}

interface AuditLog {
  id: string;
  timestamp: string;
  analystName: string;
  action: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  ipAddress: string;
  details: string;
  fileType?: string;
  riskLevel?: string;
}

const getOrganizationFromEmail = (email: string): string => {
  const lower = (email || "").trim().toLowerCase();

  if (lower.includes("drdo")) return "DRDO";
  if (lower.includes("isro")) return "ISRO";
  if (lower.includes("hal")) return "HAL";
  if (lower.includes("bel")) return "BEL";
  if (lower.includes("meity")) return "MeitY";

  return "NIC";
};

export default function AuditLogsView({
  userEmail = "admin@nic.in",
  highContrast,
  onBackToPortal,
}: AuditLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"LOGS" | "INVENTORY">("LOGS");
  const [generatedCrashKey, setGeneratedCrashKey] = useState<string | null>(
    null
  );

  const userRole = userEmail.toLowerCase().startsWith("admin")
    ? "ADMIN"
    : userEmail.toLowerCase().startsWith("analyst")
      ? "ANALYST"
      : "OFFICER";

  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "log-1",
      timestamp: "2026-08-31 00:14:35",
      analystName: "analyst@nic.in",
      action: "PCAP Analysis Completed",
      status: "SUCCESS",
      ipAddress: "10.45.190.73",
      details:
        "Network traffic capture analysed successfully. Forecast generated from temporal flow and packet telemetry.",
      fileType: "PCAP",
      riskLevel: "HIGH",
    },
    {
      id: "log-2",
      timestamp: "2026-08-31 00:11:22",
      analystName: "analyst@drdo.in",
      action: "CSV Network Analysis",
      status: "SUCCESS",
      ipAddress: "10.45.190.41",
      details:
        "CSV telemetry ingested and processed. Network-state transitions evaluated for future attack progression.",
      fileType: "CSV",
      riskLevel: "MEDIUM",
    },
    {
      id: "log-3",
      timestamp: "2026-08-30 23:58:09",
      analystName: "analyst@isro.in",
      action: "Attack Forecast Generated",
      status: "SUCCESS",
      ipAddress: "10.22.81.16",
      details:
        "K-step forecast generated. Predicted progression indicates elevated Discovery and Lateral Movement probability.",
      fileType: "PCAP",
      riskLevel: "HIGH",
    },
    {
      id: "log-4",
      timestamp: "2026-08-30 23:42:51",
      analystName: "analyst@bel.in",
      action: "Network Traffic Ingestion",
      status: "SUCCESS",
      ipAddress: "10.122.90.18",
      details:
        "Flow-level and packet-level telemetry successfully ingested into the offline analysis pipeline.",
      fileType: "CSV",
      riskLevel: "LOW",
    },
    {
      id: "log-5",
      timestamp: "2026-08-30 22:36:17",
      analystName: "analyst@hal.in",
      action: "Forecast Analysis Failed",
      status: "FAILED",
      ipAddress: "10.122.90.2",
      details:
        "Input validation failed. Network telemetry did not contain the required analysis attributes.",
      fileType: "CSV",
      riskLevel: "UNKNOWN",
    },
    {
      id: "log-6",
      timestamp: "2026-08-30 21:19:44",
      analystName: "analyst@nic.in",
      action: "Admin Audit Access",
      status: "SUCCESS",
      ipAddress: "10.45.190.7",
      details:
        "Administrator accessed the immutable network-security audit history.",
      riskLevel: "INFO",
    },
    {
      id: "log-7",
      timestamp: "2026-08-30 20:54:31",
      analystName: "analyst@drdo.in",
      action: "Attack Stage Mapping",
      status: "SUCCESS",
      ipAddress: "10.45.190.55",
      details:
        "Predicted network behaviour mapped to MITRE ATT&CK attack-stage probabilities.",
      fileType: "PCAP",
      riskLevel: "CRITICAL",
    },
    {
      id: "log-8",
      timestamp: "2026-08-30 19:32:18",
      analystName: "analyst@isro.in",
      action: "Network State Forecast",
      status: "PENDING",
      ipAddress: "10.22.81.33",
      details:
        "Forecast record created and queued for offline model evaluation.",
      fileType: "PCAP",
      riskLevel: "MEDIUM",
    },
  ]);

  const showToast = (message: string, duration = 3000) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), duration);
  };

  const handleResetToken = (log: AuditLog) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      analystName: userEmail,
      action: "Administrative Audit Override",
      status: "SUCCESS",
      ipAddress: log.ipAddress,
      details: `Administrator action recorded against network-security event ${log.id}. Immutable audit entry appended.`,
      riskLevel: "INFO",
    };

    setLogs((prev) => [newLog, ...prev]);

    showToast(
      `Administrative action recorded for network event ${log.ipAddress}`,
      4500
    );
  };

  const handleRefresh = () => {
    showToast("Secure KavachX audit stream refreshed.");
  };

  const exportCsv = () => {
    const headers = [
      "Timestamp",
      "Analyst",
      "Action",
      "Status",
      "IP Address",
      "File Type",
      "Risk Level",
      "Details",
    ];

    const rows = logs.map((log) => [
      log.timestamp,
      log.analystName,
      log.action,
      log.status,
      log.ipAddress,
      log.fileType || "",
      log.riskLevel || "",
      log.details,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
      )].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `KAVACHX_Network_Audit_Logs_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("KavachX audit history exported successfully!");
  };

  const handleGenerateCrashKey = async () => {
    const key = `KX-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}-${Date.now().toString().slice(-4)}`;

    setGeneratedCrashKey(key);
    showToast("Emergency SOC recovery key generated successfully.");
  };

  const filteredLogs = logs.filter((log) => {
    if (
      userRole === "OFFICER" &&
      !log.analystName.toLowerCase().startsWith("analyst") &&
      !log.analystName.toLowerCase().startsWith("citizen")
    ) {
      return false;
    }

    if (userRole !== "ADMIN") {
      const userOrg = getOrganizationFromEmail(userEmail);
      const logOrg = getOrganizationFromEmail(log.analystName);

      if (logOrg !== userOrg) return false;
    }

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      log.analystName.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.ipAddress.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query) ||
      (log.fileType || "").toLowerCase().includes(query) ||
      (log.riskLevel || "").toLowerCase().includes(query);

    if (statusFilter === "ALL") return matchesSearch;

    return matchesSearch && log.status === statusFilter;
  });

  const totalAnalyses = logs.filter(
    (log) =>
      log.action.toLowerCase().includes("analysis") ||
      log.action.toLowerCase().includes("forecast") ||
      log.action.toLowerCase().includes("ingestion")
  ).length;

  const successful = logs.filter((log) => log.status === "SUCCESS").length;

  const highRisk = logs.filter(
    (log) =>
      log.riskLevel === "HIGH" || log.riskLevel === "CRITICAL"
  ).length;

  return (
    <div
      className={`w-full min-h-screen py-8 px-4 md:px-12 ${
        highContrast
          ? "bg-black text-white"
          : "bg-slate-50 text-slate-800"
      }`}
      id="audit-logs-viewport"
    >
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 md:right-12 z-50 py-3.5 px-6 rounded-xl shadow-2xl border text-xs font-bold font-mono tracking-tight flex items-center space-x-3.5 ${
              highContrast
                ? "bg-yellow-400 text-black border-black"
                : "bg-emerald-600 text-white border-emerald-500"
            }`}
            id="audit-log-toast"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div
        className={`w-full rounded-2xl shadow-lg border p-6 md:p-8 mb-8 transition-all flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-400"
            : "bg-[#04081c] border-slate-900 text-white"
        }`}
        id="audit-banner-panel"
      >
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 h-full bg-[#FF671F]" />
          <div className="w-1/3 h-full bg-white" />
          <div className="w-1/3 h-full bg-[#046A38]" />
        </div>

        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              KAVACHX NETWORK SECURITY
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Immutable Security Audit History
          </h1>

          <p
            className={`text-xs font-medium ${
              highContrast
                ? "text-yellow-200/70"
                : "text-slate-300"
            }`}
          >
            Administrative record of PCAP/CSV analysis, network forecasts,
            security events and SOC activity.
          </p>
        </div>

        <div className="mt-5 md:mt-0 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-widest opacity-60">
              ACCESS LEVEL
            </div>

            <div className="text-sm font-black">
              {userRole}
            </div>
          </div>

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              highContrast
                ? "bg-yellow-400 text-black"
                : "bg-white/10"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        id="audit-stats-row"
      >
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Total Security Events
              </p>
              <p className="text-3xl font-black mt-2">{logs.length}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Analyses / Forecasts
              </p>
              <p className="text-3xl font-black mt-2">{totalAnalyses}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Network className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Successful Operations
              </p>
              <p className="text-3xl font-black mt-2">{successful}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Elevated Risk Events
              </p>
              <p className="text-3xl font-black mt-2">{highRisk}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        id="audit-main-container"
      >
        {/* TOOLBAR */}
        <div
          className="p-5 border-b border-slate-200 flex flex-col lg:flex-row justify-between gap-4"
          id="audit-stream-toolbar"
        >
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />

              <h2 className="text-sm font-black uppercase tracking-widest">
                Network Security Audit Stream
              </h2>
            </div>

            <p className="text-[10px] text-slate-400 mt-1">
              Append-only demonstration history for SOC and administrator
              review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs outline-none focus:border-blue-500 w-52"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none py-2 pl-3 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-black uppercase outline-none"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="PENDING">PENDING</option>
              </select>

              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-3 h-3 fill-none stroke-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh Audit Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={exportCsv}
              className="py-2 px-4 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 bg-[#046A38] hover:bg-[#03512b] text-white transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              EXPORT CSV
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="border-b border-slate-200 px-5 flex gap-6">
          <button
            onClick={() => setActiveTab("LOGS")}
            className={`py-3 text-[10px] font-black uppercase tracking-widest border-b-2 ${
              activeTab === "LOGS"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-400"
            }`}
          >
            Audit Events
          </button>

          <button
            onClick={() => setActiveTab("INVENTORY")}
            className={`py-3 text-[10px] font-black uppercase tracking-widest border-b-2 ${
              activeTab === "INVENTORY"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-400"
            }`}
          >
            Security Controls
          </button>
        </div>

        {activeTab === "LOGS" ? (
          <div
            className="w-full overflow-x-auto"
            id="audit-table-scroll-wrapper"
          >
            <table
              className="w-full text-left border-collapse min-w-[1100px]"
              id="audit-stream-table"
            >
              <thead>
                <tr className="border-b text-[10px] font-black uppercase tracking-wider bg-[#0c1432f2] text-white">
                  <th className="py-4 px-5 w-[150px]">
                    TIMESTAMP
                  </th>

                  <th className="py-4 px-5 w-[190px]">
                    ANALYST
                  </th>

                  <th className="py-4 px-5 w-[190px]">
                    SECURITY ACTION
                  </th>

                  <th className="py-4 px-4 w-[100px]">
                    STATUS
                  </th>

                  <th className="py-4 px-5 w-[140px]">
                    IP ADDRESS
                  </th>

                  <th className="py-4 px-5 w-[90px]">
                    INPUT
                  </th>

                  <th className="py-4 px-5 w-[100px]">
                    RISK
                  </th>

                  <th className="py-4 px-5">
                    EVENT DETAILS
                  </th>

                  {userRole === "ADMIN" && (
                    <th className="py-4 px-5 text-center w-[150px]">
                      ADMIN ACTION
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={userRole === "ADMIN" ? 9 : 8}
                      className="py-12 text-center text-slate-500 font-bold text-xs uppercase font-mono"
                    >
                      No matching network-security events found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />

                          <span className="text-[10px] font-mono font-bold text-slate-600">
                            {log.timestamp}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />

                          <div>
                            <div className="text-xs font-bold text-slate-700">
                              {log.analystName}
                            </div>

                            <div className="text-[9px] text-slate-400 uppercase font-black">
                              {getOrganizationFromEmail(log.analystName)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="text-xs font-black text-slate-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${
                            log.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-700"
                              : log.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-mono text-[10px] text-slate-600">
                          {log.ipAddress}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {log.fileType ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-[9px] font-black">
                            <Server className="w-3 h-3" />
                            {log.fileType}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[9px]">
                            SYSTEM
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`text-[9px] font-black uppercase ${
                            log.riskLevel === "CRITICAL"
                              ? "text-red-700"
                              : log.riskLevel === "HIGH"
                                ? "text-orange-600"
                                : log.riskLevel === "MEDIUM"
                                  ? "text-amber-600"
                                  : log.riskLevel === "LOW"
                                    ? "text-emerald-600"
                                    : "text-slate-500"
                          }`}
                        >
                          {log.riskLevel || "—"}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <p className="text-[10px] leading-relaxed text-slate-500 max-w-[420px]">
                          {log.details}
                        </p>
                      </td>

                      {userRole === "ADMIN" && (
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => handleResetToken(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-[9px] font-black uppercase text-slate-600 hover:bg-slate-100 transition"
                            title="Record administrative action"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            RECORD ACTION
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-slate-200 rounded-xl p-5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />

              <h3 className="font-black text-sm">
                Immutable Audit Records
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Security events are represented as append-only history for
                administrator review.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5">
              <Lock className="w-6 h-6 text-blue-600 mb-3" />

              <h3 className="font-black text-sm">
                Role-Based Access
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Analyst and administrator access is separated through the
                portal role model.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5">
              <Eye className="w-6 h-6 text-indigo-600 mb-3" />

              <h3 className="font-black text-sm">
                SOC Visibility
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Review uploaded telemetry, forecast events, risk levels and
                attack-stage analysis history.
              </p>
            </div>
          </div>
        )}

        {/* ADMIN SECURITY PANEL */}
        {userRole === "ADMIN" && (
          <div className="border-t border-slate-200 p-5 bg-slate-50">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-600" />

                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Administrator Security Controls
                  </h3>
                </div>

                <p className="text-[10px] text-slate-500 mt-1">
                  Restricted controls for SOC administrators.
                </p>
              </div>

              <button
                onClick={handleGenerateCrashKey}
                className="px-4 py-2 rounded-lg bg-[#04081c] text-white text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition"
              >
                GENERATE SOC RECOVERY KEY
              </button>
            </div>

            {generatedCrashKey && (
              <div className="mt-4 p-4 rounded-lg bg-white border border-emerald-200">
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                  Recovery Key
                </div>

                <div className="font-mono font-black text-lg mt-1">
                  {generatedCrashKey}
                </div>

                <div className="text-[9px] text-slate-400 mt-1">
                  Demonstration control — do not use as a production secret.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to KavachX Portal
        </button>

        <div className="flex items-center gap-2 text-[9px] text-slate-400 uppercase tracking-widest font-black">
          <ShieldCheck className="w-3.5 h-3.5" />
          KAVACHX • NETWORK SECURITY OPERATIONS
        </div>
      </div>
    </div>
  );
}