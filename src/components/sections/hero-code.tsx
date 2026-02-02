"use client"

import { useEffect, useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

const codeSnippet = `const engineer = {
  name: "Le Nguyen Thai Duong",
  role: "Senior Full Stack Engineer",
  traits: [
    "System Architecture",
    "Creative Problem Solving", 
    "High Performance"
  ],
  stack: {
    frontend: ["Next.js", "React"],
    backend: ["Node.js", "PostgreSQL", "Redis"],
    devops: ["Docker", "AWS", "CI/CD"]
  },
  build: async () => {
    const vision = await design();
    return ship(vision);
  }
};`

export function HeroCode() {
    const [displayedCode, setDisplayedCode] = useState("")
    const [isTyping, setIsTyping] = useState(true)

    useEffect(() => {
        let index = 0
        // Adjust speed as needed
        const intervalId = setInterval(() => {
            if (index >= codeSnippet.length) {
                clearInterval(intervalId)
                setIsTyping(false)
                return
            }

            const char = codeSnippet.charAt(index)
            setDisplayedCode((prev) => prev + char)
            index++
        }, 40) // 40ms per char

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="w-full max-w-lg mx-auto md:ml-auto md:mr-0 perspective-1000">
            <div className="relative bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-neutral-800 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-500 ease-out preserve-3d">
                {/* Window Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-neutral-700">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="ml-4 text-xs text-neutral-400 font-mono">dev_profile.ts</div>
                </div>

                {/* Code Area */}
                <div className="p-6 overflow-x-auto min-h-[300px]">
                    <Highlight
                        theme={themes.vsDark}
                        code={displayedCode}
                        language="typescript"
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre style={style} className={`${className} text-sm font-mono leading-relaxed`}>
                                {tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line })}>
                                        <span className="text-neutral-600 select-none mr-4 text-xs w-4 inline-block text-right">{i + 1}</span>
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token })} />
                                        ))}
                                    </div>
                                ))}
                                {isTyping && <span className="animate-pulse inline-block w-2 h-4 bg-blue-400 align-middle ml-1" />}
                            </pre>
                        )}
                    </Highlight>
                </div>
            </div>
        </div>
    )
}
