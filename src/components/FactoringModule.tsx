import { 
  Building2, 
  ArrowRightLeft, 
  TrendingUp, 
  Wallet,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useERPStore } from '../store/useERPStore';

const FactoringModule = () => {
  const { invoices, availableLiquidity, liquidateInvoice } = useERPStore();

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-700/50 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <TrendingUp className="h-6 w-6 text-emerald-400 mr-3" />
            Bolsa de Factoring (Cesión de Créditos)
          </h2>
          <p className="text-slate-200 text-sm mt-2 max-w-2xl">
            Transforma cuentas por cobrar en flujo de caja inmediato. Empaquetamiento de deuda 
            mediante Smart Contracts transfiriendo el riesgo a fondos de liquidez corporativa.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="bg-slate-900/80 px-5 py-3 rounded-xl border border-slate-700 shadow-inner flex flex-col items-end">
            <span className="text-xs text-slate-200 uppercase tracking-wider">Flujo de Caja Disponible</span>
            <div className="flex items-center mt-1">
              <Wallet className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-emerald-400">
                ${availableLiquidity.toLocaleString('en-US', {minimumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Cuentas por Cobrar Totales</p>
            <p className="text-lg font-bold text-slate-200">
              ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-indigo-500/10 rounded-lg mr-4">
            <ArrowRightLeft className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Facturas Cedidas (Mes)</p>
            <p className="text-lg font-bold text-slate-200">
              {invoices.filter(i => i.status === 'liquidated').length} Procesadas
            </p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center">
          <div className="p-3 bg-emerald-500/10 rounded-lg mr-4">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-300 uppercase font-semibold">Rendimiento Pool</p>
            <p className="text-lg font-bold text-emerald-400">+12.4% APY</p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="font-medium text-slate-100">Cartera de Facturas Pendientes</h3>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {invoices.map(invoice => (
            <div key={invoice.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-800/30 transition-colors">
              
              <div className="flex-1 w-full flex items-start mb-4 md:mb-0">
                <div className={`p-2 rounded-lg mr-4 mt-1 ${invoice.status === 'liquidated' ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                  <FileText className={`h-5 w-5 ${invoice.status === 'liquidated' ? 'text-emerald-400' : 'text-slate-200'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100">{invoice.client}</h4>
                  <div className="flex items-center text-xs text-slate-200 mt-1 space-x-3">
                    <span>{invoice.id}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-400">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {invoice.dueDate}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{invoice.risk}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col items-end mb-4 md:mb-0 md:mr-8 text-right">
                <p className="text-xl font-bold text-emerald-400">${invoice.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-300 uppercase mt-1">Valor Nominal</p>
              </div>

              <div className="w-full md:w-48 flex justify-end">
                {invoice.status === 'liquidated' ? (
                  <div className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-500/10 px-4 py-2 rounded-lg w-full justify-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Liquidez Acreditada
                  </div>
                ) : invoice.status === 'processing' ? (
                  <div className="flex items-center text-blue-400 text-sm font-medium bg-blue-500/10 px-4 py-2 rounded-lg w-full justify-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Negociando...
                  </div>
                ) : (
                  <button 
                    onClick={() => liquidateInvoice(invoice.id)}
                    className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 text-sm font-medium"
                  >
                    Ceder y Liquidar
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

// Temp import for icons
import { FileText } from 'lucide-react';

export default FactoringModule;
