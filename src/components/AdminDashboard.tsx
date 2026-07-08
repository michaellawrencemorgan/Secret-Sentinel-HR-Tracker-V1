import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, CheckCircle, Clock, Search, Filter, 
  Download, Eye, LogOut, Check, X, Shield, RefreshCw 
} from 'lucide-react';
import { UserProfile, DocumentRecord } from '../types';

interface AdminDashboardProps {
  user: any;
  token: string;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({ user, token, onLogout, onNavigate }: AdminDashboardProps) {
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Not Started' | 'In Progress' | 'Complete'>('All');
  const [selectedAgent, setSelectedAgent] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const agentsRes = await fetch('/api/agents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const agentsData = await agentsRes.json();
      
      const docsRes = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const docsData = await docsRes.json();

      if (agentsRes.ok && docsRes.ok) {
        setAgents(agentsData.agents || []);
        setDocuments(docsData.documents || []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Update Document Status
  const handleUpdateDocumentStatus = async (docId: string, newStatus: 'Approved' | 'Rejected') => {
    setActionLoading(docId);
    try {
      const response = await fetch('/api/documents/status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ docId, status: newStatus })
      });

      if (response.ok) {
        await loadData();
        // Update selected agent view state in real-time
        if (selectedAgent) {
          const updatedAgentRes = await fetch('/api/agents', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const updatedAgentData = await updatedAgentRes.json();
          if (updatedAgentRes.ok) {
            const freshAgent = (updatedAgentData.agents || []).find((a: any) => a.id === selectedAgent.id);
            if (freshAgent) setSelectedAgent(freshAgent);
          }
        }
      }
    } catch (err) {
      console.error("Error updating document status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter Agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalAgentsCount = agents.length;
  const completeCount = agents.filter(a => a.status === 'Complete').length;
  const inProgressCount = agents.filter(a => a.status === 'In Progress').length;
  const pendingDocsCount = documents.filter(d => d.status === 'Under Review').length;

  return (
    <div id="admin-view-root" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Banner Row */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white font-display font-bold text-xs">
              S
            </div>
            <div>
              <span className="font-display font-semibold text-slate-900 tracking-tight text-sm">SENTINEL HR PORTAL</span>
              <span className="ml-2 text-[9px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200/60 uppercase">Compliance Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
            </div>
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full grow flex flex-col gap-6">
        
        {/* Top Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight">Active Agent Onboarding</h2>
            <p className="text-slate-500 text-xs mt-0.5">Securely track direct deposit status, examine W-2 compliance, and sign off on credentials.</p>
          </div>
          <button
            id="refresh-data-btn"
            onClick={loadData}
            className="self-start md:self-auto inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3 py-1.5 rounded border border-slate-200 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Queue
          </button>
        </div>

        {/* High-Level Metrics Bento-Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded p-4 shadow-sm">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Total Agents Registered</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-display">{totalAgentsCount}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Pending onboarding</div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded p-4 shadow-sm">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Onboarding Completed</span>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-display text-emerald-600">{completeCount}</div>
            <div className="text-[10px] text-emerald-600/70 font-mono mt-1">Ready for assignment</div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded p-4 shadow-sm">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">In Progress</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-display text-amber-600">{inProgressCount}</div>
            <div className="text-[10px] text-amber-600/70 font-mono mt-1">In active onboarding</div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded p-4 shadow-sm">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Pending Review</span>
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-display text-blue-600">{pendingDocsCount}</div>
            <div className="text-[10px] text-blue-600/70 font-mono mt-1">Awaiting verification</div>
          </div>
        </div>

        {/* Search, Filter, and Main Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Middle: Interactive List & Table (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded shadow-sm overflow-hidden flex flex-col">
            
            {/* Filter and Search Bar header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative grow max-w-sm">
                <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 my-auto" />
                <input
                  id="agent-search-input"
                  type="text"
                  placeholder="Search agent name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-slate-900 outline-none rounded text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px] uppercase flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Status:
                </span>
                <div className="flex bg-white border border-slate-200 rounded p-0.5">
                  {(['All', 'Not Started', 'In Progress', 'Complete'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        statusFilter === filter 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Area */}
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-2">
                <LoaderIcon className="h-6 w-6 animate-spin text-slate-600" />
                <span className="text-xs font-mono">Querying compliance database...</span>
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs font-mono">
                No onboarding agents found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider bg-slate-50/50">
                      <th className="px-5 py-3">Agent</th>
                      <th className="px-5 py-3">Register Date</th>
                      <th className="px-5 py-3">Stripe Bank</th>
                      <th className="px-5 py-3">Onboarding Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredAgents.map((agent) => {
                      const isSelected = selectedAgent?.id === agent.id;
                      return (
                        <tr 
                          key={agent.id}
                          onClick={() => setSelectedAgent(agent)}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-slate-100/60' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-800">{agent.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{agent.email}</div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                            {new Date(agent.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5">
                            {agent.stripeLinked ? (
                              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                Linked
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              agent.status === 'Complete'
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                                : agent.status === 'In Progress'
                                ? 'text-amber-700 bg-amber-50 border-amber-100'
                                : 'text-slate-600 bg-slate-100 border-slate-200'
                            }`}>
                              {agent.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`select-agent-btn-${agent.id}`}
                              onClick={() => setSelectedAgent(agent)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
                            >
                              <Eye className="h-3 w-3" /> View files
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Selected Agent Detail & Document Action Control Box */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-5 md:p-6 flex flex-col gap-5">
            {selectedAgent ? (
              <>
                {/* Agent Header card */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Selected Agent</div>
                  <h3 className="font-display font-bold text-slate-900 text-lg mt-1">{selectedAgent.name}</h3>
                  <p className="text-slate-500 text-xs font-mono">{selectedAgent.email}</p>
                  
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      selectedAgent.status === 'Complete'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                        : selectedAgent.status === 'In Progress'
                        ? 'text-amber-700 bg-amber-50 border-amber-100'
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      Overall: {selectedAgent.status}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                      ID: {selectedAgent.id.substring(0, 10)}
                    </span>
                  </div>
                </div>

                {/* Compliance Documents status list */}
                <div>
                  <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold mb-3">Compliance Auditing</h4>
                  
                  {/* Documents Loop */}
                  <div className="space-y-4">
                    {(['profile', 'w2'] as const).map((type) => {
                      const doc = documents.find(d => d.userId === selectedAgent.id && d.docType === type);
                      const title = type === 'w2' ? 'W-2 Form Filing' : 'Government ID Verification';
                      const desc = type === 'w2' ? 'Withholding Certificate' : 'Passport or Government ID';

                      return (
                        <div key={type} className="border border-slate-100 bg-slate-50/50 rounded p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{title}</p>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{desc}</p>
                            </div>
                            
                            {/* Document Status Badge */}
                            {doc ? (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                                doc.status === 'Approved'
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                                  : doc.status === 'Rejected'
                                  ? 'text-red-700 bg-red-50 border-red-100'
                                  : 'text-blue-700 bg-blue-50 border-blue-100'
                              }`}>
                                {doc.status}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase text-slate-400 bg-slate-100 border-slate-200">
                                Missing File
                              </span>
                            )}
                          </div>

                          {doc ? (
                            <div className="bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between text-[11px]">
                              <div className="truncate pr-4">
                                <p className="font-mono text-slate-700 truncate">{doc.fileName}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.fileSize} · {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                              </div>
                              
                              {/* Download Link */}
                              <a
                                href={`/api/documents/download/${doc.id}`}
                                download={doc.fileName}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 p-1.5 rounded border border-slate-200 shrink-0 transition-colors"
                                title="Download Secure Archive"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic">
                              Agent has not yet uploaded this document.
                            </div>
                          )}

                          {/* Approval / Rejection Controls */}
                          {doc && doc.status === 'Under Review' && (
                            <div className="flex gap-2 border-t border-slate-100 pt-3 mt-1">
                              <button
                                id={`approve-doc-${doc.id}`}
                                onClick={() => handleUpdateDocumentStatus(doc.id, 'Approved')}
                                disabled={actionLoading === doc.id}
                                className="grow inline-flex items-center justify-center gap-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white py-1.5 rounded transition-colors disabled:bg-slate-300"
                              >
                                <Check className="h-3 w-3" /> Approve Document
                              </button>
                              <button
                                id={`reject-doc-${doc.id}`}
                                onClick={() => handleUpdateDocumentStatus(doc.id, 'Rejected')}
                                disabled={actionLoading === doc.id}
                                className="inline-flex items-center justify-center text-[10px] font-bold bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Deposit Status verification */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
                  <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">Banking & Payments</h4>
                  
                  <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="font-semibold text-slate-700">Stripe Connect Integration</span>
                    {selectedAgent.stripeLinked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <Check className="h-3 w-3" /> Linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Pending Direct Deposit Setup
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center gap-2">
                <Shield className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-semibold text-slate-800">No Agent Selected</p>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs px-4">
                  Select an onboarding partner from the left ledger queue to inspect their secure compliance dossier, examine identity documents, or sign off on W-2 forms.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/60 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-mono">
        <div>© 2026 Sentinel HR & Compliance. Security level: Administrator.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Privacy Audit</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600">System Diagnostics</a>
        </div>
      </footer>
    </div>
  );
}

// Simple loader helper
function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
