"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextScramble } from "@/components/ui/text-scramble"
import type { Experience, ExperienceProject } from "@prisma/client"

gsap.registerPlugin(ScrollTrigger)

type ExperienceWithProjects = Experience & {
    projects: ExperienceProject[]
}

interface ExperienceProps {
    experienceData: ExperienceWithProjects[]
}

export function Experience({ experienceData }: ExperienceProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {

        // Reveal Title (Triggered by section entry)
        gsap.fromTo(".reveal-title",
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

        const items = gsap.utils.toArray<HTMLElement>(".exp-item")

        items.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0.3, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 60%",
                        end: "bottom 60%",
                        toggleActions: "play reverse play reverse", // Highlight when in center
                        markers: false
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
                        <TextScramble duration={1500}>Career</TextScramble>
                    </span>{" "}
                    <span className="text-neutral-600">
                        <TextScramble duration={1500} delay={500}>History</TextScramble>
                    </span>
                </h2>

                <div className="relative border-l border-neutral-800 ml-0 md:ml-12 space-y-20">
                    {experienceData.length > 0 ? (
                        experienceData.map((exp) => (
                            <div key={exp.id} className="exp-item pl-8 md:pl-12 relative group py-4 transition-colors">
                                {/* Timeline Dot */}
                                <span className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full bg-neutral-700 group-hover:bg-red-500 group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-300" />

                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-12">
                                    {/* Period & Company */}
                                    <div className="text-neutral-500">
                                        <div className="text-sm font-mono mb-1 text-neutral-400">
                                            {exp.startDate} - {exp.endDate || "Present"}
                                        </div>
                                        <div className="font-semibold text-neutral-200">{exp.company}</div>
                                        <div className="text-xs uppercase tracking-wider mt-1 text-neutral-600">{exp.position}</div>
                                        {exp.location && <div className="text-xs text-neutral-700 mt-2">{exp.location}</div>}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4">
                                        <p className="text-neutral-400 leading-relaxed font-light">
                                            {exp.description}
                                        </p>
                                        {exp.projects.length > 0 && (
                                            <div className="mt-6 grid gap-3">
                                                {exp.projects.map((proj) => (
                                                    <div key={proj.id} className="relative pl-4 border-l-2 border-neutral-800 hover:border-neutral-600 transition-colors py-1">
                                                        <h5 className="text-sm font-medium text-neutral-300 mb-1">
                                                            {proj.name}
                                                        </h5>
                                                        <p className="text-sm text-neutral-400 leading-relaxed">
                                                            {proj.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {exp.techStack.map((tech, idx) => (
                                                <span key={idx} className="text-[10px] uppercase border border-neutral-800 px-2 py-0.5 rounded text-neutral-600">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-neutral-500 text-center">No experience data found.</div>
                    )}
                </div>
            </div>
        </section>
    )
}
