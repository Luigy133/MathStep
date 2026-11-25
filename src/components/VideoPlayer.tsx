import React from 'react';
import LocalVideoPlayer from './LocalVideoPlayer';
import YouTubePlayer from './YouTubePlayer';

interface VideoPlayerProps {
  videoUrl?: string;
  youtubeId?: string;
  startTime: number;
  endTime: number;
  onEnd: () => void;
}

export default function VideoPlayer({ videoUrl, youtubeId, startTime, endTime, onEnd }: VideoPlayerProps) {
  if (youtubeId) {
    return <YouTubePlayer youtubeId={youtubeId} startTime={startTime} endTime={endTime} onEnd={onEnd} />;
  }
  
  if (videoUrl) {
    return <LocalVideoPlayer videoUrl={videoUrl} startTime={startTime} endTime={endTime} onEnd={onEnd} />;
  }

  return <div className="text-red-500">Error: No se ha proporcionado una fuente de video.</div>;
}
