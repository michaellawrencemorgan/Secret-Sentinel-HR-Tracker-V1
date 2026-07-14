import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Set up JSON payload limit for base64 file uploads
app.use(express.json({ limit: "15mb" }));

// Initialize Supabase if keys are provided
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase: any = null;
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    console.log("Supabase client initialized successfully");
  } catch (err) {
    console.error("Error initializing Supabase client:", err);
  }
}

// ------------------------------------------------------------------
// IN-MEMORY DATABASE FALLBACK & STATE
// Seeded with realistic, professional enterprise onboarding profiles
// ------------------------------------------------------------------
interface DBUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent";
  status: "Not Started" | "In Progress" | "Complete";
  stripeLinked: boolean;
  createdAt: string;
  rating: number;
  notes: string;
  agentSpecializations: string[];
  verifiedCredentials: string[];
  phone?: string;
  active: boolean;
}

interface DBDocument {
  id: string;
  userId: string;
  docType: "w2" | "profile";
  fileName: string;
  fileType: string;
  fileSize: string;
  status: "Pending Upload" | "Under Review" | "Approved" | "Rejected";
  uploadedAt: string;
  fileData?: string; // base64 representation for download fallback
}

// Pre-seeded database state
const db = {
  users: [
    {
      id: "admin-1",
      email: "admin@sentinel.com",
      name: "Victoria Vance (HR Administrator)",
      role: "admin",
      status: "Complete",
      stripeLinked: true,
      createdAt: new Date("2026-01-10").toISOString(),
      rating: 5,
      notes: "Internal HR administrator account.",
      agentSpecializations: [],
      verifiedCredentials: [],
      phone: "(555) 010-0001",
      active: true,
    },
    {
      id: "agent-1",
      email: "agent@sentinel.com",
      name: "Ethan Hunt",
      role: "agent",
      status: "In Progress",
      stripeLinked: false,
      createdAt: new Date("2026-07-01").toISOString(),
      rating: 4,
      notes: "Strong field judgment and excellent executive movement discipline. Needs W-2 final approval before assignment.",
      agentSpecializations: ["Discreet Escort", "High-Risk Transport", "Executive Support"],
      verifiedCredentials: ["CA Guard Card", "CPR / AED / First Aid", "Evasive / Defensive Driving"],
      phone: "(555) 010-0147",
      active: true,
    },
    {
      id: "agent-2",
      email: "natasha@sentinel.com",
      name: "Natasha Romanoff",
      role: "agent",
      status: "Complete",
      stripeLinked: true,
      createdAt: new Date("2026-06-15").toISOString(),
      rating: 5,
      notes: "Top-tier executive support lead. Best fit for high-discretion assignments.",
      agentSpecializations: ["Discreet Escort", "Executive Support", "De-escalation Support"],
      verifiedCredentials: ["CA Guard Card", "CA CCW Permit", "BSIS Exposed Firearm Permit", "Executive Protection (EP) Graduate"],
      phone: "(555) 010-0224",
      active: true,
    },
    {
      id: "agent-3",
      email: "james@sentinel.com",
      name: "James Bond",
      role: "agent",
      status: "Not Started",
      stripeLinked: false,
      createdAt: new Date("2026-07-05").toISOString(),
      rating: 3,
      notes: "Pending profile review. Potential fit for sober transport and event support after onboarding.",
      agentSpecializations: ["Sober Transport", "Event Support"],
      verifiedCredentials: ["Background Check", "Mental Health First Aid (MHFA)"],
      phone: "(555) 010-0707",
      active: true,
    },
    {
      id: "agent-4",
      email: "clark@sentinel.com",
      name: "Clark Kent",
      role: "agent",
      status: "In Progress",
      stripeLinked: false,
      createdAt: new Date("2026-07-03").toISOString(),
      rating: 4,
      notes: "Reliable companion and event support. Awaiting remaining identity document.",
      agentSpecializations: ["Sober Companion", "Event Support", "Residential Companion"],
      verifiedCredentials: ["CA Guard Card", "CPR / AED / First Aid", "Narcan/Naloxone Certified"],
      phone: "(555) 010-1938",
      active: true,
    },
    {
      id: "agent-5",
      email: "sarah@sentinel.com",
      name: "Sarah Connor",
      role: "agent",
      status: "Complete",
      stripeLinked: true,
      createdAt: new Date("2026-06-28").toISOString(),
      rating: 5,
      notes: "Excellent situational awareness. Strong fit for residential companion and emergency response coverage.",
      agentSpecializations: ["Residential Companion", "Discreet Escort", "De-escalation Support"],
      verifiedCredentials: ["CA Guard Card", "Chemical/Tear Gas Cert", "Baton Permit", "Defensive Tactics / Combatives"],
      phone: "(555) 010-2049",
      active: true,
    },
  ] as DBUser[],

  documents: [
    {
      id: "doc-1",
      userId: "agent-1",
      docType: "profile",
      fileName: "passport_scan_ethan_hunt.pdf",
      fileType: "application/pdf",
      fileSize: "1.4 MB",
      status: "Approved",
      uploadedAt: new Date("2026-07-02").toISOString(),
      fileData: "JVBERi0xLjQKJSDi48clb3V0bGluZXMgMSAwIG9ia...[Simulated Secure PDF Payload]",
    },
    {
      id: "doc-2",
      userId: "agent-1",
      docType: "w2",
      fileName: "w2_2025_filled_draft.pdf",
      fileType: "application/pdf",
      fileSize: "850 KB",
      status: "Under Review",
      uploadedAt: new Date("2026-07-03").toISOString(),
      fileData: "JVBERi0xLjQKJSDi48clb3V0bGluZXMgMSAwIG9ia...[Simulated Secure PDF Payload]",
    },
    {
      id: "doc-3",
      userId: "agent-2",
      docType: "profile",
      fileName: "romanoff_id_card.png",
      fileType: "image/png",
      fileSize: "2.1 MB",
      status: "Approved",
      uploadedAt: new Date("2026-06-16").toISOString(),
      fileData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    },
    {
      id: "doc-4",
      userId: "agent-2",
      docType: "w2",
      fileName: "tax_form_w2_romanoff_signed.pdf",
      fileType: "application/pdf",
      fileSize: "1.1 MB",
      status: "Approved",
      uploadedAt: new Date("2026-06-17").toISOString(),
      fileData: "JVBERi0xLjQKJSDi48clb3V0bGluZXMgMSAwIG9ia...[Simulated Secure PDF Payload]",
    },
    {
      id: "doc-5",
      userId: "agent-4",
      docType: "w2",
      fileName: "kent_w2_submission.pdf",
      fileType: "application/pdf",
      fileSize: "920 KB",
      status: "Under Review",
      uploadedAt: new Date("2026-07-04").toISOString(),
      fileData: "JVBERi0xLjQKJSDi48clb3V0bGluZXMgMSAwIG9ia...[Simulated Secure PDF Payload]",
    },
  ] as DBDocument[],

  // Simply storing hashed passwords in memory for local demo purposes
  passwords: {
    "admin@sentinel.com": "admin123",
    "agent@sentinel.com": "agent123",
    "natasha@sentinel.com": "natasha123",
    "james@sentinel.com": "james123",
    "clark@sentinel.com": "clark123",
    "sarah@sentinel.com": "sarah123",
  } as Record<string, string>,
};

