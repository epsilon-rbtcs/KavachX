export type VulnerabilitySeverity = "critical" | "high" | "medium" | "low";

export interface VulnerabilityFinding {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  category: string;
  file: string;
  line?: number;
  codeSnippet?: string;
  remediation: string;
  cve?: string;
}

export interface FirmwareSubmission {
  id: string;
  deviceName: string;
  deviceCategory: string;
  manufacturer: string;
  department: string;
  fileName: string;
  fileSize: number;
  timestamp: string;
  score: number; // 0 (insecure) to 100 (secure)
  findings: VulnerabilityFinding[];
  status: "pending" | "scanning" | "completed" | "failed";
  verificationStatus: "pending" | "approved" | "flagged" | "under_review";
  reviewerNotes?: string;
  verificationCode?: string; // Digital Signature generated upon approval
  sha256: string;
}

export interface PortalStats {
  totalProcessedHex: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  approvedCount: number;
  flaggedCount: number;
}
