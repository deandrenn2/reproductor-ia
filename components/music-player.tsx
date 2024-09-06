'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react'

// Definimos una interfaz para nuestras canciones
interface Song {
  title: string;
  artist: string;
  src: string;
}

// Lista de canciones de ejemplo (reemplaza con tus propias canciones)
const songList: Song[] = [
  { title: "Canción 1", artist: "Artista 1", src: "/path/to/song1.mp3" },
  { title: "Canción 2", artist: "Artista 2", src: "/path/to/song2.mp3" },
  { title: "Canción 3", artist: "Artista 3", src: "/path/to/song3.mp3" },
]

export function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songList[currentSongIndex]

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSongIndex])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songList.length)
  }

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songList.length) % songList.length)
  }

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const onSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNextSong}
      />
      <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
      <p className="text-muted-foreground mb-4">{currentSong.artist}</p>
      <div className="flex justify-between items-center mb-4">
        <span>{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={onSliderChange}
          className="w-full mx-4"
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="flex justify-center items-center space-x-4">
        <Button variant="outline" size="icon" onClick={playPreviousSong}>
          <SkipBackIcon className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon" onClick={togglePlayPause}>
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={playNextSong}>
          <SkipForwardIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}