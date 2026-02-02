import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Certificates | Admin",
    description: "Manage Certificates",
}

export default function CertificatesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
