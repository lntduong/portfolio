"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial, Float } from "@react-three/drei"
import * as random from "maath/random/dist/maath-random.cjs"

function Stars(props: any) {
    const ref = useRef<any>(null)
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))

    useFrame((state, delta) => {
        if (ref.current) {
            // Slow, rising swirl effect
            ref.current.rotation.x -= delta / 15
            ref.current.rotation.y -= delta / 20
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ea580c" // Orange-600 (Fire Ember)
                    size={0.005} // Slightly larger for embers
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    )
}

function GridOverlay() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial wireframe color="#262626" transparent opacity={0.3} />
        </mesh>
    )
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 -z-10 bg-neutral-950">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
                {/* <GridOverlay /> Optional retro grid */}
            </Canvas>
        </div>
    )
}
