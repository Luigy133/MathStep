export default function BrandIntro() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-black">
      <video 
        controls 
        className="max-w-full max-h-screen"
        src="/assets/Vd1_LaRectaNum.mp4"
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
  );
}
