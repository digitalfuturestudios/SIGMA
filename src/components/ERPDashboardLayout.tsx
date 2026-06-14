import { useState, useEffect } from 'react';
import { 
  Building2, 
  Nfc, 
  Scale, 
  Landmark, 
  FileCheck, 
  Search, 
  Bell, 
  UserCircle,
  Activity,
  DollarSign,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import NfcPaymentModule from './NfcPaymentModule';
import GobernanzaModule from './GobernanzaModule';
import FactoringModule from './FactoringModule';
import FiscalModule from './FiscalModule';
import { useERPStore } from '../store/useERPStore';

const ERPDashboardLayout = () => {
  const [activeModule, setActiveModule] = useState('tesoreria');
  const { fetchLiquidity, fetchDirectors, fetchInvoices, fetchRetentions } = useERPStore();

  useEffect(() => {
    fetchLiquidity();
    fetchDirectors();
    fetchInvoices();
    fetchRetentions();
  }, []);

  const navItems = [
    { id: 'tesoreria', label: 'Tesorería NFC', icon: Nfc },
    { id: 'gobernanza', label: 'Gobernanza & Poderes', icon: Scale },
    { id: 'factoring', label: 'Bolsa de Factoring', icon: Landmark },
    { id: 'fiscal', label: 'Auditoría Fiscal', icon: FileCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Building2 className="h-6 w-6 text-indigo-500 mr-3" />
          <span className="font-bold text-slate-100 text-lg tracking-tight">Pragma FinOps</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
            ERP Mercantil
          </p>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-200 group-hover:text-slate-300'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
            <span className="text-xs text-slate-200">Nodo RCITE: Conectado</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <div className="flex items-center flex-1">
            <button className="md:hidden mr-4 text-slate-200 hover:text-slate-200">
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="max-w-md w-full relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-950/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="Buscar transacciones, empresas o documentos..."
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative text-slate-200 hover:text-slate-200 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            
            <div className="flex items-center cursor-pointer group">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-sm font-medium text-slate-200 group-hover:text-slate-100 transition-colors">Gerente Financiero</p>
                <p className="text-xs text-slate-300">Pragma Corp</p>
              </div>
              <UserCircle className="h-8 w-8 text-slate-200 group-hover:text-slate-300 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Overview Ejecutivo</h1>
              <p className="text-slate-200 mt-1">Resumen operativo y financiero de la jornada.</p>
            </div>

            {/* Metrics Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Widget 1 */}
              <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 text-sm font-medium">Títulos Valores Activos</h3>
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline">
                  <p className="text-3xl font-semibold text-slate-100">$1,245,890</p>
                  <p className="ml-2 text-sm font-medium text-emerald-400 flex items-center">
                    <Activity className="h-3 w-3 mr-1" /> +12.5%
                  </p>
                </div>
              </div>

              {/* Widget 2 */}
              <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 text-sm font-medium">Liquidez en Factoring</h3>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Landmark className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline">
                  <p className="text-3xl font-semibold text-slate-100">84.2%</p>
                  <p className="ml-2 text-sm font-medium text-slate-200">Tasa de conversión</p>
                </div>
              </div>

              {/* Widget 3 */}
              <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 text-sm font-medium">Retenciones Sincronizadas</h3>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline">
                  <p className="text-3xl font-semibold text-slate-100">100%</p>
                  <p className="ml-2 text-sm font-medium text-slate-200">SENIAT Online</p>
                </div>
              </div>
            </div>

            {/* Conditional Main Module Area */}
            {activeModule === 'tesoreria' ? (
              <NfcPaymentModule />
            ) : activeModule === 'gobernanza' ? (
              <GobernanzaModule />
            ) : activeModule === 'factoring' ? (
              <FactoringModule />
            ) : activeModule === 'fiscal' ? (
              <FiscalModule />
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/50 border-dashed rounded-2xl h-96 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-400/5 opacity-50"></div>
                <h2 className="text-xl font-semibold text-slate-100">Módulo en Desarrollo</h2>
                <p className="text-slate-300 mt-2 max-w-md text-center">
                  Este módulo pertenece a los pilares operativos y será implementado en la siguiente fase arquitectónica.
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default ERPDashboardLayout;
