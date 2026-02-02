"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { TextScramble } from "@/components/ui/text-scramble"

export function Contact() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success("Message sent successfully!")
                setFormData({ name: "", email: "", subject: "", message: "" })
            } else {
                toast.error("Failed to send message.")
            }
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="w-full py-24 md:py-40 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">
                        Get in Touch
                    </h2>
                    <h2 className="reveal-title text-3xl md:text-4xl font-bold mb-20 text-center uppercase tracking-widest">
                        <span className="text-neutral-100 text-glow">
                            <TextScramble duration={1500}>Get In</TextScramble>
                        </span> <span className="text-neutral-600">
                            <TextScramble duration={1500} delay={500}>Touch</TextScramble>
                        </span>
                    </h2>
                </div>

                <div className="bg-neutral-900/30 border border-neutral-800 p-8 md:p-12 rounded-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-neutral-400">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-neutral-900/50 border-neutral-800 h-12"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-400">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-neutral-900/50 border-neutral-800 h-12"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-neutral-400">Subject (Optional)</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="bg-neutral-900/50 border-neutral-800 h-12"
                                placeholder="Project Inquiry"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-neutral-400">Message</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="bg-neutral-900/50 border-neutral-800 min-h-[150px] resize-none"
                                placeholder="Tell me about your project..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="mt-20 flex justify-center gap-8 text-neutral-500 text-sm items-center">
                    <MagneticButton strength={0.3} className="p-2">
                        <a href="https://www.linkedin.com/in/lntduong/" className="hover:text-red-500 transition-colors">LinkedIn</a>
                    </MagneticButton>
                    <MagneticButton strength={0.3} className="p-2">
                        <a href="https://github.com/lntduong" className="hover:text-red-500 transition-colors">GitHub</a>
                    </MagneticButton>
                    <MagneticButton strength={0.3} className="p-2">
                        <a href="https://www.facebook.com/lntd.179/" className="hover:text-red-500 transition-colors">Facebook</a>
                    </MagneticButton>
                    <span className="text-neutral-700">|</span>
                    <span className="text-neutral-700">© 2026 By Yang Yang</span>
                </div>
            </div>
        </section>
    )
}
