"use client"

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Surah {
  id: number
  name: string
  englishName: string
  numberOfAyahs: number
}

interface Recitation {
  audio: string
}

export default function QuranPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0)
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [liveListeners, setLiveListeners] = useState(0)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    fetch('/api/chapters')
      .then(response => response.json())
      .then(data => setSurahs(data.chapters))

    // Setup WebSocket connection
    ws.current = new WebSocket(`ws://${window.location.host}`)
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setLiveListeners(data.listeners)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (surahs.length > 0) {
      loadAudio(surahs[currentSurahIndex].id)
    }
  }, [currentSurahIndex, surahs])

  const loadAudio = (surahId: number) => {
    fetch(`/api/recitations/${surahId}`)
      .then(response => response.json())
      .then((data: { audio_file: Recitation }) => {
        if (audio) {
          audio.pause()
        }
        const newAudio = new Audio(data.audio_file.audio)
        newAudio.volume = volume
        setAudio(newAudio)
        setIsPlaying(false)
      })
  }

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0])
    if (audio) {
      audio.volume = newVolume[0]
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed" style={{backgroundImage: "url('/images/quran-background.jpg')"}}>
      <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white bg-opacity-90 backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#8B4513] font-arabic">القرآن الكريم</h1>
        <div className="flex items-center justify-center mb-4 text-[#8B4513]">
          <Users className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{liveListeners} people tuned in</span>
        </div>
        {surahs.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-xl text-[#8B4513]">Now Playing:</p>
            <p className="text-2xl font-semibold text-[#8B4513]">{surahs[currentSurahIndex].englishName}</p>
            <p className="text-lg font-arabic text-[#D2691E]">{surahs[currentSurahIndex].name}</p>
            <p className="text-sm text-[#CD853F]">Ayahs: {surahs[currentSurahIndex].numberOfAyahs}</p>
          </div>
        )}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={togglePlayPause} 
            size="lg" 
            className="bg-[#D2691E] hover:bg-[#CD853F] text-white rounded-full w-16 h-16 flex items-center justify-center"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
        <div className="flex items-center mb-4">
          <Volume2 className="h-5 w-5 mr-2 text-[#8B4513]" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
        <ScrollArea className="h-48 rounded-md border border-[#D2691E] p-4 bg-white bg-opacity-50">
          {surahs.map((surah, index) => (
            <div
              key={surah.id}
              className={`p-2 cursor-pointer ${
                index === currentSurahIndex 
                  ? 'bg-[#D2691E] text-white' 
                  : 'hover:bg-[#f7e9d7] text-[#8B4513]'
              }`}
              onClick={() => setCurrentSurahIndex(index)}
            >
              <span className="font-arabic">{surah.name}</span> - {surah.englishName}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}