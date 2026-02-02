export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-neutral-400">Total Projects</h3>
                    </div>
                    <div className="text-2xl font-bold">--</div>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-neutral-400">Total Skills</h3>
                    </div>
                    <div className="text-2xl font-bold">--</div>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-neutral-400">Messages</h3>
                    </div>
                    <div className="text-2xl font-bold">--</div>
                </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="text-sm text-neutral-400">
                    Manage your content from the sidebar.
                </div>
            </div>
        </div>
    )
}
