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

  const supported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!supported) {
      console.warn('⚠️ Speech recognition not supported')
      return
    }

    if (recognitionRef.current) {
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()

    recognitionInstance.continuous = false // Auto-stop after speech
    recognitionInstance.interimResults = true
    recognitionInstance.lang = 'en-US'
    recognitionInstance.maxAlternatives = 1

    recognitionInstance.onstart = () => {
      console.log('🎤 Started')
      isStartingRef.current = false
      setIsListening(true)
      setTranscript('')
      setError(null)
    }

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      console.log('📥 Got result!')
      
      let currentTranscript = ''
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        currentTranscript += result[0].transcript
        
        if (result.isFinal) {
          console.log('✅ Final:', result[0].transcript)
        }
      }

      if (currentTranscript) {
        setTranscript(currentTranscript.trim())
        console.log('📝 Transcript:', currentTranscript.trim())
      }
    }

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Error:', event.error)
      isStartingRef.current = false
      
      if (event.error === 'aborted') {
        console.log('⚠️ Aborted')
        return
      }
      
      if (event.error === 'no-speech') {
        setError('No speech detected - try speaking louder')
      } else if (event.error === 'network') {
        setError('Network issue - but might still work')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied')
      } else {
        setError(event.error)
      }
      
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      console.log('🛑 Ended')
      isStartingRef.current = false
      setIsListening(false)
    }

    recognitionInstance.onspeechstart = () => {
      console.log('🗣️ SPEECH!')
      setError(null)
    }

    recognitionRef.current = recognitionInstance

    return () => {
      console.log('🧹 Cleanup')
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
      console.error('❌ No recognition!')
      return
    }

    if (isListening || isStartingRef.current) {
      console.warn('⚠️ Already listening')
      return
    }

    isStartingRef.current = true
    
    setTimeout(() => {
      if (!recognitionRef.current) return
      
      try {
        setTranscript('')
        setError(null)
        recognitionRef.current.start()
        console.log('🚀 Started')
      } catch (error) {
        console.error('❌ Start failed:', error)
        isStartingRef.current = false
        setIsListening(false)
        setError('Failed to start')
      }
    }, 100)
  }, [isListening])

  const stopListening = useCallback(() => {
    console.log('⏹️ STOP')
    
    if (!recognitionRef.current) {
      console.error('❌ No recognition!')
      return
    }

    if (!isListening) {
      console.warn('⚠️ Not listening')
      return
    }

    try {
      recognitionRef.current.stop()
      console.log('⏸️ Stopping...')
    } catch (error) {
      console.error('❌ Stop failed:', error)
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    console.log('🔄 Reset')
    setTranscript('')
    setError(null)
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
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
    start(): void
    stop(): void
    abort(): void
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition
    new(): SpeechRecognition
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number
    results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionResultList {
    length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    isFinal: boolean
    length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
}

export {}