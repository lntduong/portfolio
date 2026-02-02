"use client"

import { useEffect, useState } from "react"
import { Trash2, Loader2, Mail, CheckCircle, Circle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Contact = {
    id: string
    name: string
    email: string
    subject: string | null
    message: string
    read: boolean
    createdAt: string
}

export default function ContactPage() {
    const [data, setData] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/contact")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to fetch messages")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return

        try {
            const res = await fetch(`/api/admin/contact/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Message deleted")
                fetchData()
            } else {
                toast.error("Failed to delete")
            }
        } catch (error) {
            toast.error("Error deleting")
        }
    }

    const toggleRead = async (item: Contact) => {
        try {
            const res = await fetch(`/api/admin/contact/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: !item.read })
            })

            if (res.ok) {
                setData(data.map(d => d.id === item.id ? { ...d, read: !item.read } : d))
            }
        } catch (error) {
            toast.error("Error updating status")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message Preview</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                                    No messages found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className={`border-neutral-800 hover:bg-neutral-900/50 ${!item.read ? 'bg-neutral-900/30' : ''}`}>
                                    <TableCell>
                                        <button onClick={() => toggleRead(item)} title={item.read ? "Mark unread" : "Mark read"}>
                                            {item.read ? (
                                                <CheckCircle size={18} className="text-neutral-600" />
                                            ) : (
                                                <Circle size={18} className="text-blue-500 fill-blue-500/10" />
                                            )}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-neutral-400 text-xs">
                                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{item.name}</span>
                                            <span className="text-xs text-neutral-500">{item.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.subject || "(No Subject)"}</TableCell>
                                    <TableCell className="max-w-[300px] truncate text-neutral-400">
                                        {item.message}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
