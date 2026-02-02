"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ExternalLink, Award } from "lucide-react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"
import type { Certificate } from "@prisma/client"

gsap.registerPlugin(ScrollTrigger)

interface CertificatesProps {
    certificatesData: Certificate[]
}

export function Certificates({ certificatesData }: CertificatesProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.fromTo(".reveal-title-cert",
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

        gsap.fromTo(".cert-item",
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".cert-grid",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        )
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="w-full py-24 md:py-40 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <h2 className="reveal-title text-3xl md:text-4xl font-bold mb-20 text-center uppercase tracking-widest">
                    <span className="text-neutral-100 text-glow">
                        <TextScramble duration={1500}>Professional</TextScramble>
                    </span> <span className="text-neutral-600">
                        <TextScramble duration={1500} delay={500}>Certificates</TextScramble>
                    </span>
                </h2>

                <div className="cert-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificatesData.length > 0 ? (
                        certificatesData.map((cert) => (
                            <Link
                                key={cert.id}
                                href={cert.url || "#"}
                                target={cert.url ? "_blank" : "_self"}
                                className={`cert-item group flex items-start gap-4 p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900 transition-all ${!cert.url && 'cursor-default pointer-events-none'}`}
                            >
                                <div className="p-3 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                                    <Award className="w-6 h-6 text-neutral-400 group-hover:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-neutral-200 font-semibold group-hover:text-white transition-colors line-clamp-2">
                                        {cert.name}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-neutral-500">{cert.issuer}</span>
                                        <span className="text-xs text-neutral-600 font-mono">{cert.date}</span>
                                    </div>
                                </div>
                                {cert.url && (
                                    <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                                )}
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-neutral-500">No certificates found.</div>
                    )}
                </div>
            </div>
        </section>
    )
}
