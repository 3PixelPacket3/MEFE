import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Upload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Take Photo with Camera',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setErrorMsg(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setErrorMsg(null);
    setIsStartingCamera(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or context.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg(
        'Unable to access camera. Please allow camera permissions in your browser or choose a file.'
      );
    } finally {
      setIsStartingCamera(false);
    }
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setCapturedImage(result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#2D2424] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E2725B] flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-bold text-base text-white tracking-tight">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured look"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {isStartingCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#E2725B]" />
                  <span className="text-xs">Initializing camera lens...</span>
                </div>
              )}

              {errorMsg && (
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-black/85 text-center text-white">
                  <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                  <p className="text-xs sm:text-sm text-amber-200 mb-4 max-w-xs">{errorMsg}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File Instead</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer */}
        <div className="p-4 sm:p-5 bg-[#231B1B] border-t border-white/10 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl bg-[#E2725B] text-white text-xs font-bold hover:bg-[#D46049] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#E2725B]/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFlipCamera}
                disabled={Boolean(errorMsg)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition disabled:opacity-30 cursor-pointer"
                title="Switch Camera (Front/Back)"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                onClick={handleTakePhoto}
                disabled={Boolean(errorMsg) || isStartingCamera}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition disabled:opacity-40 cursor-pointer shadow-lg"
                title="Snap Picture"
              >
                <div className="w-12 h-12 rounded-full bg-[#E2725B]" />
              </button>

              {/* Device File Fallback */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Upload Photo from Device"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
