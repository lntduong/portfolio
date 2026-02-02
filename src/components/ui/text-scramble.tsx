"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;':,./<>?"

interface TextScrambleProps {
    children: string
    className?: string
    duration?: number
    delay?: number
}

export function TextScramble({ children, className, duration = 2000, delay = 0 }: TextScrambleProps) {
    const [text, setText] = useState(children)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime

            // Delay start
            if (progress < delay) {
                animationFrame = requestAnimationFrame(animate)
                return
            }

            const activeProgress = progress - delay

            if (activeProgress >= duration) {
                setText(children)
                return
            }

            const ratio = activeProgress / duration
            const length = children.length
            const scrambleLength = Math.floor(length * ratio)

            let result = ""
            for (let i = 0; i < length; i++) {
                if (i < scrambleLength) {
                    result += children[i]
                } else {
                    const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)]
                    result += children[i] === " " ? " " : randomChar
                }
            }

            setText(result)
            animationFrame = requestAnimationFrame(animate)
        }

        // Start animation
        timeoutRef.current = setTimeout(() => {
            animationFrame = requestAnimationFrame(animate)
        }, delay)


        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            cancelAnimationFrame(animationFrame)
        }
    }, [children, duration, delay, isInView])

    return (
        <span ref={ref} className={className}>
            {text}
        </span>
    )
}
