"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
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

type Skill = {
    id: string
    name: string
    category: string
    level: number
    icon: string | null
    order: number
}

export default function SkillsPage() {
    const [data, setData] = useState<Skill[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        category: "Frontend",
        level: 80,
        icon: "",
        order: 0
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/skills")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to fetch skills")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this skill?")) return

        try {
            const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Skill deleted")
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
            const url = editingId ? `/api/admin/skills/${editingId}` : "/api/admin/skills"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success(editingId ? "Skill updated" : "Skill created")
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

    const startEdit = (item: Skill) => {
        setEditingId(item.id)
        setFormData({
            name: item.name,
            category: item.category,
            level: item.level,
            icon: item.icon || "",
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
        setFormData({ name: "", category: "Frontend", level: 80, icon: "", order: 0 })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                <Button onClick={startCreate} className="gap-2 bg-red-600 text-white hover:bg-red-700">
                    <Plus size={16} /> Add Skill
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[80px]">Order</TableHead>
                            <TableHead>Skill Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Level (%)</TableHead>
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
                                    No skills found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-300">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 rounded-full bg-neutral-800">
                                                <div
                                                    className="h-full rounded-full bg-neutral-100"
                                                    style={{ width: `${item.level}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-neutral-500">{item.level}%</span>
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
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[400px] sm:w-[540px] p-6">
                    <SheetHeader>
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Skill" : "Add Skill"}</SheetTitle>
                        <SheetDescription>Manage your technical skills and proficiency.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Skill Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="React, Node.js..."
                                    className="bg-neutral-900 border-neutral-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Frontend, Backend..."
                                    className="bg-neutral-900 border-neutral-800"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="level">Proficiency (0-100)</Label>
                                <Input
                                    id="level"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon Identifier (Optional)</Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="lucide-react icon name or svg"
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>

                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" disabled={submitting} className="bg-red-600 text-white hover:bg-red-700 border-none">
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
