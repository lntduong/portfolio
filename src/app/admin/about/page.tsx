"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type About = {
    id: string
    key: string
    title: string
    content: string
    order: number
}

export default function AboutPage() {
    const [data, setData] = useState<About[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        key: "",
        title: "",
        content: "",
        order: 0
    })
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/about")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return

        try {
            const res = await fetch(`/api/admin/about/${id}`, { method: "DELETE" })
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
            const url = editingId ? `/api/admin/about/${editingId}` : "/api/admin/about"
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

    const startEdit = (item: About) => {
        setEditingId(item.id)
        setFormData({
            key: item.key,
            title: item.title || "",
            content: item.content,
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
        setFormData({ key: "", title: "", content: "", order: 0 })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">About Sections</h1>
                <Button onClick={startCreate} className="gap-2">
                    <Plus size={16} /> Add New
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[100px]">Order</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Content Preview</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">{item.key}</TableCell>
                                    <TableCell>{item.title || "-"}</TableCell>
                                    <TableCell className="max-w-[300px] truncate text-neutral-400">
                                        {item.content}
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
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[400px] sm:w-[540px] p-6">
                    <SheetHeader>
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Section" : "New Section"}</SheetTitle>
                        <SheetDescription>
                            {editingId ? "Update existing about section details." : "Add a new block to your about page."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="key">Key (Unique Identifier)</Label>
                            <Input
                                id="key"
                                placeholder="e.g., intro, philosophy"
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                required
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title (Optional)</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Who I Am"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Markdown supported..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                className="min-h-[200px] bg-neutral-900 border-neutral-800 font-mono text-sm"
                            />
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" disabled={submitting} className="bg-white text-black hover:bg-neutral-200 border-none">
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
