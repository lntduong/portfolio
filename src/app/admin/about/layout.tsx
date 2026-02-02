import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Me | Admin",
    description: "Manage About section content",
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
