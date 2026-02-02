"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

interface MagneticButtonProps {
    children: React.ReactNode
    strength?: number // How strong the pull is (default: 0.5)
    className?: string
}

export function MagneticButton({ children, strength = 0.5, className = "" }: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const { height, width, left, top } = element.getBoundingClientRect()

            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)

            gsap.to(element, {
                x: x * strength,
                y: y * strength,
                duration: 1,
                ease: "power4.out"
            })
        }

        const onMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            })
        }

        element.addEventListener("mousemove", onMouseMove)
        element.addEventListener("mouseleave", onMouseLeave)

        return () => {
            element.removeEventListener("mousemove", onMouseMove)
            element.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [strength])

    return (
        <div ref={ref} className={`inline-block ${className}`}>
            {children}
        </div>
    )
}
