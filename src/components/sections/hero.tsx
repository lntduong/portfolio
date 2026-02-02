"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { HeroScene } from "@/components/3d/hero-scene"
import { Button } from "@/components/ui/button"
import { ArrowDown, Download } from "lucide-react"
import { HeroCode } from "@/components/sections/hero-code"
import { MagneticButton } from "@/components/ui/magnetic-button"

import type { About } from "@prisma/client"

interface HeroProps {
    aboutData: About[]
}

export function Hero({ aboutData }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Get the first about item for the hero intro, or fallback
    const heroIntro = aboutData.length > 0 ? aboutData[0].content : "I craft high-performance web experiences that blend systematic architecture with cinematic beauty."

    useGSAP(() => {
        const tl = gsap.timeline()

        // Initial State
        gsap.set(".hero-text", { y: 100, opacity: 0 })
        gsap.set(".hero-sub", { opacity: 0 })
        gsap.set(".hero-btn", { opacity: 0, y: 20 })
        gsap.set(".hero-code", { opacity: 0, x: 50 })

        // Animation
        tl.to(".hero-text", {
            y: 0,
            opacity: 1,
            duration: 1.5,
            stagger: 0.2,
            ease: "power4.out",
        })
            .to(".hero-sub", {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out",
            }, "-=1")
            .to(".hero-btn", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=1")
            .to(".hero-code", {
                opacity: 1,
                x: 0,
                duration: 1.5,
                ease: "power3.out"
            }, "-=1.2")

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center px-6 pt-24 pb-12">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <HeroScene />
            </div>

            <div className="z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Content */}
                <div className="space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                        <h2 className="hero-text text-sm md:text-xl font-medium tracking-[0.2em] text-neutral-400 uppercase">
                            Software Engineer & Creative Developer
                        </h2>
                        <div className="overflow-visible">
                            <h1 className="hero-text text-4xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                Building Digital <br />
                                <span className="text-neutral-500">Masterpieces</span>
                            </h1>
                        </div>
                    </div>

                    <p className="hero-sub text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        {heroIntro}
                    </p>

                    <div className="hero-btn pt-4 flex justify-center lg:justify-start">
                        <MagneticButton strength={0.4}>
                            <Button size="lg" className="rounded-full px-8 py-6 text-base bg-white text-black hover:bg-neutral-200 transition-colors duration-300" asChild>
                                <a href="/resume/Fullstack-LeNguyenThaiDuong.pdf" download="LeNguyenThaiDuong_FullStack_Resume.pdf" target="_blank">
                                    Download CV <Download className="ml-2 w-4 h-4" />
                                </a>
                            </Button>
                        </MagneticButton>
                    </div>
                </div>

                {/* Right: Code Window */}
                <div className="hero-code hidden lg:block perspective-1000">
                    <HeroCode />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Scroll</span>
                <ArrowDown className="w-5 h-5 text-red-500/80 animate-bounce" />
            </div>
        </section>
    )
}
