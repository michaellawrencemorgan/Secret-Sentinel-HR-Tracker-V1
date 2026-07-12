export type UserRole = 'admin' | 'agent';

export type OnboardingStatus = 'Not Started' | 'In Progress' | 'Complete';

export type DocumentStatus = 'Pending Upload' | 'Under Review' | 'Approved' | 'Rejected';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: OnboardingStatus;
  stripeLinked: boolean;
  createdAt: string;
  rating: number;
  notes: string;
  agentSpecializations: string[];
  verifiedCredentials: string[];
  phone?: string;
  active: boolean;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  docType: 'w2' | 'profile';
  fileName: string;
  fileType: string;
  status: DocumentStatus;
  uploadedAt: string;
  fileSize?: string;
}

export interface OnboardingState {
  user: UserProfile | null;
  agents: UserProfile[];
  documents: DocumentRecord[];
}
