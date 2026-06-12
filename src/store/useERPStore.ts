import { create } from 'zustand';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:3000`;
const API_URL = `${backendUrl}/api`;

interface Director {
  id: number;
  name: string;
  role: string;
  token: string;
  powerLevel: string;
  status: 'active' | 'revoked';
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  risk: string;
  status: 'pending' | 'processing' | 'liquidated';
}

interface Retention {
  id: string;
  date: string;
  client: string;
  baseAmount: number;
  ivaRetained: number;
  igtfRetained: number;
  status: 'pending' | 'syncing' | 'synced';
  seniatCode: string | null;
}

interface ChequeData {
  beneficiary: string;
  concept: string;
  amount: string;
}

interface ERPState {
  availableLiquidity: number;
  fetchLiquidity: () => Promise<void>;
  
  directors: Director[];
  fetchDirectors: () => Promise<void>;
  toggleDirectorStatus: (id: number) => Promise<void>;
  addDirector: (director: Omit<Director, 'id' | 'token' | 'status'>) => Promise<void>;
  deleteDirector: (id: number) => Promise<void>;
  
  invoices: Invoice[];
  fetchInvoices: () => Promise<void>;
  liquidateInvoice: (id: string) => Promise<void>;
  
  retentions: Retention[];
  fetchRetentions: () => Promise<void>;
  syncRetentionWithSeniat: (id: string) => Promise<void>;
  addRetention: (retention: Omit<Retention, 'id' | 'date' | 'ivaRetained' | 'igtfRetained' | 'status' | 'seniatCode'>) => Promise<void>;
  
  chequeData: ChequeData;
  setChequeData: (data: Partial<ChequeData>) => void;
  addFiscalTransactionFromTesoreria: (amount: number, client: string) => Promise<void>;
}

export const useERPStore = create<ERPState>((set, get) => ({
  availableLiquidity: 145000,
  fetchLiquidity: async () => {
    try {
      const res = await axios.get(`${API_URL}/liquidity`);
      if (res.data) set({ availableLiquidity: res.data.amount });
    } catch (error) { console.error(error); }
  },

  directors: [],
  fetchDirectors: async () => {
    try {
      const res = await axios.get(`${API_URL}/directors`);
      set({ directors: res.data });
    } catch (error) { console.error(error); }
  },
  toggleDirectorStatus: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/directors/${id}/toggle`);
      set(state => ({
        directors: state.directors.map(d => d.id === id ? response.data : d)
      }));
    } catch (error) {
      console.error("Error toggling director status", error);
    }
  },
  deleteDirector: async (id) => {
    try {
      await axios.delete(`${API_URL}/directors/${id}`);
      set(state => ({
        directors: state.directors.filter(d => d.id !== id)
      }));
    } catch (error) {
      console.error("Error deleting director", error);
    }
  },
  addDirector: async (newDir) => {
    try {
      const hashStr = Math.random().toString(16).substr(2, 4).toUpperCase();
      const hashStr2 = Math.random().toString(16).substr(2, 4).toUpperCase();
      await axios.post(`${API_URL}/directors`, {
        ...newDir,
        token: `0x${hashStr}...${hashStr2}`
      });
      await get().fetchDirectors();
    } catch (error) { console.error(error); }
  },

  invoices: [],
  fetchInvoices: async () => {
    try {
      const res = await axios.get(`${API_URL}/invoices`);
      set({ invoices: res.data });
    } catch (error) { console.error(error); }
  },
  liquidateInvoice: async (id) => {
    // UI optimistic
    set((state) => ({
      invoices: state.invoices.map(inv => 
        inv.id === id ? { ...inv, status: 'processing' } : inv
      )
    }));

    setTimeout(async () => {
      try {
        await axios.post(`${API_URL}/invoices/${id}/liquidate`);
        await get().fetchInvoices();
        await get().fetchLiquidity();
      } catch (error) { console.error(error); }
    }, 2000);
  },

  retentions: [],
  fetchRetentions: async () => {
    try {
      const res = await axios.get(`${API_URL}/retentions`);
      set({ retentions: res.data });
    } catch (error) { console.error(error); }
  },
  syncRetentionWithSeniat: async (id) => {
    set((state) => ({
      retentions: state.retentions.map(r => 
        r.id === id ? { ...r, status: 'syncing' } : r
      )
    }));
    setTimeout(async () => {
      try {
        await axios.put(`${API_URL}/retentions/${id}/sync`, {
          seniatCode: `SEN-2026-X${Math.floor(Math.random()*1000)}`
        });
        await get().fetchRetentions();
      } catch (error) { console.error(error); }
    }, 1500);
  },
  addRetention: async (newRet) => {
    try {
      const date = new Date().toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' });
      const id = `RET-009${Math.floor(Math.random() * 1000)}`;
      await axios.post(`${API_URL}/retentions`, {
        id,
        date,
        client: newRet.client,
        baseAmount: newRet.baseAmount,
        ivaRetained: newRet.baseAmount * 0.08,
        igtfRetained: newRet.baseAmount * 0.03
      });
      await get().fetchRetentions();
    } catch (error) { console.error(error); }
  },

  chequeData: {
    beneficiary: 'INVERSIONES ALFA C.A.',
    concept: 'Despacho Fertilizantes Lote #45',
    amount: '45200.00'
  },
  setChequeData: (data) => set((state) => ({
    chequeData: { ...state.chequeData, ...data }
  })),
  addFiscalTransactionFromTesoreria: async (amount, client) => {
    try {
      await axios.put(`${API_URL}/liquidity/subtract`, { amount });
      await get().addRetention({ client, baseAmount: amount });
      await get().fetchLiquidity();
    } catch (error) { console.error(error); }
  }
}));
