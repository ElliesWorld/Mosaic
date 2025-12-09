import { useState, useEffect, useCallback, useRef } from 'react'

interface VoiceRecognitionHook {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  supported: boolean
  resetTranscript: () => void
  error: string | null
}

export function useVoiceRecognition(): VoiceRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isStartingRef = useRef(false)
  const hasResultRef = useRef(false)

  const supported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!supported) {
      console.warn('⚠️ Speech recognition not supported')
      return
    }

    console.log('🎙️ Initializing speech recognition...')

    if (recognitionRef.current) {
      return
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onstart = () => {
        console.log('🎤 Started listening')
        isStartingRef.current = false
        hasResultRef.current = false
        setIsListening(true)
        setTranscript('')
        setError(null)
      }

      recognitionInstance.onresult = (event: any) => {
        console.log('📥 Got result!')
        hasResultRef.current = true
        
        let currentTranscript = ''
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          currentTranscript += result[0].transcript
          
          if (result.isFinal) {
            console.log('✅ Final:', result[0].transcript)
          }
        }

        if (currentTranscript) {
          const trimmed = currentTranscript.trim()
          setTranscript(trimmed)
          console.log('📝 Transcript:', trimmed)
          setError(null)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('❌ Error:', event.error)
        isStartingRef.current = false
        
        if (hasResultRef.current && (event.error === 'network' || event.error === 'aborted')) {
          console.log('⚠️ Ignoring error after results')
          return
        }
        
        if (event.error === 'aborted') {
          return
        }
        
        if (event.error === 'no-speech') {
          setError('No speech detected')
        } else if (event.error === 'network') {
          setError('Connection issue')
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied')
        } else {
          setError(`Error: ${event.error}`)
        }
        
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        console.log('🛑 Ended')
        isStartingRef.current = false
        setIsListening(false)
      }

      recognitionInstance.onspeechstart = () => {
        console.log('🗣️ Speech!')
        hasResultRef.current = true
        setError(null)
      }

      recognitionRef.current = recognitionInstance
      console.log('✅ Speech recognition ready')

    } catch (err) {
      console.error('❌ Failed to initialize:', err)
      setError('Failed to initialize')
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          // Ignore
        }
        recognitionRef.current = null
      }
    }
  }, [supported])

  const startListening = useCallback(() => {
    console.log('▶️ START')
    
    if (!recognitionRef.current) {
      console.error('❌ No recognition')
      return
    }

    if (isListening || isStartingRef.current) {
      return
    }

    isStartingRef.current = true
    hasResultRef.current = false
    
    setTimeout(() => {
      if (!recognitionRef.current) {
        isStartingRef.current = false
        return
      }
      
      try {
        setTranscript('')
        setError(null)
        recognitionRef.current.start()
      } catch (error: any) {
        console.error('❌ Start failed:', error)
        isStartingRef.current = false
        setIsListening(false)
        setError(`Failed: ${error.message}`)
      }
    }, 200)
  }, [isListening])

  const stopListening = useCallback(() => {
    console.log('⏹️ STOP')
    
    if (!recognitionRef.current || !isListening) {
      return
    }

    try {
      recognitionRef.current.stop()
    } catch (error: any) {
      console.error('❌ Stop failed:', error)
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
    hasResultRef.current = false
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    supported,
    resetTranscript,
    error,
  }
}

// Type definitions
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export {}