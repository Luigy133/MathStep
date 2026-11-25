import React, { useRef, useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';

interface LocalVideoPlayerProps {
  videoUrl: string;
  startTime: number;
  endTime: number;
  onEnd: () => void;
}

export default function LocalVideoPlayer({ videoUrl, startTime, endTime, onEnd }: LocalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [videoIniciado, setVideoIniciado] = useState(false);

  useEffect(() => {
    console.log('📽️ LocalVideoPlayer montado con URL:', videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        onEnd();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [endTime, onEnd]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Configurar audio
    video.muted = false;
    
    const intentarReproducir = async () => {
      console.log('🎬 Intentando reproducir. readyState:', video.readyState);
      
      // Asegurarse de pausar primero para evitar colisiones
      if (!video.paused) {
        video.pause();
      }
      
      video.currentTime = startTime;
      console.log('⏱️ currentTime establecido a:', video.currentTime);
      
      try {
        await video.play();
        console.log('✅ Reproducción iniciada');
        setVideoIniciado(true);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('ℹ️ Reproducción interrumpida por pause() - esperado.');
        } else {
          console.error('❌ Error al reproducir:', err);
        }
      }
    };
    
    // Si el video ya está listo, reproducir inmediatamente
    if (video.readyState >= 2) {
      intentarReproducir();
    } else {
      // Si no, esperar al evento 'canplay'
      console.log('⏳ Esperando a que el video esté listo...');
      video.addEventListener('canplay', intentarReproducir, { once: true });
    }
    
    setShowPlayButton(false);
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
    <video
        ref={videoRef}
        controls
        playsInline
        className="w-full h-full"
        preload="metadata"
        src={videoUrl}
        onLoadedMetadata={() => console.log('🔄 Metadatos cargados para:', videoUrl)}
      />
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 bg-white text-[#1E3A8A] px-6 py-3 rounded-full text-xl font-bold shadow-lg hover:bg-gray-100 transition"
          >
            <PlayCircle size={32} />
            Reproducir el Caso
          </button>
        </div>
      )}
    </div>
  );
}
