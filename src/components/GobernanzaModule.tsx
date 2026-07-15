import { useState } from 'react';
import { 
  Shield, 
  Key, 
  UserCheck, 
  UserMinus, 
  AlertTriangle,
  History,
  FileSignature,
  Scale,
  PlusCircle,
  X,
  Cpu,
  Trash2,
  Briefcase,
  Banknote,
  ShieldAlert,
  CheckCircle2,
  Landmark
} from 'lucide-react';

import { useERPStore } from '../store/useERPStore';
import BiometricScanner from './BiometricScanner';

const GobernanzaModule = () => {
  const { directors, toggleDirectorStatus, addDirector, deleteDirector } = useERPStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showScannerForApproval, setShowScannerForApproval] = useState(false);
  const [newDirector, setNewDirector] = useState({ name: '', role: '', powerLevel: 'Firma Clase C (Básica)' });
  const [financialDecisionState, setFinancialDecisionState] = useState<'idle' | 'blocked' | 'approved'>('idle');

  const handleAddDirector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirector.name || !newDirector.role) return;
    setShowScanner(true);
  };

  const handleBiometricSuccess = () => {
    addDirector({
      name: newDirector.name,
      role: newDirector.role,
      powerLevel: newDirector.powerLevel
    });
    
    setNewDirector({ name: '', role: '', powerLevel: 'Firma Clase C (Básica)' });
    setShowScanner(false);
    setShowAddForm(false);
  };

  const handleApprovalSuccess = () => {
    setShowScannerForApproval(false);
    setFinancialDecisionState('approved');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Biometric Portal for Adding Director */}
      {showScanner && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
          <BiometricScanner 
            onScanSuccess={handleBiometricSuccess} 
            onCancel={() => setShowScanner(false)} 
          />
        </div>
      )}

      {/* Biometric Portal for Joint Signature Approval */}
      {showScannerForApproval && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
          <BiometricScanner 
            onScanSuccess={handleApprovalSuccess} 
            onCancel={() => setShowScannerForApproval(false)} 
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-slate-700/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center">
            <Scale className="h-6 w-6 text-indigo-400 mr-3" />
            Identidad Societaria B2B (Tokens de Poder)
          </h2>
          <p className="text-slate-200 text-sm mt-2 max-w-2xl">
            Control criptográfico de representaciones legales basado en el Código de Comercio. 
            Cualquier revocación invalida el dispositivo móvil del empleado en milisegundos.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end space-y-3">
          <div className="flex items-center bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
            <Key className="h-4 w-4 text-emerald-400 mr-2" />
            <span className="text-xs font-mono text-slate-300">Smart Contract: v2.4 Activo</span>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
          >
            {showAddForm ? <X className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            {showAddForm ? 'Cancelar' : 'Otorgar Nuevo Poder'}
          </button>
        </div>
      </div>

      {/* Simulador de Decisión Financiera */}
      <div className="mb-8 p-6 bg-slate-900/60 border border-slate-700 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <Landmark className="w-32 h-32 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center">
          <Briefcase className="h-5 w-5 text-indigo-400 mr-2" />
          Operaciones de Alto Valor
        </h3>
        <p className="text-sm text-slate-300 mb-6 max-w-3xl">
          Simulación de ejecución de pago o contrato por más de $50,000 USD.
        </p>

        {financialDecisionState === 'idle' && (
          <button 
            onClick={() => setFinancialDecisionState('blocked')}
            className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            <Banknote className="h-5 w-5 mr-2" />
            Nueva Decisión Financiera
          </button>
        )}

        {financialDecisionState === 'blocked' && (
          <div className="bg-red-950/40 border border-red-900 p-5 rounded-lg animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex items-start">
              <ShieldAlert className="h-6 w-6 text-red-500 mr-4 mt-0.5" />
              <div>
                <h4 className="text-red-400 font-semibold mb-2 text-lg">Acción Bloqueada: Se Requiere Firma Conjunta</h4>
                <p className="text-sm text-red-300/80 mb-4">
                  Los estatutos actuales requieren firmas conjuntas (Tipo A y Tipo B) para transacciones superiores a $50,000 USD.
                </p>
                <button
                  onClick={() => setShowScannerForApproval(true)}
                  className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-600 rounded-lg transition-colors shadow-md"
                >
                  <Key className="h-4 w-4 mr-2 text-indigo-400" />
                  Simular Aprobación con Token NFC
                </button>
              </div>
            </div>
          </div>
        )}

        {financialDecisionState === 'approved' && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 p-5 rounded-lg animate-in zoom-in fade-in">
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-4 mt-0.5" />
              <div>
                <h4 className="text-emerald-400 font-semibold mb-2 text-lg">Transacción Aprobada y Ejecutada</h4>
                <p className="text-sm text-emerald-200/90 mb-4 italic font-medium leading-relaxed bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                  "Esto no solo es un botón; detrás de esto, el sistema valida las actas estatutarias de la empresa y deja una traza legalmente vinculante según la Ley de Mensajes de Datos."
                </p>
                <button
                  onClick={() => setFinancialDecisionState('idle')}
                  className="text-xs text-slate-400 hover:text-slate-300 underline flex items-center"
                >
                  <History className="h-3 w-3 mr-1" /> Reiniciar Simulación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Director Form */}
      {showAddForm && (
        <form onSubmit={handleAddDirector} className="mb-8 bg-slate-900/80 border border-indigo-500/30 p-6 rounded-xl animate-in slide-in-from-top-4 fade-in">
          <h3 className="text-slate-100 font-medium mb-4 flex items-center">
            <FileSignature className="h-5 w-5 mr-2 text-indigo-400" />
            Otorgamiento de Poder Notarial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-200 uppercase tracking-wider mb-1">Nombre Completo</label>
              <input 
                type="text" 
                required
                value={newDirector.name}
                onChange={e => setNewDirector({...newDirector, name: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                placeholder="Ej. María Perez"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-200 uppercase tracking-wider mb-1">Cargo Societario</label>
              <input 
                type="text" 
                required
                value={newDirector.role}
                onChange={e => setNewDirector({...newDirector, role: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                placeholder="Ej. Gerente de Compras"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-200 uppercase tracking-wider mb-1">Nivel de Poder</label>
              <select 
                value={newDirector.powerLevel}
                onChange={e => setNewDirector({...newDirector, powerLevel: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option>Firma Clase A (Sin Límite)</option>
                <option>Firma Clase B (Hasta $50,000)</option>
                <option>Firma Clase C (Básica)</option>
                <option>Poder Especial (Compras)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-700/50">
            <button type="submit" className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg">
              <Cpu className="h-4 w-4 mr-2" />
              Validar Biometría y Emitir
            </button>
          </div>
        </form>
      )}

      {/* Directors List */}
      <div className="space-y-4">
        {directors.map(director => (
          <div 
            key={director.id} 
            className={`flex flex-col lg:flex-row items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
              director.status === 'active' 
                ? 'bg-slate-900/60 border-slate-700/50 hover:border-indigo-500/50' 
                : 'bg-red-950/20 border-red-900/50 opacity-80'
            }`}
          >
            {/* Info Info */}
            <div className="flex items-center w-full lg:w-1/3 mb-4 lg:mb-0">
              <div className={`p-3 rounded-full mr-4 ${director.status === 'active' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-600'}`}>
                {director.status === 'active' ? <UserCheck className="h-6 w-6" /> : <UserMinus className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{director.name}</h3>
                <p className="text-sm text-slate-200">{director.role}</p>
              </div>
            </div>

            {/* Token & Power */}
            <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between lg:px-8 mb-4 lg:mb-0 space-y-2 sm:space-y-0">
              <div>
                <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">Nivel de Poder</p>
                <p className="text-sm text-slate-300 flex items-center mt-1">
                  <FileSignature className="h-4 w-4 mr-2 text-slate-300" />
                  {director.powerLevel}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-300 uppercase font-semibold tracking-wider">Token NFC ID</p>
                <p className="text-sm font-mono text-slate-200 mt-1">{director.token}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full lg:w-auto flex justify-end space-x-3">
              <button
                onClick={() => toggleDirectorStatus(director.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center flex-1 lg:flex-none ${
                  director.status === 'active'
                    ? 'bg-slate-800 hover:bg-orange-900/80 text-orange-400 hover:text-orange-300 border border-transparent hover:border-orange-800'
                    : 'bg-emerald-900/30 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50'
                }`}
              >
                {director.status === 'active' ? (
                  <>
                    <AlertTriangle className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Revocar Poder</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Restituir Poder</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => deleteDirector(director.id)}
                title="Eliminar Director"
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center bg-slate-800 hover:bg-red-900/80 text-red-500 hover:text-red-400 border border-transparent hover:border-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Hint */}
      <div className="mt-8 flex items-center text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg">
        <History className="h-4 w-4 mr-2" />
        <p>Todos los cambios de estado generan un acta constitutiva digital anclada en la blockchain a través de la firma electrónica del Administrador principal.</p>
      </div>

    </div>
  );
};

export default GobernanzaModule;
