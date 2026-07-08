import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, AlertCircle, FileText, Upload, Download, 
  Trash2, ShieldCheck, ArrowRight, CreditCard, LogOut, Check, Info 
} from 'lucide-react';
import { DocumentRecord, DocumentStatus } from '../types';

interface AgentDashboardProps {
  user: any;
  token: string;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export default function AgentDashboard({ user, token, onLogout, onNavigate }: AgentDashboardProps) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeUploadType, setActiveUploadType] = useState<'profile' | 'w2' | null>(null);
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load agent documents
  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Error loading documents:", err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [token]);

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Convert file to Base64 and upload
  const processFile = (file: File) => {
    if (!activeUploadType) return;

    // Validate size (limit to 4MB for safe transport)
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File exceeds 4MB compliance limit. Please upload a smaller document.");
      return;
    }

    setUploadLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            docType: activeUploadType,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: formattedSize,
            fileData: base64Data
          })
        });

        const data = await response.json();

        if (response.ok) {
          await loadDocuments();
          setActiveUploadType(null);
        } else {
          setUploadError(data.error || "Failed to submit document.");
        }
      } catch (err) {
        setUploadError("Network error. Please try uploading again.");
      } finally {
        setUploadLoading(false);
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read file.");
      setUploadLoading(false);
    };
  };

  // Get status of a specific document type
  const getDocStatus = (type: 'profile' | 'w2'): DocumentStatus => {
    const doc = documents.find(d => d.docType === type);
    return doc ? doc.status : 'Pending Upload';
  };

  const getDocRecord = (type: 'profile' | 'w2') => {
    return documents.find(d => d.docType === type);
  };

  // Check overall onboarding state
  const w2Status = getDocStatus('w2');
  const profileStatus = getDocStatus('profile');
  const isW2Approved = w2Status === 'Approved';
  const isProfileApproved = profileStatus === 'Approved';
  const isStripeLinked = user.stripeLinked;

  // Percentage complete
  let progressCount = 0;
  if (w2Status === 'Approved') progressCount += 1;
  else if (w2Status === 'Under Review') progressCount += 0.5;
  
  if (profileStatus === 'Approved') progressCount += 1;
  else if (profileStatus === 'Under Review') progressCount += 0.5;

  if (isStripeLinked) progressCount += 1;

  const progressPercent = Math.round((progressCount / 3) * 100);

  return (
    <div id="agent-view-root" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white font-display font-bold text-xs">
              S
            </div>
            <div>
              <span className="font-display font-semibold text-slate-900 tracking-tight text-sm">SENTINEL PORTAL</span>
              <span className="ml-2 text-[9px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200/60 uppercase">Onboarding Partner</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{user.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{user.email}</span>
            </div>
            <button
              id="agent-logout-btn"
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
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full grow flex flex-col gap-8">
        
        {/* Welcome Section & Progress Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-mono font-semibold px-2 py-0.5 rounded tracking-wider">SECURE FILE ENVELOPE ACTIVE</span>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight mt-2.5">Welcome, {user.name}</h2>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              We require dynamic background and banking authentication prior to active duty. Please upload your filled W-2 form, scan a passport or government ID, and link your Stripe bank account below.
            </p>
          </div>

          <div className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded p-4 shrink-0">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-700">Onboarding Progress</span>
              <span className="font-mono font-bold text-slate-900">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-900 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              Status: <span className="font-bold text-slate-700">{progressPercent === 100 ? 'Ready for Mission Assign' : 'Actions Required'}</span>
            </p>
          </div>
        </div>

        {/* Master Onboarding Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1 & 2: Checklist & Document Management */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 px-1">Required Onboarding Documentation</h3>
            
            {/* PROFILE VERIFICATION STEP */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row justify-between gap-5 transition-all">
              <div className="grow">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isProfileApproved 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : profileStatus === 'Under Review' 
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {isProfileApproved ? <Check className="h-3 w-3 stroke-[3]" /> : <span className="text-[10px] font-mono">1</span>}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Government-Issued ID Verification</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Please submit a clear, color scan of your passport, driver's license, or official state identity card.</p>
                    
                    {/* Uploaded File Pill */}
                    {getDocRecord('profile') && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-[11px] text-slate-600 truncate max-w-[150px] md:max-w-[240px]">
                          {getDocRecord('profile')?.fileName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({getDocRecord('profile')?.fileSize})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions Button */}
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 min-w-[140px] shrink-0 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-[9px] uppercase font-mono font-bold text-slate-400">File Status</div>
                  <div className={`text-xs font-semibold mt-0.5 ${
                    isProfileApproved 
                      ? 'text-emerald-600' 
                      : profileStatus === 'Under Review' 
                      ? 'text-blue-600 font-medium'
                      : profileStatus === 'Rejected'
                      ? 'text-red-600 font-semibold'
                      : 'text-slate-400'
                  }`}>
                    {profileStatus === 'Rejected' ? '❌ Rejected' : profileStatus}
                  </div>
                </div>

                {isProfileApproved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                    Approved
                  </span>
                ) : (
                  <button
                    id="trigger-profile-upload"
                    onClick={() => {
                      setActiveUploadType('profile');
                      setUploadError('');
                    }}
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {profileStatus === 'Pending Upload' ? 'Upload Scan' : 'Re-upload ID'}
                  </button>
                )}
              </div>
            </div>

            {/* W-2 FORM FILING STEP */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row justify-between gap-5 transition-all">
              <div className="grow">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isW2Approved 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : w2Status === 'Under Review' 
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {isW2Approved ? <Check className="h-3 w-3 stroke-[3]" /> : <span className="text-[10px] font-mono">2</span>}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Employment W-2 Form Filing</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Please fill out and submit your official IRS withholding W-2 form with accurate wage classifications.</p>
                    
                    {/* Uploaded File Pill */}
                    {getDocRecord('w2') && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-[11px] text-slate-600 truncate max-w-[150px] md:max-w-[240px]">
                          {getDocRecord('w2')?.fileName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({getDocRecord('w2')?.fileSize})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Actions Button */}
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 min-w-[140px] shrink-0 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-[9px] uppercase font-mono font-bold text-slate-400">File Status</div>
                  <div className={`text-xs font-semibold mt-0.5 ${
                    isW2Approved 
                      ? 'text-emerald-600' 
                      : w2Status === 'Under Review' 
                      ? 'text-blue-600'
                      : w2Status === 'Rejected'
                      ? 'text-red-600 font-semibold'
                      : 'text-slate-400'
                  }`}>
                    {w2Status === 'Rejected' ? '❌ Rejected' : w2Status}
                  </div>
                </div>

                {isW2Approved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
                    Approved
                  </span>
                ) : (
                  <button
                    id="trigger-w2-upload"
                    onClick={() => {
                      setActiveUploadType('w2');
                      setUploadError('');
                    }}
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {w2Status === 'Pending Upload' ? 'Upload W-2' : 'Re-upload W-2'}
                  </button>
                )}
              </div>
            </div>

            {/* DYNAMIC DROPZONE POPUP INTERACTIVE DRAWER */}
            {activeUploadType && (
              <div className="bg-white border border-slate-900 rounded-lg p-6 shadow-md transition-all">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-slate-900 text-white flex items-center justify-center rounded text-[10px] font-bold uppercase">S</div>
                    <span className="font-bold text-xs text-slate-900">
                      Submit document scan for: <span className="text-slate-500 font-mono text-[11px] uppercase">{activeUploadType === 'w2' ? 'W-2 Withholding Form' : 'Government Identity ID'}</span>
                    </span>
                  </div>
                  <button
                    id="cancel-upload-panel"
                    onClick={() => setActiveUploadType(null)}
                    className="text-slate-400 hover:text-slate-800 text-xs font-medium font-mono border border-slate-200 px-2 py-0.5 rounded"
                  >
                    Cancel
                  </button>
                </div>

                {/* Error Banner */}
                {uploadError && (
                  <div className="mb-4 p-3 rounded bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Compliance info note */}
                <div className="mb-4 p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex gap-2">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Your file is processed server-side under AES-256 bank-level encryption. We automatically scan documents for compliance and readability.</span>
                </div>

                {/* Interactive Drag and Drop zone */}
                <div
                  id="drag-and-drop-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors ${
                    isDragging 
                      ? 'border-slate-900 bg-slate-100' 
                      : 'border-slate-200 hover:border-slate-400 bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="application/pdf,image/png,image/jpeg"
                    className="hidden"
                  />

                  {uploadLoading ? (
                    <>
                      <div className="h-8 w-8 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mb-2" />
                      <p className="text-xs font-bold text-slate-700">Analyzing document structure...</p>
                      <p className="text-[10px] text-slate-400 font-mono">Running secure file virus and authenticity heuristics</p>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10 bg-white border border-slate-200 text-slate-500 flex items-center justify-center rounded-full mb-1">
                        <Upload className="h-5 w-5 text-slate-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {isDragging ? "Drop your secure document here" : "Drag & drop document scan here, or click to browse"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Supported formats: PDF, PNG, JPG (Max 4 MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Stripe Connect Banking Direct Deposit Setup */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-6">
            
            {/* Direct Deposit Header */}
            <div>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Payment Gateway</span>
              <h3 className="font-display font-bold text-slate-900 text-lg mt-3">Direct Deposit Setup</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Sentinel uses Stripe Connect to route all agent payroll and assignment disbursements securely to your checking account.
              </p>
            </div>

            {/* Direct Deposit checklist indicator card */}
            <div className={`border rounded p-4 flex items-start gap-3 ${
              isStripeLinked 
                ? 'bg-emerald-50/50 border-emerald-100' 
                : 'bg-slate-50 border-slate-200/60'
            }`}>
              <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                isStripeLinked 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : 'border-slate-300 text-slate-400'
              }`}>
                {isStripeLinked ? <Check className="h-3 w-3 stroke-[3]" /> : <span className="text-[10px] font-mono">3</span>}
              </div>
              
              <div className="grow">
                <h4 className="text-xs font-bold text-slate-800">Bank Account Link</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isStripeLinked 
                    ? 'Your direct deposit parameters have been successfully tokenized and recorded via Stripe Connect.' 
                    : 'Establish routing numbers and link your debit parameters securely.'}
                </p>
              </div>
            </div>

            {/* Stripe Action Controls */}
            <div className="space-y-2 pt-2">
              {isStripeLinked ? (
                <div className="text-center p-3 border border-emerald-100 rounded bg-emerald-50 text-xs text-emerald-800 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Stripe Direct Deposit Active
                </div>
              ) : (
                <>
                  <button
                    id="trigger-stripe-complete"
                    onClick={() => onNavigate('/onboarding-complete')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded transition-all shadow-sm"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Link Bank Account (Stripe Link)
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    id="trigger-stripe-refresh"
                    onClick={() => onNavigate('/onboarding-refresh')}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs py-2 rounded transition-all font-mono text-[10px]"
                  >
                    🔄 Test Stripe Session Refresh
                  </button>
                </>
              )}
            </div>

            {/* Compliance security details */}
            <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-mono leading-relaxed space-y-2">
              <p>🔒 Sentinel is SOC-2 compliant. We use secure endpoints. Your account credentials will not be stored locally.</p>
              <p>🛡️ Need support? Reach out to Victoria Vance (HR Compliance Admin) at Victoria@sentinel.com.</p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/60 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-mono">
        <div>© 2026 Sentinel HR & Compliance. Security level: Agent Confidential.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Privacy Protocols</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