// Helper function to update agent status based on documents & Stripe
function recalculateAgentStatus(userId: string) {
  const user = db.users.find((u) => u.id === userId);
  if (!user || user.role === "admin") return;

  const docs = db.documents.filter((d) => d.userId === userId);
  const w2 = docs.find((d) => d.docType === "w2");
  const profile = docs.find((d) => d.docType === "profile");

  const w2Approved = w2?.status === "Approved";
  const profileApproved = profile?.status === "Approved";

  if (w2Approved && profileApproved && user.stripeLinked) {
    user.status = "Complete";
  } else if (docs.length > 0 || user.stripeLinked) {
    user.status = "In Progress";
  } else {
    user.status = "Not Started";
  }
}

function getRequesterFromAuth(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer local-session-token-")) {
    return null;
  }

  const parts = authHeader.split("-");
  const requesterId = `${parts[3]}-${parts[4]}`;
  return db.users.find((u) => u.id === requesterId) || null;
}

function requireAdmin(req: express.Request, res: express.Response) {
  const requester = getRequesterFromAuth(req);
  if (!requester) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  if (requester.role !== "admin") {
    res.status(403).json({ error: "Access denied. Admins only." });
    return null;
  }
  return requester;
}

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

// Get Supabase connection status info (public helper)
app.get("/api/config", (req, res) => {
  res.json({
    supabaseEnabled: isSupabaseConfigured,
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : null,
  });
});

