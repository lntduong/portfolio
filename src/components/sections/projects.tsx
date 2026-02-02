"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Github } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { TextScramble } from "@/components/ui/text-scramble"
import type { Project } from "@prisma/client"

gsap.registerPlugin(ScrollTrigger)

interface ProjectsProps {
    projectsData: Project[]
}

export function Projects({ projectsData }: ProjectsProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Reveal Title (Triggered by section entry)
        gsap.utils.toArray<HTMLElement>(".reveal-title").forEach((el, index) => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        toggleActions: "play none none reverse"
                    }
                }
            )
        })
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="w-full py-24 md:py-40 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className="reveal-title text-3xl md:text-4xl font-bold mb-20 text-center uppercase tracking-widest">
                    <span className="text-neutral-100 text-glow">
                        <TextScramble duration={1500}>Digital</TextScramble>
                    </span> <span className="text-neutral-600">
                        <TextScramble duration={1500} delay={500}>Creations</TextScramble>
                    </span>
                </h2>
                <div className="hidden md:block">
                    {/* Controls if needed */}
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 md:-ml-8">
                        {projectsData.length > 0 ? (
                            projectsData.map((project) => (
                                <CarouselItem key={project.id} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-2/5">
                                    <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 transition-all duration-500 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]">
                                        {/* Image placeholder */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                            style={{ backgroundImage: `url(${project.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'})` }}
                                        />

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <h4 className="text-2xl font-bold text-white mb-2">{project.title}</h4>
                                                <p className="text-neutral-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                                    {project.description}
                                                </p>

                                                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                                                    <div className="flex gap-2">
                                                        {project.techStack.slice(0, 3).map((t, i) => (
                                                            <span key={i} className="text-[10px] uppercase tracking-wider border border-neutral-700 rounded-full px-2 py-1 text-neutral-400">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {project.githubUrl && (
                                                            <Button size="icon" variant="secondary" className="rounded-full h-8 w-8" asChild>
                                                                <Link href={project.githubUrl}><Github size={14} /></Link>
                                                            </Button>
                                                        )}
                                                        {project.demoUrl && (
                                                            <Button size="icon" className="rounded-full h-8 w-8" asChild>
                                                                <Link href={project.demoUrl}><ArrowUpRight size={14} /></Link>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem className="pl-4 md:pl-8 text-neutral-500">No projects found.</CarouselItem>
                        )}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-8 pr-4 md:pr-0">
                        <CarouselPrevious className="static translate-y-0 border-neutral-800 hover:bg-neutral-900 hover:text-white" />
                        <CarouselNext className="static translate-y-0 border-neutral-800 hover:bg-neutral-900 hover:text-white" />
                    </div>
                </Carousel>

            </div>
        </section>
    )
}
