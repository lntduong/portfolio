"use client"

import { useCallback } from "react"

// Simple purely synthesized sounds to avoid assets
export function useSoundEffect() {

    const playHover = useCallback(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05)

        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        oscillator.start()
        oscillator.stop(audioCtx.currentTime + 0.05)
    }, [])

    const playClick = useCallback(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        oscillator.type = "square"
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1)

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1)

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        oscillator.start()
        oscillator.stop(audioCtx.currentTime + 0.1)
    }, [])

    return { playHover, playClick }
}
