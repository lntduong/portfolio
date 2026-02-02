"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Award, ExternalLink, Calendar } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Certificate = {
    id: string
    name: string
    issuer: string
    date: string
    url: string | null
    order: number
}

export default function CertificatesPage() {
    const [data, setData] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        issuer: "",
        date: "",
        url: "",
        order: 0
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/certificates")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to load certificates")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this certificate?")) return

        try {
            const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Deleted successfully")
                fetchData()
            } else {
                toast.error("Failed to delete")
            }
        } catch (error) {
            toast.error("Error deleting")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = editingId ? `/api/admin/certificates/${editingId}` : "/api/admin/certificates"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success(editingId ? "Updated successfully" : "Created successfully")
                setIsOpen(false)
                fetchData()
                resetForm()
            } else {
                toast.error("Failed to save")
            }
        } catch (error) {
            toast.error("Error saving")
        } finally {
            setSubmitting(false)
        }
    }

    const startEdit = (item: Certificate) => {
        setEditingId(item.id)
        setFormData({
            name: item.name,
            issuer: item.issuer,
            date: item.date,
            url: item.url || "",
            order: item.order
        })
        setIsOpen(true)
    }

    const startCreate = () => {
        resetForm()
        setIsOpen(true)
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({
            name: "",
            issuer: "",
            date: "",
            url: "",
            order: 0
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
                <Button onClick={startCreate} className="gap-2">
                    <Plus size={16} /> Add Certificate
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900 text-neutral-400">
                            <TableHead className="w-[80px] text-neutral-400">Order</TableHead>
                            <TableHead className="text-neutral-400">Certificate Name</TableHead>
                            <TableHead className="text-neutral-400">Issuer</TableHead>
                            <TableHead className="text-neutral-400">Date</TableHead>
                            <TableHead className="text-right text-neutral-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-neutral-500">
                                    No certificates found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-neutral-200">{item.name}</span>
                                            {item.url && (
                                                <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                                    View Credential <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <Award size={12} /> {item.issuer}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} /> {item.date}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[400px] p-6">
                    <SheetHeader>
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Certificate" : "Add Certificate"}</SheetTitle>
                        <SheetDescription>Professional certifications.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label>Certificate Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Issuer / Organization</Label>
                            <Input
                                value={formData.issuer}
                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                required
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date (Month Year)</Label>
                            <Input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="Dec 2023" required className="bg-neutral-900 border-neutral-800" />
                        </div>

                        <div className="space-y-2">
                            <Label>Credential URL (Optional)</Label>
                            <Input
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://..."
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" disabled={submitting} className="bg-white text-black hover:bg-neutral-200 border-none">
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
