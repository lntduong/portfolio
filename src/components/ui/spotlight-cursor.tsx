"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function SpotlightCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        // Initial hide
        gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 })

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power2.out",
                opacity: 1
            })
        }

        const onMouseLeave = () => {
            gsap.to(cursor, { opacity: 0, duration: 0.5 })
        }

        window.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseleave", onMouseLeave)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-40 w-[400px] h-[400px] rounded-full bg-red-500/20 pointer-events-none mix-blend-screen blur-[100px] opacity-0 will-change-transform"
        />
    )
}
