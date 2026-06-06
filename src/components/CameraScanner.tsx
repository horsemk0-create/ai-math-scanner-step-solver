import React, { useState, useEffect, useRef } from "react";
import { Camera, X, RotateCw, RefreshCw, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  language: string;
}

export function CameraScanner({ isOpen, onClose, onCapture, language }: CameraScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [activeDeviceIdx, setActiveDeviceIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Translations
  const t = (key: string) => {
    const isBengali = language === "Bangla" || language === "Bengali";
    const dict: Record<string, { en: string; bn: string }> = {
      title: { en: "Math Camera Scanner", bn: "গণিত ক্যামেরা স্ক্যানার" },
      instruction: { en: "Align your math problem inside the frame", bn: "ফ্রেমের ভেতরে আপনার গণিত সমস্যাটি রাখুন" },
      noCamera: { en: "No camera devices detected.", bn: "কোনো ক্যামেরা ডিভাইস খুঁজে পাওয়া যায়নি।" },
      permissionRequired: { en: "Camera permission is required to scan equations.", bn: "সমীকরণ স্ক্যান করতে ক্যামেরার অনুমতি প্রয়োজন।" },
      allowBtn: { en: "Grant Permission / Retry", bn: "অনুমতি দিন / আবার চেষ্টা করুন" },
      flip: { en: "Flip Camera", bn: "ক্যামেরা পরিবর্তন" },
      cancel: { en: "Cancel", bn: "বাতিল করুন" }
    };
    const langKey = isBengali ? "bn" : "en";
    return dict[key]?.[langKey] || dict[key]?.["en"] || "";
  };

  // Enumerate standard video camera inputs
  const enumerateVideoSources = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter(d => d.kind === "videoinput");
      setDevices(videoInputs);
      return videoInputs;
    } catch (e) {
      console.warn("Could not enumerate camera streams:", e);
      return [];
    }
  };

  // Clean and stop any running tracks
  const stopExistingStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  // Explicitly prompt / configure the camera stream
  const initializeCamera = async (deviceId?: string) => {
    stopExistingStream();
    setLoading(true);
    setError(null);

    // Build constraints optimized for rear camera
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: deviceId 
        ? { deviceId: { exact: deviceId } }
        : {
            // Priority given to back/rear facing camera (environment)
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
    };

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("navigator.mediaDevices.getUserMedia is not supported on this device/browser context.");
      }

      const activeStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(activeStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = activeStream;
        // Ensure playsinline and autopay are adhered to for iOS + Android Chrome WebView
        videoRef.current.play().catch(e => {
          console.warn("Autoplay was blocked initially:", e);
        });
      }

      // Query list of video devices to support hot hot swapping/flipping
      const list = await enumerateVideoSources();
      if (deviceId) {
        const idx = list.findIndex(d => d.deviceId === deviceId);
        if (idx !== -1) setActiveDeviceIdx(idx);
      } else {
        // Find if any device matches the active track's settings
        const activeTrack = activeStream.getVideoTracks()[0];
        const settings = activeTrack?.getSettings();
        if (settings?.deviceId) {
          const idx = list.findIndex(d => d.deviceId === settings.deviceId);
          if (idx !== -1) setActiveDeviceIdx(idx);
        }
      }
    } catch (err: any) {
      console.error("Camera connection failed:", err);
      
      // Fallback 1: If specific device failed, try ideal fallback without restriction
      if (deviceId) {
        initializeCamera();
      } else {
        // Fallback 2: General fallback to simple video toggle
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.play().catch(() => {});
          }
          await enumerateVideoSources();
        } catch (finalError: any) {
          setError(
            finalError.name === "NotAllowedError" || finalError.name === "PermissionDeniedError"
              ? t("permissionRequired")
              : finalError.message || "Could not launch camera hardware stream."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Boot the stream when modal is opened
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      stopExistingStream();
    }
    return () => stopExistingStream();
  }, [isOpen]);

  // Flip/Cycle cameras
  const handleFlipCamera = () => {
    if (devices.length < 2) return;
    const nextIdx = (activeDeviceIdx + 1) % devices.length;
    setActiveDeviceIdx(nextIdx);
    initializeCamera(devices[nextIdx].deviceId);
  };

  // Capture current frame from the running stream onto a canvas and callback
  const handleCaptureFrame = () => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    
    // Maintain maximum high-res details but limit size to 1280 max dimension for efficient API transmission
    const MAX_DIM = 1200;
    let width = video.videoWidth || 640;
    let height = video.videoHeight || 480;

    if (width > MAX_DIM || height > MAX_DIM) {
      if (width > height) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      } else {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }
    }

    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill white background to protect against transparency overhead
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Draw video frame exactly matching aspect
    ctx.drawImage(video, 0, 0, width, height);

    try {
      // High-quality JPEG compression
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      onCapture(dataUrl);
      onClose();
    } catch (e) {
      console.error("Canvas grab error:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col justify-between overflow-hidden font-sans select-none md:p-6 p-0">
      {/* 1. Header Area with Glassmorphism */}
      <div className="safe-top w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/40 py-4 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow shadow-teal-400" />
          <h2 className="text-sm font-bold text-slate-100 tracking-wide font-sans">{t("title")}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition duration-150 cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          id="camera-close-action"
        >
          <X size={14} />
          {t("cancel")}
        </button>
      </div>

      {/* 2. Primary Viewfinder Body */}
      <div className="relative flex-grow flex items-center justify-center bg-slate-950 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 z-20">
            <RefreshCw size={28} className="text-teal-400 animate-spin" />
            <p className="text-xs font-medium text-slate-400 font-mono">Initializing camera sensor stream...</p>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-20 space-y-4 max-w-sm mx-auto">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
              <AlertTriangle size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">{t("noCamera")}</p>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => initializeCamera()}
              className="py-2 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all duration-150 cursor-pointer"
            >
              {t("allowBtn")}
            </button>
          </div>
        ) : (
          /* Live Stream Frame View */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover select-none md:rounded-2xl"
            />

            {/* Custom Interactive Floating Lens Target Grid */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Shaded boundaries outside viewfinder frame */}
              <div className="absolute inset-0 bg-slate-950/60 flex flex-col justify-between">
                <div className="w-full flex-grow" />
                <div className="w-full h-64 flex justify-between">
                  <div className="h-full flex-grow bg-slate-950/60" />
                  <div className="w-72 h-full flex flex-col relative">
                    {/* Viewfinder Target Frame */}
                    <div className="absolute inset-0 border border-teal-500/20 rounded-2xl shadow-inner overflow-hidden">
                      {/* Scanning laser glow line effect */}
                      <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-500/50 justify-center top-0 left-0 animate-[shutterLaser_3s_ease-in-out_infinite]" />
                    </div>
                    {/* Corner Reticles */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-teal-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-teal-400 rounded-br-xl" />
                  </div>
                  <div className="h-full flex-grow bg-slate-950/60" />
                </div>
                <div className="w-full flex-grow flex flex-col items-center justify-start pt-6">
                  <p className="text-[11px] font-medium text-slate-100 bg-slate-900/90 py-1.5 px-4 rounded-full border border-slate-800/80 shadow-md">
                    {t("instruction")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Camera Controls Menu */}
      <div className="safe-bottom w-full bg-slate-900 py-6 px-6 flex items-center justify-around z-10 border-t border-slate-800/40">
        <div className="w-12" /> {/* Layout balancer */}

        {/* Big Shutter Button with outer trigger ring */}
        <button
          onClick={handleCaptureFrame}
          disabled={loading || !!error}
          className="group relative flex items-center justify-center p-1 rounded-full border-4 border-white/20 hover:border-teal-400/30 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          id="camera-capture-trigger"
        >
          <div className="h-14 w-14 rounded-full bg-white group-hover:bg-teal-400 flex items-center justify-center transition-colors duration-150">
            <Camera className="text-slate-950 stroke-[2.5]" size={24} />
          </div>
        </button>

        {/* Flip Option - cycles through available system camera devices */}
        {devices.length >= 2 ? (
          <button
            onClick={handleFlipCamera}
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            id="camera-flip-action"
          >
            <RotateCw size={16} className="animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{t("flip")}</span>
          </button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Embedded laser CSS styling hack */}
      <style>{`
        @keyframes shutterLaser {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
