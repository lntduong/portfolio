import Link from "next/link"
import {
    LayoutDashboard,
    User,
    Zap,
    Briefcase,
    FolderGit2,
    GraduationCap,
    Award,
    MessageSquare,
    LogOut
} from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-neutral-950 text-neutral-200">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 border-r border-neutral-800 bg-neutral-900 hidden md:flex flex-col">
                <div className="flex h-14 items-center border-b border-neutral-800 px-6 font-bold tracking-tight">
                    Admin Console
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <div className="pt-4 pb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-2">
                        Content
                    </div>
                    <NavItem href="/admin/about" icon={<User size={18} />} label="About Me" />
                    <NavItem href="/admin/skills" icon={<Zap size={18} />} label="Skills" />
                    <NavItem href="/admin/experience" icon={<Briefcase size={18} />} label="Experience" />
                    <NavItem href="/admin/projects" icon={<FolderGit2 size={18} />} label="Projects" />
                    <NavItem href="/admin/education" icon={<GraduationCap size={18} />} label="Education" />
                    <NavItem href="/admin/certificates" icon={<Award size={18} />} label="Certificates" />
                    <div className="pt-4 pb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider pl-2">
                        System
                    </div>
                    <NavItem href="/admin/contact" icon={<MessageSquare size={18} />} label="Messages" />
                </nav>
                <div className="border-t border-neutral-800 p-4">
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}
