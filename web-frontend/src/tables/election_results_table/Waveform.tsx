import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';

type WavesProps = {
    audio: any;
    soundSpeech: any;
    isPlaying: boolean;
    setIsPlaying: (e: boolean) => void;
}

const Waveform = ({ audio, isPlaying, soundSpeech, setIsPlaying }: WavesProps) => {
    let containerRef = useRef();

    let waveSurferRef = useRef({
        isPlaying: () => false,
    });

    useEffect(() => {
        let waveSurfer = WaveSurfer.create({
            container: containerRef.current,
            responsive: true,
            barWidth: 1.5,
            barHeight: 0.5,
            cursorWidth: 0,
        });

        waveSurfer.load(audio);
        waveSurfer.on('ready', () => {
            waveSurferRef.current = waveSurfer;
        });

        waveSurfer.on('finish', () => {
            setIsPlaying(false);
        });

        return () => {
            setIsPlaying(soundSpeech.playing());
            waveSurfer.destroy();
        };
    }, [audio]);

    const togglePlayPause = () => {
        waveSurferRef.current.playPause();
        setIsPlaying(true);
    };

    return (
        <div className="grid grid-cols-[40px,1fr] sm:grid-cols-[50px,1fr] md:grid-cols-[60px,0.8fr] items-center gap-2 p-0 m-0">
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-none bg-white p-0 m-0"
          type="button"
        >
          {isPlaying ? <FaPauseCircle className="text-3xl sm:text-4xl md:text-5xl" /> : <FaPlayCircle className="text-3xl sm:text-4xl md:text-5xl" />}
        </button>
        <div ref={containerRef} className="p-0 m-0"></div>
      </div>
    );
};

export default Waveform;
