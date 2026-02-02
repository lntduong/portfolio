"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null)
    const counterRef = useRef<HTMLDivElement>(null)
    const [count, setCount] = useState(0)

    useGSAP(() => {
        const tl = gsap.timeline()

        // Counter Animation
        const counter = { val: 0 }
        tl.to(counter, {
            val: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                setCount(Math.floor(counter.val))
            }
        })

            // Progress Bar & Text Exit
            .to(".loader-content", {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut"
            })

            // Curtain Lift (Split or Slide Up)
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            })
            .set(containerRef.current, { display: "none" })

    }, { scope: containerRef })

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-white overflow-hidden"
        >
            <div className="loader-content flex flex-col items-center gap-4">
                {/* Counter */}
                <div
                    ref={counterRef}
                    className="text-8xl md:text-9xl font-bold font-mono tracking-tighter text-red-600 text-glow"
                >
                    {count}%
                </div>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-neutral-900 rounded-full overflow-hidden mt-4">
                    <div
                        className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                        style={{ width: `${count}%` }}
                    />
                </div>

                <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] animate-pulse mt-2">
                    Initializing System
                </p>
            </div>

            {/* Background Noise/Grain if desired, reused from globals */}
            <div className="fixed inset-0 pointer-events-none bg-noise opacity-10 mix-blend-soft-light"></div>
        </div>
    )
}
