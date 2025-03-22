import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoCallProps {
  appointment: {
    doctor: string;
    type: string;
  };
  onClose: () => void;
}

export default function VideoCall({ appointment, onClose }: VideoCallProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Get user's media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <h3 className="text-xl font-semibold">{appointment.doctor}</h3>
            <p className="text-gray-300">{appointment.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg bg-gray-800"
            />
            <p className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </p>
          </div>

          {/* Remote Video (Placeholder) */}
          <div className="relative">
            <video
              ref={peerVideo}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-gray-800"
            />
            <p className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {appointment.doctor}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              audioEnabled ? 'bg-gray-600' : 'bg-red-600'
            }`}
          >
            {audioEnabled ? (
              <Mic className="text-white" size={24} />
            ) : (
              <MicOff className="text-white" size={24} />
            )}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              videoEnabled ? 'bg-gray-600' : 'bg-red-600'
            }`}
          >
            {videoEnabled ? (
              <Video className="text-white" size={24} />
            ) : (
              <VideoOff className="text-white" size={24} />
            )}
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}