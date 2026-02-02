"use client"

import { useEffect } from "react"
import { useSoundEffect } from "@/hooks/use-sound-effect"

export function SoundManager() {
    const { playHover, playClick } = useSoundEffect()

    useEffect(() => {
        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a') || target.closest('button')) {
                playHover()
            }
        }

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a') || target.closest('button')) {
                playClick()
            }
        }

        document.addEventListener('mouseenter', handleMouseEnter, true) // Capture phase
        document.addEventListener('click', handleClick, true)

        return () => {
            document.removeEventListener('mouseenter', handleMouseEnter, true)
            document.removeEventListener('click', handleClick, true)
        }
    }, [playHover, playClick])

    return null
}
