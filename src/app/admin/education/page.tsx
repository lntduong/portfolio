"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, GraduationCap, MapPin, Calendar } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

type Education = {
    id: string
    degree: string
    school: string
    location: string | null
    startDate: string
    endDate: string | null
    description: string | null
    order: number
}

export default function EducationPage() {
    const [data, setData] = useState<Education[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        order: 0
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/education")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to load education")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this entry?")) return

        try {
            const res = await fetch(`/api/admin/education/${id}`, { method: "DELETE" })
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
            const url = editingId ? `/api/admin/education/${editingId}` : "/api/admin/education"
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

    const startEdit = (item: Education) => {
        setEditingId(item.id)
        setFormData({
            degree: item.degree,
            school: item.school,
            location: item.location || "",
            startDate: item.startDate,
            endDate: item.endDate || "",
            description: item.description || "",
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
            degree: "",
            school: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            order: 0
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Education</h1>
                <Button onClick={startCreate} className="gap-2">
                    <Plus size={16} /> Add Entry
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[80px]">Order</TableHead>
                            <TableHead>Degree & School</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Location</TableHead>
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
                                    No education records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-neutral-200">{item.degree}</span>
                                            <span className="text-sm text-neutral-400 flex items-center gap-1">
                                                <GraduationCap size={12} /> {item.school}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} /> {item.startDate} - {item.endDate || "Present"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-400">
                                        {item.location && <div className="flex items-center gap-1"><MapPin size={12} /> {item.location}</div>}
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
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Education" : "Add Education"}</SheetTitle>
                        <SheetDescription>Academic background.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label>Degree / Major</Label>
                            <Input
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                required
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>School / University</Label>
                            <Input
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                required
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} placeholder="2016" required className="bg-neutral-900 border-neutral-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} placeholder="2020" className="bg-neutral-900 border-neutral-800" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-neutral-900 border-neutral-800"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-neutral-900 border-neutral-800 min-h-[100px]"
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
                                <Button variant="outline" type="button" className="border-neutral-800 hover:bg-neutral-900">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}
