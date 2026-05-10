export interface Pharmacist {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatar: string;
  isOnline: boolean;
  registered: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isFromPharmacist: boolean;
}

export interface ChatSession {
  patientId: string;
  patientName: string;
  pharmacistId: string;
  messages: Message[];
}
