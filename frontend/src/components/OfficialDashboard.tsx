import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Trash2,
  ShieldAlert,
  BarChart4,
  Zap,
  Loader2,
  FileText,
  Eye,
  Network,
  Activity,
  LockKeyhole,
  Database,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "motion/react";
import LiquidLoadingScreen from "./LiquidLoadingScreen";

type AnalysisStatus = "Pending" | "Analyzing" | "Completed" | "Cancelled";
type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "None";

interface NetworkAnalysisRecord {
  id: string;
  fileName: string;
  fileType: "PCAP" | "PCAPNG" | "CSV";
  size: string;
  uploadedAt: string;
  status: AnalysisStatus;
  riskLevel: RiskLevel;

  sha256?: string;
  analysisId?: string;

  packets?: number;
  flows?: number;
  hosts?: number;
  suspiciousEvents?: number;

  predictedStage?: string;
  confidence?: number;
  leadTime?: string;

  immutable?: boolean;
}

interface OfficialDashboardProps {
  onBackToPortal: () => void;
  highContrast: boolean;
  initialShowUploadModal?: boolean;
}

const RISK_DATA = [
  { name: "Low", value: 28 },
  { name: "Medium", value: 34 },
  { name: "High", value: 24 },
  { name: "Critical", value: 14 },
];

const TRAFFIC_DATA = [
  { time: "00:00", traffic: 32, risk: 18 },
  { time: "04:00", traffic: 48, risk: 21 },
  { time: "08:00", traffic: 72, risk: 35 },
  { time: "12:00", traffic: 66, risk: 42 },
  { time: "16:00", traffic: 84, risk: 57 },
  { time: "20:00", traffic: 61, risk: 48 },
  { time: "24:00", traffic: 76, risk: 63 },
];

const STAGE_DATA = [
  { stage: "Recon", count: 18 },
  { stage: "Access", count: 11 },
  { stage: "Discovery", count: 24 },
  { stage: "Lateral", count: 15 },
  { stage: "C2", count: 9 },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getFileType(fileName: string): "PCAP" | "PCAPNG" | "CSV" | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pcap") return "PCAP";
  if (extension === "pcapng") return "PCAPNG";
  if (extension === "csv") return "CSV";

  return null;
}

function getRiskClasses(
  risk: RiskLevel,
  highContrast: boolean
): string {
  if (highContrast) {
    return "bg-yellow-400/10 text-yellow-300 border-yellow-400/40";
  }

  switch (risk) {
    case "Critical":
      return "bg-red-50 text-red-700 border-red-200";
    case "High":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-200";
  }
}

