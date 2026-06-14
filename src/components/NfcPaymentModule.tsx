import React, { useEffect, useState, useRef } from 'react';
import { 
  SmartphoneNfc,
  CheckCircle,
  FileText,
  ShieldCheck,
  Settings,
  Edit3,
  Terminal,
  Wifi,
  Cpu
} from 'lucide-react';
import { useERPStore } from '../store/useERPStore';
import { io } from 'socket.io-client';
import BiometricScanner from './BiometricScanner';
import { ethers } from 'ethers';

const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:3000`;
const socket = io(backendUrl);

const NfcPaymentModule = () => {
  const { chequeData, setChequeData, addFiscalTransactionFromTesoreria } = useERPStore();
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [mode, setMode] = useState<'tpv' | 'client'>('tpv');
  const [showScanner, setShowScanner] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSimulationRef = useRef<any>(null);

  useEffect(() => {
    // 1. WebSocket Listener
    socket.on('nfc_tap_received', (data) => {
      if (mode === 'tpv') {
        setChequeData(data);
        if (handleSimulationRef.current) handleSimulationRef.current();
      }
    });

    return () => {
      socket.off('nfc_tap_received');
    };
  }, [mode]);

  const emitTap = () => {
    socket.emit('simulate_nfc_tap', chequeData);
    setStatus('success');
  };

  const startBiometricScan = () => {
    setShowScanner(true);
  };

  const handleBiometricSuccess = () => {
    setShowScanner(false);
    emitTap();
  };

  const simulationSteps = [
    '[0.5s] Leyendo Token NFC (ISO/IEC 14443)...',
    '[1.0s] Validando Poder Societario en Blockchain...',
    '[1.5s] Negociando Smart Contract V2...',
    '[2.0s] Reteniendo Impuestos y Hasheando...',
    '[2.5s] Transacción Exitosa. Fondos Liberados.'
  ];

  const handleSimulation = () => {
    if (status === 'processing' || mode === 'client') return;
    
    // Si ya estaba en success, lo reseteamos inmediatamente para correr de nuevo
    setIsEditing(false);
    setStatus('processing');
    setConsoleLines([]);
    setTxHash(null);
    
    // Simular consola de rayos X
    simulationSteps.forEach((step, index) => {
      setTimeout(() => {
        setConsoleLines(prev => [...prev, step]);
      }, (index + 1) * 500);
    });

    setTimeout(async () => {
      setStatus('success');
      
      // Integración Web3: Generar Firma Criptográfica Real
      try {
        const wallet = ethers.Wallet.createRandom();
        const message = JSON.stringify(chequeData);
        const signature = await wallet.signMessage(message);
        setTxHash(signature);
      } catch (err) {
        console.error("Web3 Signature Error:", err);
        setTxHash("0xErrorGenerandoFirma");
      }

      // Integración con el estado global: El pago NFC reduce liquidez y agrega retención
      addFiscalTransactionFromTesoreria(parseFloat(chequeData.amount), chequeData.beneficiary);
    }, 3000);
  };

  const handleNfcOrSimulate = async () => {
    if ('NDEFReader' in window && !nfcSupported) {
      try {
        const ndefReader = new (window as any).NDEFReader();
        await ndefReader.scan();
        setNfcSupported(true);
        
        ndefReader.onreading = (event: any) => {
          console.log("Hardware NFC Leído", event);
          if (handleSimulationRef.current) handleSimulationRef.current();
        };
        
        ndefReader.onreadingerror = (event: any) => {
          console.log("Error leyendo NFC. Tarjeta no es NDEF", event);
          // Muchas tarjetas bancarias o en blanco causan este error porque no son NDEF estándar.
          // Para la demostración de la app, también lanzamos la simulación aquí.
          if (handleSimulationRef.current) handleSimulationRef.current();
        };
        
        // El lector ya está activo esperando
        return; 
      } catch (error) {
        console.log("Web NFC API bloqueada o sin permisos.", error);
      }
    }
    // Si no hay soporte NFC o ya estaba activado (y el usuario quiere forzar la simulación)
    handleSimulation();
  };

  // Mantener la referencia siempre actualizada para el closure del NFC
  useEffect(() => {
    handleSimulationRef.current = handleSimulation;
  });

  const resetManual = () => {
    setStatus('idle');
    setConsoleLines([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChequeData({ [name]: value });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Biometric Portal */}
      {showScanner && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-6">
          <BiometricScanner 
            onScanSuccess={handleBiometricSuccess} 
            onCancel={() => setShowScanner(false)} 
          />
        </div>
      )}

      {/* Background glow */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
        
        {/* Left Side: E-Cheque Data */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center">
                <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                E-Cheque Inteligente a Pagar
              </h2>
              <p className="text-slate-200 text-sm mt-1">Transacción comercial cifrada vía Blockchain Privada.</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setMode(mode === 'tpv' ? 'client' : 'tpv')}
                className={`p-2 rounded-lg border transition-colors flex items-center text-xs font-semibold ${mode === 'tpv' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                title="Cambiar Modo"
              >
                <Wifi className="h-4 w-4 mr-1" />
                {mode === 'tpv' ? 'Modo TPV' : 'Modo Cliente'}
              </button>
              {status === 'idle' && mode === 'tpv' && (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-slate-200 hover:text-indigo-400 bg-slate-900/50 rounded-lg border border-slate-700 transition-colors"
                  title="Configurar Parámetros"
                >
                  {isEditing ? <CheckCircle className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700/50 font-mono text-sm shadow-inner relative overflow-hidden transition-all duration-300">
            <div className="absolute right-0 top-0 w-1 h-full bg-indigo-500/50"></div>
            
            {isEditing ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col space-y-1 border-b border-slate-800 pb-3">
                  <label className="text-xs text-indigo-400 font-sans uppercase tracking-wider flex items-center">
                    <Edit3 className="h-3 w-3 mr-1" /> Editar Beneficiario
                  </label>
                  <input 
                    type="text" 
                    name="beneficiary"
                    value={chequeData.beneficiary}
                    onChange={handleChange}
                    className="bg-slate-950/50 border border-slate-700 rounded p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-1 border-b border-slate-800 pb-3">
                  <label className="text-xs text-indigo-400 font-sans uppercase tracking-wider flex items-center">
                    <Edit3 className="h-3 w-3 mr-1" /> Editar Concepto
                  </label>
                  <input 
                    type="text" 
                    name="concept"
                    value={chequeData.concept}
                    onChange={handleChange}
                    className="bg-slate-950/50 border border-slate-700 rounded p-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-1 border-b border-slate-800 pb-3">
                  <label className="text-xs text-indigo-400 font-sans uppercase tracking-wider flex items-center">
                    <Edit3 className="h-3 w-3 mr-1" /> Monto (USD)
                  </label>
                  <input 
                    type="number" 
                    name="amount"
                    value={chequeData.amount}
                    onChange={handleChange}
                    className="bg-slate-950/50 border border-slate-700 rounded p-2 text-emerald-400 font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-slate-300 animate-in fade-in">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Beneficiario:</span>
                  <span className="font-semibold text-slate-200">{chequeData.beneficiary || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Concepto:</span>
                  <span>{chequeData.concept || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-300">Monto:</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    USD ${parseFloat(chequeData.amount || '0').toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-300">Hash de Origen:</span>
                  <span className="text-xs text-slate-300 break-all w-3/4 text-right">
                    {txHash ? `${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 8)} (Validado)` : '0x7a2B...8f9D (Simulado)'}
                  </span>
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mt-6 flex items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                <ShieldCheck className="h-5 w-5 mr-2" />
                <span>Poder Societario Validado. Pago Autorizado.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: NFC Terminal Interaction */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 p-8 shadow-inner relative">
          
          <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[240px]">
            {status === 'idle' && (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="relative mb-6 mx-auto w-24">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse ${mode === 'tpv' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                  <SmartphoneNfc className={`h-24 w-24 relative z-10 ${mode === 'tpv' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                </div>
                <h3 className="text-lg font-medium text-slate-100">
                  {mode === 'tpv' ? (nfcSupported ? 'Lector NFC Activo' : 'Esperando E-Cheque...') : 'Listo para Pagar'}
                </h3>
                <p className="text-slate-300 text-sm mt-2">
                  {mode === 'tpv' 
                    ? nfcSupported ? 'Acerque la Tarjeta NFC a la parte trasera del teléfono' : 'Toque el botón abajo para Activar el Lector o Simular' 
                    : 'Asegure su entorno para la validación biométrica'}
                </p>
              </div>
            )}

            {status === 'processing' && (
              <div className="w-full h-full bg-black/80 rounded-lg border border-emerald-500/30 p-4 font-mono text-xs overflow-hidden relative shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <div className="flex items-center text-emerald-500 border-b border-emerald-500/30 pb-2 mb-2">
                  <Terminal className="h-4 w-4 mr-2" />
                  Consola de Auditoría Criptográfica
                </div>
                <div className="space-y-1.5 mt-2 h-40 flex flex-col justify-end">
                  {consoleLines.map((line, idx) => (
                    <div key={idx} className="text-emerald-400 animate-in fade-in slide-in-from-bottom-2">
                      <span className="text-emerald-600 mr-2">&gt;</span>{line}
                    </div>
                  ))}
                  {consoleLines.length < 5 && (
                    <div className="text-emerald-500 animate-pulse">
                      <span className="text-emerald-600 mr-2">&gt;</span>_
                    </div>
                  )}
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center animate-in fade-in zoom-in duration-500 scale-110">
                <div className="relative mb-6 mx-auto w-24">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30"></div>
                  <CheckCircle className="h-24 w-24 text-emerald-400 relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">Transacción Exitosa</h3>
                <p className="text-slate-200 text-sm mt-2">Fondos liberados y retenidos fiscalmente.</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={mode === 'client' ? startBiometricScan : (status === 'success' ? resetManual : handleNfcOrSimulate)}
            disabled={status === 'processing'}
            className={`mt-8 w-full py-3.5 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center justify-center ${
              status === 'idle' 
                ? mode === 'client' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]' // Botón habilitado para Demo Manual
                : status === 'success' && mode === 'tpv'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-300 cursor-not-allowed'
            }`}
          >
            {status === 'idle' && mode === 'tpv' && (nfcSupported ? 'Lector NFC Activo (Click para Simular)' : 'Activar Lector NFC / Simular')}
            {status === 'idle' && mode === 'client' && (
              <>
                <Cpu className="w-5 h-5 mr-2" />
                Autorizar Pago Biométrica
              </>
            )}
            {status === 'processing' && 'Ejecutando Smart Contract...'}
            {status === 'success' && mode === 'tpv' && 'Nueva Transacción'}
            {status === 'success' && mode === 'client' && 'Pago Emitido Exitosamente'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default NfcPaymentModule;
