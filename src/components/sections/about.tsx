"use client"

import { useRef, useMemo } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import { Code, Server, Database, Layout, Smartphone, Globe, Cloud, Cpu, Terminal, Layers } from "lucide-react"
import { TextScramble } from "@/components/ui/text-scramble"
import type { About, Skill } from "@prisma/client"

gsap.registerPlugin(ScrollTrigger)

interface AboutProps {
    aboutData: About[]
    skillsData: Skill[]
}

const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes('front')) return <Layout className="w-4 h-4 text-blue-400" />
    if (lower.includes('back')) return <Server className="w-4 h-4 text-green-400" />
    if (lower.includes('data')) return <Database className="w-4 h-4 text-yellow-400" />
    if (lower.includes('mobile')) return <Smartphone className="w-4 h-4 text-purple-400" />
    if (lower.includes('web')) return <Globe className="w-4 h-4 text-cyan-400" />
    if (lower.includes('cloud') || lower.includes('devops')) return <Cloud className="w-4 h-4 text-sky-400" />
    if (lower.includes('lang')) return <Code className="w-4 h-4 text-pink-400" />
    if (lower.includes('tool')) return <Terminal className="w-4 h-4 text-orange-400" />
    return <Layers className="w-4 h-4 text-neutral-400" />
}

export function About({ aboutData, skillsData }: AboutProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Group skills by category
    const skillsByCategory = useMemo(() => {
        const grouped: Record<string, Skill[]> = {}
        skillsData.forEach(skill => {
            if (!grouped[skill.category]) {
                grouped[skill.category] = []
            }
            grouped[skill.category].push(skill)
        })
        return Object.entries(grouped)
    }, [skillsData])

    useGSAP(() => {
        // Reveal Title (Triggered by Section entry - appears earlier)
        gsap.utils.toArray<HTMLElement>(".reveal-title").forEach((el, index) => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1, // distinct delay for title lines
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current, // Trigger based on the whole section
                        start: "top bottom", // Start IMMEDIATELY when section top hits viewport bottom
                        toggleActions: "play none none reverse"
                    }
                }
            )
        })

        // Reveal Content (Triggered by individual element entry - normal flow)
        gsap.utils.toArray<HTMLElement>(".reveal-content").forEach((el) => {
            gsap.fromTo(el,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 95%", // Slightly earlier than bottom
                        toggleActions: "play none none reverse"
                    }
                }
            )
        })

        // Stagger skills
        gsap.fromTo(".skill-item",
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: "top 85%",
                }
            }
        )

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

                {/* Title / Heading Side */}
                <div className="md:col-span-5 relative">
                    <div className="sticky top-24">
                        <h2 className="reveal-title text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">
                            <TextScramble duration={1000}>About Me</TextScramble>
                        </h2>
                        <h3 className="reveal-title text-4xl md:text-6xl font-bold text-neutral-100 leading-tight">
                            Architecting <br />
                            <span className="text-neutral-100 text-glow">
                                <TextScramble duration={1500} delay={200}>Digital</TextScramble>
                            </span> <br />
                            <span className="text-neutral-600">
                                <TextScramble duration={1500} delay={700}>Refinement.</TextScramble>
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:col-span-7 space-y-20">
                    {/* Bio */}
                    <div className="space-y-6 text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
                        {aboutData.length > 1 ? (
                            aboutData.slice(1).map((about) => (
                                <p key={about.id} className="reveal-content">
                                    {about.content}
                                </p>
                            ))
                        ) : (
                            <p className="reveal-content">
                                {/* First paragraph is in Hero, no other content available */}
                            </p>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="space-y-8">
                        <hr className="border-neutral-800" />
                        <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {skillsByCategory.map(([category, skills]) => (
                                <div key={category} className="space-y-4">
                                    <h4 className="reveal-content text-sm font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                                        {getCategoryIcon(category)}
                                        {category}
                                    </h4>
                                    <ul className="space-y-2">
                                        {skills.map((skill) => (
                                            <li key={skill.id} className="skill-item text-neutral-500 hover:text-white transition-colors cursor-default">
                                                {skill.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
