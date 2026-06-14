import React, { useState } from 'react';
import { 
  FileCheck, 
  Download, 
  Server, 
  ShieldCheck, 
  Calculator,
  CalendarDays,
  Percent,
  PlusCircle,
  X,
  Save
} from 'lucide-react';
import { useERPStore } from '../store/useERPStore';

const FiscalModule = () => {
  const { retentions, syncRetentionWithSeniat, addRetention } = useERPStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRetention, setNewRetention] = useState({ client: '', baseAmount: '' });

  const handleAddRetention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetention.client || !newRetention.baseAmount) return;

    addRetention({
      client: newRetention.client,
      baseAmount: parseFloat(newRetention.baseAmount)
    });

    setNewRetention({ client: '', baseAmount: '' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-700/50 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <FileCheck className="h-6 w-6 text-emerald-400 mr-3" />
            Auditoría Fiscal Automatizada
          </h2>
          <p className="text-slate-200 text-sm mt-2 max-w-2xl">
            Oráculo conectado al SENIAT. Cálculo automático de IVA, IGTF e ISLR en tiempo real con 
            generación de comprobantes firmados electrónicamente.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end space-y-3">
          <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 shadow-inner flex items-center">
            <Server className="h-4 w-4 text-emerald-400 mr-2 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">API SENIAT: Online</span>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            {showAddForm ? <X className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            {showAddForm ? 'Cancelar' : 'Ingresar Comprobante Manual'}
          </button>
        </div>
      </div>

      {/* Add Retention Form */}
      {showAddForm && (
        <form onSubmit={handleAddRetention} className="mb-8 relative z-10 bg-slate-900/80 border border-emerald-500/30 p-6 rounded-xl animate-in slide-in-from-top-4 fade-in">
          <h3 className="text-slate-100 font-medium mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-emerald-400" />
            Cálculo Rápido de Retención (Manual)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-200 uppercase tracking-wider mb-1">Cliente / Proveedor</label>
              <input 
                type="text" 
                required
                value={newRetention.client}
                onChange={e => setNewRetention({...newRetention, client: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="Razón Social"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-200 uppercase tracking-wider mb-1">Monto Base Factura (USD)</label>
              <input 
                type="number" 
                required
                value={newRetention.baseAmount}
                onChange={e => setNewRetention({...newRetention, baseAmount: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                placeholder="Ej. 5000"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-xs text-slate-300 flex items-center">
              <Percent className="h-4 w-4 mr-1 text-slate-200" />
              El sistema calculará automáticamente 8% IVA y 3% IGTF según Gaceta.
            </div>
            <button type="submit" className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
              <Save className="h-4 w-4 mr-2" />
              Calcular y Añadir a Cola
            </button>
          </div>
        </form>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-purple-500/10 rounded-lg mr-4">
            <Calculator className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Total Retenido (Hoy)</p>
            <p className="text-lg font-bold text-slate-200">
              ${retentions.reduce((acc, curr) => acc + curr.ivaRetained + curr.igtfRetained, 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
            <Percent className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Tasa IGTF Activa</p>
            <p className="text-lg font-bold text-slate-200">3.00%</p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-emerald-500/10 rounded-lg mr-4">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Riesgo de Multa</p>
            <p className="text-lg font-bold text-emerald-400">0.0% (Auditable)</p>
          </div>
        </div>
      </div>

      {/* Retentions Table/List */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/80">
          <h3 className="font-medium text-slate-100">Últimos Comprobantes de Retención</h3>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {retentions.map(retention => (
            <div key={retention.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-800/30 transition-colors">
              
              {/* Data info */}
              <div className="flex-1 w-full flex items-start mb-4 md:mb-0">
                <CalendarDays className="h-5 w-5 text-slate-300 mr-4 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100">{retention.client}</h4>
                  <div className="flex items-center text-xs text-slate-200 mt-1 space-x-3">
                    <span>{retention.id}</span>
                    <span>•</span>
                    <span>{retention.date}</span>
                    <span>•</span>
                    <span className="text-slate-300">Base: ${retention.baseAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>

              {/* Tax Amounts */}
              <div className="w-full md:w-auto flex justify-between md:justify-center md:space-x-8 px-4 mb-4 md:mb-0">
                <div className="text-right md:text-left">
                  <p className="text-xs text-slate-300 uppercase">Ret. IVA</p>
                  <p className="text-sm font-bold text-slate-200">${retention.ivaRetained.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <div className="text-right md:text-left">
                  <p className="text-xs text-slate-300 uppercase">IGTF</p>
                  <p className="text-sm font-bold text-slate-200">${retention.igtfRetained.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="w-full md:w-64 flex flex-col items-end justify-center space-y-2">
                {retention.status === 'synced' ? (
                  <>
                    <div className="flex items-center text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                      Sincronizado ({retention.seniatCode})
                    </div>
                    <button className="flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Download className="h-3 w-3 mr-1" />
                      PDF Firmado
                    </button>
                  </>
                ) : retention.status === 'syncing' ? (
                  <div className="flex items-center text-blue-400 text-xs font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    <Server className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Enviando a SENIAT...
                  </div>
                ) : (
                  <button 
                    onClick={() => syncRetentionWithSeniat(retention.id)}
                    className="flex items-center text-slate-300 text-xs font-medium bg-slate-700 hover:bg-slate-600 px-4 py-1.5 rounded-full border border-slate-600 transition-colors"
                  >
                    Declarar Ahora
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FiscalModule;
