"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Link as LinkIcon, Github, Star } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"

type Project = {
    id: string
    title: string
    slug: string
    description: string
    content: string | null
    techStack: string[]
    imageUrl: string | null
    images: string[]
    demoUrl: string | null
    githubUrl: string | null
    featured: boolean
    order: number
}

export default function ProjectsPage() {
    const [data, setData] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        content: "",
        techStack: "", // Comma separated for input
        imageUrl: "",
        images: "", // Comma separated
        demoUrl: "",
        githubUrl: "",
        featured: false,
        order: 0
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/projects")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to fetch projects")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return

        try {
            const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Project deleted")
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
            const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects"
            const method = editingId ? "PUT" : "POST"

            const payload = {
                ...formData,
                techStack: formData.techStack.split(",").map(s => s.trim()).filter(Boolean),
                images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                toast.success(editingId ? "Project updated" : "Project created")
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

    const startEdit = (item: Project) => {
        setEditingId(item.id)
        setFormData({
            title: item.title,
            slug: item.slug,
            description: item.description,
            content: item.content || "",
            techStack: item.techStack.join(", "),
            imageUrl: item.imageUrl || "",
            images: item.images.join(", "),
            demoUrl: item.demoUrl || "",
            githubUrl: item.githubUrl || "",
            featured: item.featured,
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
            title: "",
            slug: "",
            description: "",
            content: "",
            techStack: "",
            imageUrl: "",
            images: "",
            demoUrl: "",
            githubUrl: "",
            featured: false,
            order: 0
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <Button onClick={startCreate} className="gap-2 bg-red-600 text-white hover:bg-red-700">
                    <Plus size={16} /> Add Project
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[80px]">Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Tech Stack</TableHead>
                            <TableHead>Status</TableHead>
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
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{item.title}</span>
                                            <span className="text-xs text-neutral-500">{item.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-neutral-400">
                                        {item.techStack.slice(0, 3).join(", ")} {item.techStack.length > 3 && `+${item.techStack.length - 3}`}
                                    </TableCell>
                                    <TableCell>
                                        {item.featured && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-900 bg-yellow-900/30 px-2 py-0.5 text-xs font-semibold text-yellow-500">
                                                <Star size={10} fill="currentColor" /> Featured
                                            </span>
                                        )}
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
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[600px] sm:w-[800px] flex flex-col p-0">
                    <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral-800">
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Project" : "Add Project"}</SheetTitle>
                        <SheetDescription>Showcase your best work.</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <form onSubmit={handleSubmit} className="space-y-6" id="project-form">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-neutral-900 border-neutral-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        className="bg-neutral-900 border-neutral-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="bg-neutral-900 border-neutral-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
                                <Input
                                    id="techStack"
                                    value={formData.techStack}
                                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                    placeholder="React, Next.js, TypeScript..."
                                    className="bg-neutral-900 border-neutral-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="demoUrl">Demo URL</Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                        <Input
                                            id="demoUrl"
                                            value={formData.demoUrl}
                                            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                            className="pl-9 bg-neutral-900 border-neutral-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="githubUrl">GitHub URL</Label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                        <Input
                                            id="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="pl-9 bg-neutral-900 border-neutral-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Full Content/Case Study (Markdown)</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[150px] bg-neutral-900 border-neutral-800 font-mono text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl">Cover Image URL</Label>
                                    <Input
                                        id="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
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

                            <div className="flex items-center space-x-2 rounded-md border border-neutral-800 p-4 bg-neutral-900/50">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(c) => setFormData({ ...formData, featured: !!c })}
                                    className="border-neutral-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                />
                                <label
                                    htmlFor="featured"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Mark as Featured (Show on Homepage)
                                </label>
                            </div>
                        </form>
                    </div>
                    <SheetFooter className="px-6 py-4 border-t border-neutral-800">
                        <SheetClose asChild>
                            <Button variant="outline" type="button" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                        </SheetClose>
                        <Button type="submit" form="project-form" disabled={submitting} className="bg-red-600 text-white hover:bg-red-700 border-none">
                            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