function getStatusIcon(status: AnalysisStatus) {
  if (status === "Completed") {
    return <CheckCircle2 className="w-4 h-4" />;
  }

  if (status === "Analyzing") {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  if (status === "Cancelled") {
    return <XCircle className="w-4 h-4" />;
  }

  return <Clock className="w-4 h-4" />;
}

export default function OfficialDashboard({
  onBackToPortal,
  highContrast,
  initialShowUploadModal,
}: OfficialDashboardProps) {
  const [analyses, setAnalyses] = useState<NetworkAnalysisRecord[]>([
    {
      id: "NET-2026-041",
      fileName: "enterprise_traffic_01.pcap",
      fileType: "PCAP",
      size: "18.4 MB",
      uploadedAt: "31 Aug 2026, 12:20 AM",
      status: "Completed",
      riskLevel: "High",
      packets: 184230,
      flows: 8421,
      hosts: 127,
      suspiciousEvents: 38,
      predictedStage: "Lateral Movement",
      confidence: 87,
      leadTime: "14 min",
      immutable: true,
    },
    {
      id: "NET-2026-040",
      fileName: "campus_network.csv",
      fileType: "CSV",
      size: "6.8 MB",
      uploadedAt: "30 Aug 2026, 11:42 PM",
      status: "Completed",
      riskLevel: "Medium",
      packets: 92310,
      flows: 4720,
      hosts: 94,
      suspiciousEvents: 17,
      predictedStage: "Discovery",
      confidence: 79,
      leadTime: "21 min",
      immutable: true,
    },
    {
      id: "NET-2026-039",
      fileName: "gateway_capture.pcapng",
      fileType: "PCAPNG",
      size: "31.2 MB",
      uploadedAt: "30 Aug 2026, 10:15 PM",
      status: "Completed",
      riskLevel: "Low",
      packets: 302410,
      flows: 11242,
      hosts: 183,
      suspiciousEvents: 6,
      predictedStage: "Reconnaissance",
      confidence: 72,
      leadTime: "32 min",
      immutable: true,
    },
    {
      id: "NET-2026-038",
      fileName: "branch_traffic.csv",
      fileType: "CSV",
      size: "3.4 MB",
      uploadedAt: "30 Aug 2026, 08:50 PM",
      status: "Pending",
      riskLevel: "None",
      immutable: true,
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(
    initialShowUploadModal || false
  );

  const [activeReport, setActiveReport] =
    useState<NetworkAnalysisRecord | null>(null);

  const [isLiquidLoading, setIsLiquidLoading] = useState(false);
  const [liquidLoadingFile, setLiquidLoadingFile] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const completedCount = analyses.filter(
    (analysis) => analysis.status === "Completed"
  ).length;

  const analyzingCount = analyses.filter(
    (analysis) => analysis.status === "Analyzing"
  ).length;

  const highRiskCount = analyses.filter(
    (analysis) =>
      analysis.riskLevel === "High" ||
      analysis.riskLevel === "Critical"
  ).length;

  const totalPackets = analyses.reduce(
    (sum, analysis) => sum + (analysis.packets || 0),
    0
  );

  const filteredAnalyses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return analyses;

    return analyses.filter((analysis) =>
      [
        analysis.fileName,
        analysis.id,
        analysis.fileType,
        analysis.riskLevel,
        analysis.predictedStage,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [analyses, searchQuery]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    const type = getFileType(file.name);

    if (!type) {
      alert("Only CSV, PCAP and PCAPNG files are allowed.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    const type = getFileType(file.name);

    if (!type) {
      alert("Only CSV, PCAP and PCAPNG files are allowed.");
      return;
    }

    setSelectedFile(file);
  };

  const generateFakeAnalysis = (
    file: File,
    backendData?: any
  ): NetworkAnalysisRecord => {
    const fileType = getFileType(file.name) as
      | "PCAP"
      | "PCAPNG"
      | "CSV";

    const riskOptions: RiskLevel[] = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    const stageOptions = [
      "Reconnaissance",
      "Initial Access",
      "Discovery",
      "Lateral Movement",
      "Command and Control",
    ];

    const risk =
      riskOptions[
        Math.floor(Math.random() * riskOptions.length)
      ];

    const stage =
      stageOptions[
        Math.floor(Math.random() * stageOptions.length)
      ];

    const packets = Math.floor(
      20000 + Math.random() * 450000
    );

    const flows = Math.floor(
      1000 + Math.random() * 18000
    );

    const hosts = Math.floor(
      25 + Math.random() * 250
    );

    const suspiciousEvents = Math.floor(
      3 + Math.random() * 65
    );

    const confidence = Math.floor(
      70 + Math.random() * 28
    );

    const generatedId =
      backendData?.analysis_id ||
      `NET-${new Date().getFullYear()}-${Math.floor(
        100 + Math.random() * 899
      )}`;

    return {
      id: generatedId,
      analysisId: backendData?.analysis_id,
      fileName: file.name,
      fileType,
      size: formatSize(file.size),
      uploadedAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: "Pending",
      riskLevel: "None",
      packets,
      flows,
      hosts,
      suspiciousEvents,
      predictedStage: stage,
      confidence,
      leadTime: `${Math.floor(8 + Math.random() * 35)} min`,
      immutable: true,
    };
  };

  const handleUploadSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a PCAP or CSV file.");
      return;
    }

    setIsUploading(true);

    let backendData: any = null;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

     const response = await fetch("/api/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("kavachx_access_token")}`,
  },
  body: formData,
});

      if (response.ok) {
        backendData = await response.json();
      } else {
        let errorMessage = "Network analysis upload failed.";

        try {
          const errorData = await response.json();
          errorMessage =
            errorData?.detail ||
            errorData?.error ||
            errorMessage;
        } catch {
          // Keep fallback error.
        }

        alert(errorMessage);
        setIsUploading(false);
        return;
      }
       } catch (error) {
      console.error("Upload failed:", error);
      alert("Backend upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    if (!backendData?.analysis_id) {
      alert("Backend did not return an analysis ID.");
      setIsUploading(false);
      return;
    }

       const backendRecord = {
      id: backendData.analysis_id,
      fileName: selectedFile.name,
      status: "Uploaded" as AnalysisStatus,
      riskLevel: "None",
      packets: 0,
      bytes: 0,
    };

    setAnalyses((previous) => [
      backendRecord,
      ...previous,
    ]);

    setShowUploadModal(false);
    setIsUploading(false);

    const fileForLoading = selectedFile.name;

    setSelectedFile(null);

    setLiquidLoadingFile(fileForLoading);
    setIsLiquidLoading(true);

    setTimeout(() => {
      setIsLiquidLoading(false);

      setAnalyses((previous) =>
        previous.map((analysis) =>
          analysis.id === backendData.analysis_id
            ? {
                ...analysis,
                status: "Analyzing",
              }
            : analysis
        )
      );

      setScanningId(backendData.analysis_id);

      setTimeout(() => {
        setAnalyses((previous) =>
          previous.map((analysis) =>
            analysis.id === backendData.analysis_id
              ? {
                  ...analysis,
                  status: "Completed",
                }
              : analysis
          )
        );

        setScanningId(null);

        setActiveReport({
          ...backendRecord,
          status: "Completed" as AnalysisStatus,
        });
      }, 3500);
    }, 2500);
  };

  const runAnalysis = (id: string) => {
    if (scanningId) return;

    const target = analyses.find(
      (analysis) => analysis.id === id
    );

    if (!target) return;

    setScanningId(id);

    setAnalyses((previous) =>
      previous.map((analysis) =>
        analysis.id === id
          ? {
              ...analysis,
              status: "Analyzing",
            }
          : analysis
      )
    );

    setLiquidLoadingFile(target.fileName);
    setIsLiquidLoading(true);

    setTimeout(() => {
      setIsLiquidLoading(false);

      setTimeout(() => {
        setAnalyses((previous) =>
          previous.map((analysis) =>
            analysis.id === id
              ? {
                  ...analysis,
                  status: "Completed",
                  riskLevel:
                    analysis.riskLevel === "None"
                      ? "Medium"
                      : analysis.riskLevel,
                  packets:
                    analysis.packets ||
                    Math.floor(
                      20000 + Math.random() * 450000
                    ),
                  flows:
                    analysis.flows ||
                    Math.floor(
                      1000 + Math.random() * 18000
                    ),
                  hosts:
                    analysis.hosts ||
                    Math.floor(
                      25 + Math.random() * 250
                    ),
                  suspiciousEvents:
                    analysis.suspiciousEvents ||
                    Math.floor(
                      3 + Math.random() * 65
                    ),
                  predictedStage:
                    analysis.predictedStage ||
                    "Discovery",
                  confidence:
                    analysis.confidence || 82,
                  leadTime:
                    analysis.leadTime || "18 min",
                }
              : analysis
          )
        );

        setScanningId(null);

        const latest = analyses.find(
          (analysis) => analysis.id === id
        );

        if (latest) {
          setActiveReport({
            ...latest,
            status: "Completed",
          });
        }
      }, 2500);
    }, 2000);
  };

  const deleteRecord = (id: string) => {
    if (scanningId === id) return;

    const confirmed = window.confirm(
      "Remove this local dashboard record?"
    );

    if (!confirmed) return;

    setAnalyses((previous) =>
      previous.filter((analysis) => analysis.id !== id)
    );
  };

  if (isLiquidLoading) {
    return (
      <LiquidLoadingScreen
        highContrast={highContrast}
        fileName={liquidLoadingFile}
      />
    );
  }

  return (
    <div
      className={`w-full min-h-screen px-4 py-8 md:px-8 font-sans transition-colors ${
        highContrast
          ? "bg-black text-yellow-400"
          : "bg-[#F4F6F9] text-[#1E293B]"
      }`}
      id="dashboard-root"
    >
      {/* HEADER */}
      <div
        className={`w-full flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 mb-8 rounded-2xl ${
          highContrast
            ? "bg-black border border-yellow-400 text-yellow-400"
            : "bg-[#040817] text-[#F8FAFC] border border-white/5 shadow-xl"
        }`}
        id="dashboard-header-container"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToPortal}
            className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
              highContrast
                ? "bg-black border border-yellow-400 hover:bg-yellow-400 hover:text-black"
                : "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
            } cursor-pointer`}
            id="dashboard-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO PORTAL</span>
          </button>

          <div className="border-l pl-4 border-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-blue-400" />

              <div>
                <h1
                  className="text-3xl font-black uppercase tracking-widest font-noto text-white"
                  id="dashboard-main-heading"
                >
                  KAVACHX SOC
                </h1>

                <p
                  className={`text-[10px] uppercase tracking-wider font-semibold ${
                    highContrast
                      ? "text-yellow-300"
                      : "text-[#FF671F]"
                  }`}
                >
                  Network Security Operations Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 lg:mt-0 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <Activity className="w-4 h-4 text-emerald-400" />

            <div>
              <div className="text-[9px] uppercase tracking-widest text-white/40">
                SYSTEM
              </div>

              <div className="text-[11px] font-bold text-emerald-400">
                OPERATIONAL
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className={`flex items-center space-x-2 px-6 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              highContrast
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-[#FF671F] text-white hover:bg-[#e0520b] shadow-lg shadow-orange-500/20"
            }`}
            id="dashboard-upload-trigger-btn"
          >
            <Upload className="w-4 h-4" />
            <span>ANALYSE PCAP / CSV</span>
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div
          className={`rounded-2xl p-5 border ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                Analyses
              </p>

              <p className="text-3xl font-black mt-2">
                {completedCount}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <BarChart4 className="w-6 h-6" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Completed network analyses
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 border ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                HIGH RISK
              </p>

              <p className="text-3xl font-black mt-2">
                {highRiskCount}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            High / critical trajectories
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 border ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                PACKETS
              </p>

              <p className="text-3xl font-black mt-2">
                {totalPackets > 1000000
                  ? `${(totalPackets / 1000000).toFixed(1)}M`
                  : `${Math.round(totalPackets / 1000)}K`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Network className="w-6 h-6" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Network packets processed
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 border ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                ACTIVE JOBS
              </p>

              <p className="text-3xl font-black mt-2">
                {analyzingCount}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-3">
            Current analysis operations
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div
        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6"
        id="dashboard-grid-layout"
      >
        {/* RECENT ANALYSES */}
        <div
          className={`lg:col-span-2 rounded-2xl border overflow-hidden ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
          id="recent-uploads-panel"
        >
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2
                className={`text-sm font-black uppercase tracking-widest ${
                  highContrast
                    ? "text-yellow-400"
                    : "text-slate-900"
                }`}
              >
                RECENT NETWORK ANALYSES
              </h2>

              <p className="text-[10px] text-slate-500 mt-1">
                PCAP / CSV ingestion and threat forecasting history
              </p>
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search analyses..."
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500 w-full md:w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full text-left border-collapse min-w-[850px]"
              id="recent-uploads-table"
            >
              <thead>
                <tr
                  className={`text-[9px] uppercase tracking-widest ${
                    highContrast
                      ? "bg-yellow-400/10 text-yellow-400"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <th className="py-3 px-4">Analysis</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Uploaded</th>
                  <th className="py-3 px-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr
                    key={analysis.id}
                    className={`border-t ${
                      highContrast
                        ? "border-yellow-400/20"
                        : "border-slate-100"
                    } hover:bg-slate-50/50 transition`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            analysis.fileType === "CSV"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {analysis.fileType === "CSV" ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Network className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {analysis.fileName}
                          </p>

                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                            {analysis.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                        {analysis.fileType}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 border px-2 py-1 rounded-md text-[9px] font-black uppercase ${getRiskClasses(
                          analysis.riskLevel,
                          highContrast
                        )}`}
                      >
                        {analysis.riskLevel === "Critical" ||
                        analysis.riskLevel === "High" ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}

                        {analysis.riskLevel}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[9px] font-bold ${
                          analysis.status === "Completed"
                            ? "text-emerald-600"
                            : analysis.status === "Analyzing"
                            ? "text-orange-600"
                            : analysis.status === "Cancelled"
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {getStatusIcon(analysis.status)}
                        {analysis.status}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-[9px] text-slate-500">
                      {analysis.uploadedAt}
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex justify-end gap-2">
                        {analysis.status === "Pending" && (
                          <button
                            onClick={() =>
                              runAnalysis(analysis.id)
                            }
                            disabled={!!scanningId}
                            title="Run Analysis"
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-40"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setActiveReport(analysis)
                          }
                          title="View Analysis"
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            deleteRecord(analysis.id)
                          }
                          disabled={!!scanningId}
                          title="Remove local record"
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAnalyses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-xs text-slate-400"
                    >
                      No network analyses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
            <LockKeyhole className="w-3.5 h-3.5 text-emerald-600" />

            <span className="text-[9px] text-slate-400">
              Analysis records are treated as immutable history
              for the SOC demonstration.
            </span>
          </div>
        </div>

        {/* RISK DISTRIBUTION */}
        <div
          className={`rounded-2xl border p-5 ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="mb-3">
            <h2 className="text-sm font-black uppercase tracking-widest">
              THREAT DISTRIBUTION
            </h2>

            <p className="text-[10px] text-slate-500 mt-1">
              Aggregated forecast risk profile
            </p>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {RISK_DATA.map((entry, index) => (
                    <Cell
                      key={`risk-${index}`}
                      fill={
                        entry.name === "Critical"
                          ? "#dc2626"
                          : entry.name === "High"
                          ? "#f97316"
                          : entry.name === "Medium"
                          ? "#eab308"
                          : "#10b981"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RISK_DATA.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50"
              >
                <span className="text-[9px] font-bold text-slate-500">
                  {item.name}
                </span>

                <span className="text-[10px] font-black">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TRAFFIC TIMELINE */}
        <div
          className={`lg:col-span-2 rounded-2xl border p-5 ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">
                NETWORK TRAFFIC / RISK TIMELINE
              </h2>

              <p className="text-[10px] text-slate-500 mt-1">
                Observed traffic against predicted security risk
              </p>
            </div>

            <Activity className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 9,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 9,
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="traffic"
                  stroke="#2563eb"
                  fill="#dbeafe"
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#f97316"
                  fill="#ffedd5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATT&CK STAGES */}
        <div
          className={`rounded-2xl border p-5 ${
            highContrast
              ? "bg-black border-yellow-400"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest">
              ATT&CK STAGES
            </h2>

            <p className="text-[10px] text-slate-500 mt-1">
              Predicted attack progression
            </p>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STAGE_DATA}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 10,
                }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 9,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="stage"
                  width={65}
                  tick={{
                    fontSize: 8,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#2563eb"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STATUS FOOTER */}
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-3 text-[9px] text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />

          <span>
            KAVACHX NETWORK SECURITY ANALYSIS REGISTRY
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {currentTime.toLocaleDateString("en-IN")}
          </span>

          <span>
            {currentTime.toLocaleTimeString("en-IN")}
          </span>

          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            OFFLINE DEMONSTRATION MODE
          </span>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          id="upload-modal-wrapper"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() =>
              !isUploading && setShowUploadModal(false)
            }
          />

          <div
            className={`relative w-full max-w-xl rounded-2xl shadow-2xl border p-7 ${
              highContrast
                ? "bg-black border-yellow-400 text-yellow-400"
                : "bg-white border-slate-200 text-slate-800"
            }`}
            id="upload-modal-box"
          >
            <div className="w-full h-1.5 flex absolute top-0 left-0 rounded-t-2xl overflow-hidden">
              <span className="flex-1 bg-[#FF671F]" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-[#046A38]" />
            </div>

            <div className="flex items-start justify-between mb-6 pt-1">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wider">
                  Network Traffic Analysis
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Upload recorded network telemetry for KavachX
                  analysis.
                </p>
              </div>

              <button
                onClick={() =>
                  !isUploading &&
                  setShowUploadModal(false)
                }
                className="text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleUploadSubmit}
              className="space-y-5"
              id="upload-dialog-form"
            >
              <label
                htmlFor="network-file-upload"
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={handleDrop}
                className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
                  selectedFile
                    ? "border-blue-400 bg-blue-50/50"
                    : highContrast
                    ? "border-yellow-400/50 hover:bg-yellow-400/5"
                    : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
                id="file-upload-dropzone"
              >
                <input
                  id="network-file-upload"
                  type="file"
                  accept=".pcap,.pcapng,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />

                <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7" />
                </div>

                {selectedFile ? (
                  <>
                    <p className="text-sm font-black">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      {formatSize(selectedFile.size)} •{" "}
                      {getFileType(selectedFile.name)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black">
                      Drop PCAP / PCAPNG / CSV here
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      or click to browse your network capture
                    </p>
                  </>
                )}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Network className="w-4 h-4 text-blue-600 mb-2" />

                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                    INPUT
                  </p>

                  <p className="text-xs font-bold mt-1">
                    Network Traffic
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Activity className="w-4 h-4 text-orange-600 mb-2" />

                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                    ANALYSIS
                  </p>

                  <p className="text-xs font-bold mt-1">
                    Threat Forecast
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <LockKeyhole className="w-4 h-4 text-emerald-600 mb-2" />

                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                    HISTORY
                  </p>

                  <p className="text-xs font-bold mt-1">
                    Immutable Record
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[10px] text-slate-500">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-orange-500" />

                <p>
                  KavachX accepts recorded network telemetry.
                  The demonstration pipeline performs ingestion,
                  analysis, risk estimation and attack-stage
                  forecasting.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    !isUploading &&
                    setShowUploadModal(false)
                  }
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    highContrast
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-[#FF671F] text-white hover:bg-[#e0520b]"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      INGESTING...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      START ANALYSIS
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANALYSIS REPORT MODAL */}
      {activeReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          id="analysis-report-modal"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveReport(null)}
          />

          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-7 ${
              highContrast
                ? "bg-black border-yellow-400 text-yellow-400"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <div className="w-full h-1.5 flex absolute top-0 left-0 rounded-t-2xl overflow-hidden">
              <span className="flex-1 bg-[#FF671F]" />
              <span className="flex-1 bg-white border-b border-slate-100" />
              <span className="flex-1 bg-[#046A38]" />
            </div>

            <div className="flex justify-between items-start pt-1 mb-7">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${getRiskClasses(
                      activeReport.riskLevel,
                      highContrast
                    )}`}
                  >
                    {activeReport.riskLevel} RISK
                  </span>

                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">
                    {activeReport.status}
                  </span>
                </div>

                <h2 className="text-2xl font-black uppercase tracking-wider">
                  Network Analysis Report
                </h2>

                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {activeReport.id}
                </p>
              </div>

              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* FILE */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-black">
                    {activeReport.fileName}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {activeReport.fileType} •{" "}
                    {activeReport.size} •{" "}
                    {activeReport.uploadedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Packets
                </p>

                <p className="text-xl font-black mt-1">
                  {(activeReport.packets || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Flows
                </p>

                <p className="text-xl font-black mt-1">
                  {(activeReport.flows || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Hosts
                </p>

                <p className="text-xl font-black mt-1">
                  {(activeReport.hosts || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Suspicious
                </p>

                <p className="text-xl font-black mt-1 text-orange-600">
                  {activeReport.suspiciousEvents || 0}
                </p>
              </div>
            </div>

            {/* FORECAST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-orange-500" />

                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Predicted Attack Stage
                  </h3>
                </div>

                <p className="text-2xl font-black">
                  {activeReport.predictedStage ||
                    "Discovery"}
                </p>

                <div className="mt-5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 mb-2">
                    <span>MODEL CONFIDENCE</span>

                    <span>
                      {activeReport.confidence || 0}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${
                          activeReport.confidence || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-500" />

                  <h3 className="text-xs font-black uppercase tracking-widest">
                    Forecast Lead Time
                  </h3>
                </div>

                <p className="text-2xl font-black">
                  {activeReport.leadTime || "18 min"}
                </p>

                <p className="text-[10px] text-slate-500 mt-2">
                  Estimated early-warning window before
                  predicted progression.
                </p>
              </div>
            </div>

                {/* TRAJECTORY */}
            <div className="rounded-2xl border border-slate-200 p-5 mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest mb-5">
                ATT&CK TRAJECTORY
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Reconnaissance",
                  "Initial Access",
                  "Discovery",
                  activeReport.predictedStage || "Command & Control",
                ].map((stage, index, stages) => (
                  <React.Fragment key={`${stage}-${index}`}>
                    <div
                      className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase ${
                        stage === activeReport.predictedStage
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {stage}
                    </div>

                    {index < stages.length - 1 && (
                      <span className="text-slate-300">
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* EVIDENCE */}
            <div className="rounded-2xl border border-slate-200 p-5 mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">
                ANALYSIS EVIDENCE
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Network className="w-4 h-4 text-blue-600" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Traffic Behaviour
                    </p>

                    <p className="text-xs font-bold">
                      Multi-host communication observed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Activity className="w-4 h-4 text-orange-600" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Temporal Signal
                    </p>

                    <p className="text-xs font-bold">
                      Suspicious activity increasing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <BarChart4 className="w-4 h-4 text-purple-600" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Flow Features
                    </p>

                    <p className="text-xs font-bold">
                      Port and flow anomalies detected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <LockKeyhole className="w-4 h-4 text-emerald-600" />

                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Record Integrity
                    </p>

                    <p className="text-xs font-bold">
                      Immutable analysis record
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HASH */}
            <div className="p-4 rounded-xl bg-slate-950 text-white">
              <div className="flex items-center gap-2 mb-2">
                <LockKeyhole className="w-4 h-4 text-emerald-400" />

                <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400">
                  RECORD INTEGRITY
                </span>
              </div>

              <p className="text-[9px] text-white/50 mb-1">
                SHA-256
              </p>

              <p className="text-[9px] font-mono break-all text-white/80">
                {activeReport.sha256 ||
                  "Demo record — cryptographic hash generated by backend ingestion pipeline"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setActiveReport(null)}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800"
              >
                CLOSE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
