import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (stream) return; // Prevent restarting if already running
    setError(null);
    try {
      // Use simpler video constraints for broader compatibility, especially in sandboxed environments.
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (err: unknown) {
      console.error("Error accessing camera:", err);
      let message = "Não foi possível acessar a câmera. Verifique as permissões do seu navegador.";

      const isTimeoutError = (e: any): boolean => {
        if (e instanceof DOMException && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
          return true;
        }
        if (e instanceof Error && e.message.toLowerCase().includes('timeout')) {
          return true;
        }
        return false;
      };

      if (isTimeoutError(err)) {
        message = "O acesso à câmera demorou muito. Tente recarregar a página e certifique-se de que nenhum outro aplicativo esteja usando a câmera.";
      } else if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            message = "Você negou a permissão para acessar a câmera. Por favor, habilite nas configurações do seu navegador.";
            break;
          case "NotFoundError":
            message = "Nenhuma câmera foi encontrada no seu dispositivo.";
            break;
          case "NotReadableError":
            message = "A câmera não pôde ser lida. Pode estar sendo usada por outro aplicativo ou ocorreu um erro de hardware.";
            break;
          case "OverconstrainedError":
            message = `Sua câmera não suporta as restrições de vídeo necessárias. ${err.message}`;
            break;
          default:
            message = `Erro ao iniciar a câmera: ${err.name} - ${err.message}`;
            break;
        }
      } else if (err instanceof Error) {
        message = `Erro ao iniciar a câmera: ${err.message}`;
      }
      setError(message);
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Effect to handle setting the video source and cleaning up
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    
    // Cleanup function runs when component unmounts or stream changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl.split(',')[1]); // Send base64 data without prefix
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  if (error) {
    return <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {!stream ? (
        <button
          onClick={startCamera}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
        >
          Abrir Câmera
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="flex space-x-4">
            <button
              onClick={capturePhoto}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition"
            >
              Capturar Foto
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition"
            >
              Fechar Câmera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
