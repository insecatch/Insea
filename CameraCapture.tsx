import { useState, useRef, useEffect } from 'react';
import { Camera, X, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { INSECT_DATABASE, Insect } from '@/app/data/insectDatabase';
import { storage } from '@/app/utils/storage';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: () => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [identifiedInsect, setIdentifiedInsect] = useState<Insect | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setCameraError('Camera access requires a secure connection (HTTPS). The app is running in an insecure context.');
        return;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported in this browser. Please use a modern browser like Chrome, Safari, or Firefox.');
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      // Silently handle camera errors and show user-friendly UI instead
      
      // Provide specific error messages based on error type
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. You can either enable camera access in your browser settings or use Demo Mode to test the app.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device. You can use Demo Mode to test the app without a camera.');
        } else if (error.name === 'NotReadableError') {
          setCameraError('Camera is already in use by another application. Please close other apps using the camera or use Demo Mode.');
        } else if (error.name === 'OverconstrainedError') {
          setCameraError('Camera does not meet requirements. Trying again with default settings...');
          // Try again without specific constraints
          retryWithBasicCamera();
        } else {
          setCameraError(`Unable to access camera: ${error.message}. You can use Demo Mode to test the app.`);
        }
      } else {
        setCameraError('Unable to access camera. Please check your browser permissions or use Demo Mode.');
      }
    }
  };

  const retryWithBasicCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(null);
    } catch (error) {
      // Silently handle retry errors
      setCameraError('Unable to access camera. Please grant camera permissions in your browser settings or use Demo Mode.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      // Simulate AI identification
      setIsScanning(true);
      setTimeout(() => {
        identifyInsect();
      }, 2000);
    }
  };

  const identifyInsect = () => {
    // Simulate AI identification with weighted random selection based on rarity
    const rarityWeights: Record<string, number> = {
      common: 50,
      uncommon: 25,
      rare: 15,
      epic: 7,
      legendary: 3
    };

    const weightedInsects: Insect[] = [];
    INSECT_DATABASE.forEach(insect => {
      const weight = rarityWeights[insect.rarity] || 1;
      for (let i = 0; i < weight; i++) {
        weightedInsects.push(insect);
      }
    });

    const randomInsect = weightedInsects[Math.floor(Math.random() * weightedInsects.length)];
    setIdentifiedInsect(randomInsect);
    setIsScanning(false);

    if (randomInsect.type === 'dangerous') {
      setShowWarning(true);
    }
  };

  const handleCollect = () => {
    if (identifiedInsect) {
      storage.addToCollection(identifiedInsect, 'Camera Capture');
      
      // Award coins based on rarity
      const rarityRewards: Record<string, number> = {
        'common': 10,
        'uncommon': 25,
        'rare': 50,
        'epic': 100,
        'legendary': 250,
        'mythic': 500,
        'exotic': 1000
      };
      
      const coinReward = rarityRewards[identifiedInsect.rarity] || 10;
      storage.addCoins(coinReward);
      
      setIdentifiedInsect(null);
      setShowWarning(false);
      onCapture();
    }
  };

  const handleRetry = () => {
    setIdentifiedInsect(null);
    setShowWarning(false);
  };

  const handleRetryCamera = () => {
    setCameraError(null);
    startCamera();
  };

  const handleDemoMode = () => {
    // Skip camera and go straight to insect identification
    setCameraError(null);
    setIsScanning(true);
    setTimeout(() => {
      identifyInsect();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 z-10"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Camera Error Screen */}
        <AnimatePresence>
          {cameraError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex items-center justify-center p-6"
            >
              <div className="max-w-md text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">Camera Access Required</h2>
                  <p className="text-white/80 mb-6 leading-relaxed">{cameraError}</p>
                  
                  <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
                    <p className="text-white text-sm font-semibold mb-2">How to enable camera:</p>
                    <ol className="text-white/70 text-sm space-y-1 list-decimal list-inside">
                      <li>Look for a camera icon in your browser's address bar</li>
                      <li>Click it and select "Allow"</li>
                      <li>Refresh the page if needed</li>
                      <li>Try again by clicking the button below</li>
                    </ol>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleRetryCamera}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={handleDemoMode}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      Demo Mode
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                </motion.div>
                <p className="text-xl font-semibold">Identifying insect...</p>
                <p className="text-sm opacity-75 mt-2">AI analysis in progress</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Identification result */}
        <AnimatePresence>
          {identifiedInsect && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6 pb-8"
            >
              {showWarning && identifiedInsect.warningMessage && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 p-4 bg-red-600 rounded-xl flex items-start gap-3"
                >
                  <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-white">
                    <p className="font-bold text-lg mb-1">WARNING</p>
                    <p className="text-sm">{identifiedInsect.warningMessage}</p>
                  </div>
                </motion.div>
              )}

              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: identifiedInsect.type === 'good' ? '#10b981' :
                                     identifiedInsect.type === 'bad' ? '#ef4444' : '#dc2626'
                    }}
                  >
                    {identifiedInsect.type === 'good' ? 'Beneficial' :
                     identifiedInsect.type === 'bad' ? 'Pest' : 'Dangerous'}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: identifiedInsect.rarity === 'common' ? '#94a3b8' :
                                     identifiedInsect.rarity === 'uncommon' ? '#22c55e' :
                                     identifiedInsect.rarity === 'rare' ? '#3b82f6' :
                                     identifiedInsect.rarity === 'epic' ? '#a855f7' : '#f59e0b'
                    }}
                  >
                    {identifiedInsect.rarity}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-1">{identifiedInsect.name}</h2>
                <p className="text-sm italic opacity-75 mb-3">{identifiedInsect.scientificName}</p>
                <p className="text-sm mb-4">{identifiedInsect.description}</p>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75">ATK</div>
                    <div className="text-lg font-bold">{identifiedInsect.stats.attack}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75">DEF</div>
                    <div className="text-lg font-bold">{identifiedInsect.stats.defense}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75">SPD</div>
                    <div className="text-lg font-bold">{identifiedInsect.stats.speed}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-xs opacity-75">HP</div>
                    <div className="text-lg font-bold">{identifiedInsect.stats.health}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Retry
                  </Button>
                  <Button
                    onClick={handleCollect}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    Collect
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Capture button */}
        {!isScanning && !identifiedInsect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center"
          >
            <Button
              onClick={captureImage}
              size="icon"
              className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 shadow-xl"
            >
              <Camera className="w-10 h-10 text-black" />
            </Button>
          </motion.div>
        )}

        {/* Camera frame overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-4 border-white/30 rounded-3xl">
            {/* Corner markers */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}