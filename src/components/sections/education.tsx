"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextScramble } from "@/components/ui/text-scramble"
import type { Education } from "@prisma/client"

gsap.registerPlugin(ScrollTrigger)

interface EducationProps {
    educationData: Education[]
}

export function Education({ educationData }: EducationProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.fromTo(".reveal-title-edu",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    toggleActions: "play none none reverse"
                }
            }
        )

        gsap.utils.toArray<HTMLElement>(".edu-item").forEach((el) => {
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            )
        })

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="w-full py-24 md:py-40 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <h2 className="reveal-title text-3xl md:text-4xl font-bold mb-20 text-center uppercase tracking-widest">
                    <span className="text-neutral-100 text-glow">
                        <TextScramble duration={1500}>Academic</TextScramble>
                    </span> <span className="text-neutral-600">
                        <TextScramble duration={1500} delay={500}>Background</TextScramble>
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {educationData.length > 0 ? (
                        educationData.map((edu) => (
                            <div key={edu.id} className="edu-item bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 hover:border-neutral-600 transition-colors">
                                <div className="mb-4">
                                    <span className="text-xs font-mono text-neutral-500 block mb-2">
                                        {edu.startDate} - {edu.endDate || "Present"}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-1">{edu.school}</h3>
                                    <p className="text-neutral-400 font-medium">{edu.degree}</p>
                                    {edu.location && <p className="text-sm text-neutral-600 mt-1">{edu.location}</p>}
                                </div>
                                {edu.description && (
                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 text-center text-neutral-500">No education data found.</div>
                    )}
                </div>
            </div>
        </section>
    )
}