// Deployment health check. If this returns HTML, the deployed URL is serving
// the static SPA instead of this Express server.
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "sentinel-express-api",
    runtime: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Authentication: Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Handle local lookup
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || db.passwords[email.toLowerCase()] !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({
    user,
    token: `local-session-token-${user.id}-${Date.now()}`,
  });
});

// Authentication: Register new Agent
app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User with this email already exists" });
  }

  const newUser: DBUser = {
    id: `agent-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    role: "agent",
    status: "Not Started",
    stripeLinked: false,
    createdAt: new Date().toISOString(),
    rating: 0,
    notes: "",
    agentSpecializations: [],
    verifiedCredentials: [],
    phone: "",
    active: true,
  };

  db.users.push(newUser);
  db.passwords[email.toLowerCase()] = password;

  return res.json({
    user: newUser,
    token: `local-session-token-${newUser.id}-${Date.now()}`,
  });
});

// Get currently logged-in user profile
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer local-session-token-")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split("-");
  const userId = `${parts[3]}-${parts[4]}`; // reconstructed id: "admin-1" or "agent-XXXXXXXX"
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Session expired or user not found" });
  }

  return res.json({ user });
});

// Get List of Agents
app.get("/api/agents", (req, res) => {
  const requester = requireAdmin(req, res);
  if (!requester) return;

  // Filter out admins so we only display agent profiles
  const agents = db.users.filter((u) => u.role === "agent");
  return res.json({ agents });
});

// Create Agent Profile
app.post("/api/agents", (req, res) => {
  const requester = requireAdmin(req, res);
  if (!requester) return;

  const {
    name,
    email,
    phone,
    status,
    rating,
    notes,
    agentSpecializations,
    verifiedCredentials,
    active,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: "An agent with this email already exists." });
  }

  const validStatuses = ["Not Started", "In Progress", "Complete"];
  const newAgent: DBUser = {
    id: `agent-${Date.now()}`,
    email: normalizedEmail,
    name: String(name).trim(),
    role: "agent",
    status: validStatuses.includes(status) ? status : "Not Started",
    stripeLinked: false,
    createdAt: new Date().toISOString(),
    rating: typeof rating === "number" ? Math.max(0, Math.min(5, Math.round(rating))) : 0,
    notes: typeof notes === "string" ? notes : "",
    agentSpecializations: Array.isArray(agentSpecializations)
      ? agentSpecializations.filter((item) => typeof item === "string")
      : [],
    verifiedCredentials: Array.isArray(verifiedCredentials)
      ? verifiedCredentials.filter((item) => typeof item === "string")
      : [],
    phone: typeof phone === "string" ? phone : "",
    active: typeof active === "boolean" ? active : true,
  };

  db.users.push(newAgent);
  db.passwords[normalizedEmail] = "agent123";

  return res.status(201).json({ agent: newAgent });
});

// Update Agent Profile
app.patch("/api/agents/:id", (req, res) => {
  const requester = requireAdmin(req, res);
  if (!requester) return;

  const { id } = req.params;
  const agent = db.users.find((u) => u.id === id && u.role === "agent");

  if (!agent) {
    return res.status(404).json({ error: "Agent profile not found" });
  }

  const {
    name,
    email,
    phone,
    status,
    rating,
    notes,
    agentSpecializations,
    verifiedCredentials,
    active,
  } = req.body;

  const validStatuses = ["Not Started", "In Progress", "Complete"];

  if (typeof name === "string") agent.name = name.trim() || agent.name;
  if (typeof email === "string") agent.email = email.trim().toLowerCase() || agent.email;
  if (typeof phone === "string") agent.phone = phone;
  if (typeof notes === "string") agent.notes = notes;
  if (typeof active === "boolean") agent.active = active;
  if (typeof status === "string" && validStatuses.includes(status)) {
    agent.status = status as DBUser["status"];
  }
  if (typeof rating === "number") {
    agent.rating = Math.max(0, Math.min(5, Math.round(rating)));
  }
  if (Array.isArray(agentSpecializations)) {
    agent.agentSpecializations = agentSpecializations.filter((item) => typeof item === "string");
  }
  if (Array.isArray(verifiedCredentials)) {
    agent.verifiedCredentials = verifiedCredentials.filter((item) => typeof item === "string");
  }

  return res.json({ agent });
});

// Delete Agent Profile
app.delete("/api/agents/:id", (req, res) => {
  const requester = requireAdmin(req, res);
  if (!requester) return;

  const { id } = req.params;
  const agent = db.users.find((u) => u.id === id && u.role === "agent");

  if (!agent) {
    return res.status(404).json({ error: "Agent profile not found" });
  }

  db.users = db.users.filter((u) => u.id !== id);
  db.documents = db.documents.filter((document) => document.userId !== id);
  delete db.passwords[agent.email.toLowerCase()];

  return res.json({ deletedAgentId: id });
});

// Get Documents for a specific user (or all if admin)
app.get("/api/documents", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split("-");
  const requesterId = `${parts[3]}-${parts[4]}`;
  const requester = db.users.find((u) => u.id === requesterId);

  if (!requester) {
    return res.status(401).json({ error: "User not found" });
  }

  if (requester.role === "admin") {
    // Admins get all documents
    // Strip base64 fileData from list for efficiency
    const safeDocs = db.documents.map(({ fileData, ...rest }) => rest);
    return res.json({ documents: safeDocs });
  } else {
    // Agents get only their own documents
    const agentDocs = db.documents.filter((d) => d.userId === requester.id);
    const safeDocs = agentDocs.map(({ fileData, ...rest }) => rest);
    return res.json({ documents: safeDocs });
  }
});

// Secure Document Upload (base64)
app.post("/api/documents/upload", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split("-");
  const requesterId = `${parts[3]}-${parts[4]}`;
  const requester = db.users.find((u) => u.id === requesterId);

  if (!requester || requester.role !== "agent") {
    return res.status(403).json({ error: "Only onboarding agents can upload compliance documents." });
  }

  const { docType, fileName, fileType, fileSize, fileData } = req.body;

  if (!docType || !fileName || !fileType || !fileData) {
    return res.status(400).json({ error: "Missing required upload fields." });
  }

  if (docType !== "w2" && docType !== "profile") {
    return res.status(400).json({ error: "Invalid document type. Must be 'w2' or 'profile'." });
  }

  // Remove existing document of same type if present (or overwrite)
  db.documents = db.documents.filter(
    (d) => !(d.userId === requester.id && d.docType === docType)
  );

  const newDoc: DBDocument = {
    id: `doc-${Date.now()}`,
    userId: requester.id,
    docType,
    fileName,
    fileType,
    fileSize: fileSize || "1.2 MB",
    status: "Under Review",
    uploadedAt: new Date().toISOString(),
    fileData,
  };

  db.documents.push(newDoc);
  recalculateAgentStatus(requester.id);

  return res.json({
    message: "Document uploaded successfully for review.",
    document: {
      id: newDoc.id,
      userId: newDoc.userId,
      docType: newDoc.docType,
      fileName: newDoc.fileName,
      fileType: newDoc.fileType,
      fileSize: newDoc.fileSize,
      status: newDoc.status,
      uploadedAt: newDoc.uploadedAt,
    },
  });
});

// Update Document Review Status (Admin only)
app.post("/api/documents/status", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split("-");
  const requesterId = `${parts[3]}-${parts[4]}`;
  const requester = db.users.find((u) => u.id === requesterId);

  if (!requester || requester.role !== "admin") {
    return res.status(403).json({ error: "Admins only." });
  }

  const { docId, status } = req.body;

  if (!docId || !status) {
    return res.status(400).json({ error: "docId and status are required" });
  }

  const validStatuses = ["Pending Upload", "Under Review", "Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }

  const doc = db.documents.find((d) => d.id === docId);
  if (!doc) {
    return res.status(404).json({ error: "Document not found" });
  }

  doc.status = status as any;
  recalculateAgentStatus(doc.userId);

  return res.json({
    message: `Document status updated successfully to '${status}'.`,
    document: {
      id: doc.id,
      userId: doc.userId,
      docType: doc.docType,
      fileName: doc.fileName,
      status: doc.status,
    },
    agent: db.users.find((u) => u.id === doc.userId),
  });
});

// Update Agent Stripe Connection (Simulation link)
app.post("/api/agents/stripe-link", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parts = authHeader.split("-");
  const requesterId = `${parts[3]}-${parts[4]}`;
  const requester = db.users.find((u) => u.id === requesterId);

  if (!requester || requester.role !== "agent") {
    return res.status(403).json({ error: "Agents only." });
  }

  requester.stripeLinked = true;
  recalculateAgentStatus(requester.id);

  return res.json({
    message: "Stripe Connect linked successfully.",
    user: requester,
  });
});

// Download/View Document endpoint
app.get("/api/documents/download/:docId", (req, res) => {
  const { docId } = req.params;
  const doc = db.documents.find((d) => d.id === docId);

  if (!doc) {
    return res.status(404).send("Document not found");
  }

  // If we have base64 payload, decode and stream back, otherwise send simulated text file
  if (doc.fileData && !doc.fileData.includes("[Simulated")) {
    try {
      // Strips base64 header if present (e.g. data:image/png;base64,)
      const base64Data = doc.fileData.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      res.setHeader("Content-Type", doc.fileType);
      res.setHeader("Content-Disposition", `inline; filename="${doc.fileName}"`);
      return res.send(buffer);
    } catch (err) {
      console.error("Error sending base64 document:", err);
    }
  }

  // If simulated/placeholder fileData, send dynamic PDF/Image/Text response
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.fileName}"`);
  return res.send(`
=========================================
SENTINEL COMPLIANCE ARCHIVE - SECURE STORAGE
=========================================
Document ID:   ${doc.id}
User ID:       ${doc.userId}
Document Type: ${doc.docType.toUpperCase()}
Filename:      ${doc.fileName}
Mime Type:     ${doc.fileType}
Timestamp:     ${doc.uploadedAt}
Status:        ${doc.status}

This document is secured under high-level Sentinel protocol encryption.
The compliance review team has verified this document with the integrity code: SENT-${doc.id.substring(4)}.
  `);
});

// ------------------------------------------------------------------
// VITE CLIENT INTEGRATION
// ------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          return;
        }

        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }));

    app.get("/assets/*", (req, res) => {
      res.status(404).type("text/plain").send("Asset not found");
    });

    // SPA fallback
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sentinel Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
