import React, { useEffect, useRef, useState } from 'react';
import { ScanFace, CheckCircle, XCircle } from 'lucide-react';

interface BiometricScannerProps {
  onScanSuccess: () => void;
  onCancel: () => void;
}

const BiometricScanner: React.FC<BiometricScannerProps> = ({ onScanSuccess, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanStatus, setScanStatus] = useState<'initializing' | 'scanning' | 'success' | 'error'>('initializing');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Simular secuencia de escaneo
        setTimeout(() => {
          setScanStatus('scanning');
          setLogs(['[SYS] Cámara asegurada.', 'Iniciando escaneo biométrico (ISO/IEC 30107)...']);
          
          setTimeout(() => setLogs(prev => [...prev, 'Mapeando 30,000 puntos infrarrojos...']), 1000);
          setTimeout(() => setLogs(prev => [...prev, 'Analizando profundidad y liveness...']), 2000);
          setTimeout(() => setLogs(prev => [...prev, 'Comparando con Hash Maestro en Blockchain...']), 3000);
          
          setTimeout(() => {
            setScanStatus('success');
            setLogs(prev => [...prev, '[!] IDENTIDAD CONFIRMADA. AUTORIZACIÓN NIVEL 5.']);
            
            setTimeout(() => {
              if (stream) {
                stream.getTracks().forEach(track => track.stop());
              }
              onScanSuccess();
            }, 1500);

          }, 4500);

        }, 1000);

      } catch (err) {
        console.error('Error accediendo a la cámara:', err);
        setScanStatus('error');
        setLogs(['Error: Acceso a cámara denegado o hardware no encontrado.', 'Por favor verifique los permisos de su navegador.']);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-700 shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-2xl overflow-hidden">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-emerald-400 font-mono text-sm tracking-widest uppercase flex items-center">
            <ScanFace className="mr-2 h-5 w-5 animate-pulse" />
            Validación Biométrica Requerida
          </h2>
          <button onClick={onCancel} className="text-slate-300 hover:text-red-400 transition-colors">
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Contenedor del Video y HUD */}
        <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border-2 border-slate-800 shadow-inner">
          
          {scanStatus === 'error' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-6 text-center">
              <XCircle className="h-16 w-16 mb-4" />
              <p className="font-mono text-sm">Señal de video interrumpida.</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-all duration-1000 ${scanStatus === 'success' ? 'grayscale brightness-150 contrast-125 sepia-[.5] hue-rotate-[80deg]' : 'grayscale'}`} 
            />
          )}

          {/* HUD Overlay */}
          {scanStatus !== 'error' && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Esquinas del HUD */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-emerald-500/70"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-emerald-500/70"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-emerald-500/70"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-emerald-500/70"></div>
              
              {/* Mira central */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 border border-emerald-500/30 rounded-full flex items-center justify-center relative">
                  <div className="w-1 h-4 bg-emerald-500/50 absolute top-0"></div>
                  <div className="w-1 h-4 bg-emerald-500/50 absolute bottom-0"></div>
                  <div className="w-4 h-1 bg-emerald-500/50 absolute left-0"></div>
                  <div className="w-4 h-1 bg-emerald-500/50 absolute right-0"></div>
                  {scanStatus === 'success' && (
                    <CheckCircle className="h-16 w-16 text-emerald-400 animate-in zoom-in duration-500" />
                  )}
                </div>
              </div>

              {/* Láser de Escaneo */}
              {scanStatus === 'scanning' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[scan_2s_ease-in-out_infinite]"></div>
              )}
            </div>
          )}
        </div>

        {/* Consola de Logs */}
        <div className="mt-6 bg-black/50 border border-emerald-900/50 rounded-lg p-4 h-32 overflow-hidden flex flex-col justify-end">
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, idx) => (
              <div key={idx} className={`${log.includes('[!]') ? 'text-emerald-400 font-bold' : 'text-emerald-600'} animate-in fade-in slide-in-from-bottom-2`}>
                <span className="opacity-50 mr-2">&gt;</span>{log}
              </div>
            ))}
            {scanStatus !== 'success' && scanStatus !== 'error' && (
              <div className="text-emerald-600 animate-pulse">
                <span className="opacity-50 mr-2">&gt;</span>_
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 90%; opacity: 1; }
          90% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BiometricScanner;
