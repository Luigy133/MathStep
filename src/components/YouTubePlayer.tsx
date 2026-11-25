import React from 'react';

interface YouTubePlayerProps {
  youtubeId: string;
  startTime: number;
  endTime: number;
  onEnd: () => void;
}

export default function YouTubePlayer({ youtubeId, startTime, endTime, onEnd }: YouTubePlayerProps) {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
      <p className="text-gray-600">YouTube Player (próximamente: ID {youtubeId})</p>
    </div>
  );
}
