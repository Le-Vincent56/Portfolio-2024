const React = require('react');
const { useState, useEffect, useRef } = React;
const { motion } = require('framer-motion');
const { FontAwesomeIcon } = require('@fortawesome/react-fontawesome');
const { faPlay, faPause, faVolumeHigh, faVolumeLow, faVolumeOff, faVolumeXmark } = require('@fortawesome/free-solid-svg-icons');

const AudioPlayer = ({ track, isPlayerVisible, trackTitle, trackAuthor, imageURL }) => {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingIcon, setPlayingIcon] = useState(null);
    const [volumeIcon, setVolumeIcon] = useState(null);

    useEffect(() => {
        if(track && audioRef.current) {
            audioRef.current.src = track;
            audioRef.current.play();
            setIsPlaying(true);
            setPlayingIcon(faPause);
            checkVolumeIcon(audioRef.current.volume);
        }
    }, [track])

    useEffect(() => {
        if (audioRef.current) {
            const handleLoadedData = () => {
                if (audioRef.current) {
                    setDuration(audioRef.current.duration);
                }
            };

            const handleTimeUpdate = () => {
                if (audioRef.current) { 
                    setCurrentTime(audioRef.current.currentTime);
                }
            };

            audioRef.current.addEventListener('loadeddata', handleLoadedData);
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadeddata', handleLoadedData);
                    audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                }
            };
        }
    }, []);

    const handleScrub = (e) => {
        const value = e.target.value;
        if(audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    }

    const handleVolumeChange = (e) => {
        const value = e.target.value;
        if(audioRef.current) {
            audioRef.current.volume = value;
            setVolume(value);
            checkVolumeIcon(value);
        }
    }

    const checkVolumeIcon = (value) => {
        if(value >= 0.67) {
            setVolumeIcon(faVolumeHigh);
        } else if(value < 0.67 && value >= 0.33) {
            setVolumeIcon(faVolumeLow);
        } else if(value < 0.33 && value >= 0.01) {
            setVolumeIcon(faVolumeOff);
        } else if(value < 0.01) {
            setVolumeIcon(faVolumeXmark);
        }
    }

    const handlePause = (e) => {
        if(audioRef.current) {
            if(isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
                setPlayingIcon(faPlay);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
                setPlayingIcon(faPause);
            }
        }
    }

    return isPlayerVisible ? (
        <motion.div className='audio-player-container' 
        initial={{y: 200}} 
        animate={{y: 0}} 
        exit={{y: 200}}
        >
            <audio ref={audioRef}/>
            <motion.div className='audio-player'>
                <motion.div className='track-info'>
                    <motion.div className='track-info-art'>
                        <motion.img src={imageURL} alt='Thumbnail'/>
                    </motion.div>
                    <motion.div className='track-info-text'>
                        <motion.h1 className='track-title'>{trackTitle}</motion.h1>
                        <motion.h2 className='track-author'>{trackAuthor}</motion.h2>
                    </motion.div>
                </motion.div>

                <motion.div className='track-timeline'>
                    <motion.div className='pause-button'
                    onClick={(e) => handlePause(e)}
                    >
                        <FontAwesomeIcon icon={playingIcon} className='pause-button-icon'/>
                    </motion.div>
                    <motion.div className='time-display'>
                        <motion.span>
                            {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)}
                        </motion.span>
                        <motion.input 
                            type='range' 
                            min='0' 
                            max={duration} 
                            value={currentTime} 
                            className='scrub-slider'
                            style={{ '--value': currentTime, '--max': duration }}
                            onChange={handleScrub}
                        />
                        <motion.span>
                            {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                        </motion.span>
                    </motion.div>
                </motion.div>

                <motion.div className='volume-control'>
                    <FontAwesomeIcon icon={volumeIcon} className='volume-icon'/>
                    <motion.input
                        type='range'
                        min='0'
                        max='1'
                        step='0.01'
                        value={volume}
                        className='volume-slider'
                        style={{ '--value': volume, '--max': 1 }}
                        onChange={handleVolumeChange}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    ) : null
};

module.exports = {
    AudioPlayer
}
