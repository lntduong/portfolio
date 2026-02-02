"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ScrollProgress() {
    const progressRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const progressBar = progressRef.current
        if (!progressBar) return

        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.1
            }
        })
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none mix-blend-difference">
            <div
                ref={progressRef}
                className="w-full h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] origin-left scale-x-0"
            />
        </div>
    )
}
