"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, Briefcase, Calendar, MapPin, ChevronDown, ChevronRight } from "lucide-react"
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Types
type Experience = {
    id: string
    position: string
    company: string
    location: string | null
    startDate: string
    endDate: string | null
    description: string
    techStack: string[]
    order: number
    projects: ExperienceProject[]
}

type ExperienceProject = {
    id: string
    name: string
    description: string
    technologies: string[]
    teamSize: number
    responsibilities: string[]
    order: number
    experienceId: string
}

export default function ExperiencePage() {
    const [data, setData] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Experience Form State
    const [formData, setFormData] = useState({
        position: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        techStack: "",
        order: 0
    })

    // Project Dialog State
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    const [currentExperienceId, setCurrentExperienceId] = useState<string | null>(null)
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
    const [projectFormData, setProjectFormData] = useState({
        name: "",
        description: "",
        technologies: "",
        teamSize: 1,
        responsibilities: "", // newline separated
        order: 0
    })

    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/experience")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (error) {
            toast.error("Failed to load experience")
        } finally {
            setLoading(false)
        }
    }

    // --- Experience CRUD ---

    const handleExperienceSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const url = editingId ? `/api/admin/experience/${editingId}` : "/api/admin/experience"
            const method = editingId ? "PUT" : "POST"

            const payload = {
                ...formData,
                techStack: formData.techStack.split(",").map(s => s.trim()).filter(Boolean),
                // If empty string, send null for optional fields if API expects it, but here DB allows string
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success(editingId ? "Updated experience" : "Created experience")
                setIsSheetOpen(false)
                fetchData()
            } else {
                toast.error("Failed to save")
            }
        } catch (error) {
            toast.error("Error saving")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteExperience = async (id: string) => {
        if (!confirm("Delete this experience and all its projects?")) return
        try {
            const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Deleted successfully")
                fetchData()
            }
        } catch (error) {
            toast.error("Error deleting")
        }
    }

    const startEditExperience = (item: Experience) => {
        setEditingId(item.id)
        setFormData({
            position: item.position,
            company: item.company,
            location: item.location || "",
            startDate: item.startDate,
            endDate: item.endDate || "",
            description: item.description,
            techStack: item.techStack.join(", "),
            order: item.order
        })
        setIsSheetOpen(true)
    }

    const startCreateExperience = () => {
        setEditingId(null)
        setFormData({
            position: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            techStack: "",
            order: 0
        })
        setIsSheetOpen(true)
    }

    // --- Project Nested CRUD ---

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentExperienceId) return
        setSubmitting(true)

        try {
            const url = editingProjectId ? `/api/admin/experience-projects/${editingProjectId}` : "/api/admin/experience-projects"
            const method = editingProjectId ? "PUT" : "POST"

            const payload = {
                ...projectFormData,
                technologies: projectFormData.technologies.split(",").map(s => s.trim()).filter(Boolean),
                responsibilities: projectFormData.responsibilities.split("\n").map(s => s.trim()).filter(Boolean),
                experienceId: currentExperienceId
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success(editingProjectId ? "Updated project" : "Added project")
                setIsProjectDialogOpen(false)
                fetchData() // Refresh to see new nested data
            } else {
                toast.error("Failed to save project")
            }
        } catch (error) {
            toast.error("Error saving")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return
        try {
            const res = await fetch(`/api/admin/experience-projects/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Deleted project")
                fetchData()
            }
        } catch (error) {
            toast.error("Error deleting")
        }
    }

    const startAddProject = (expId: string) => {
        setCurrentExperienceId(expId)
        setEditingProjectId(null)
        setProjectFormData({
            name: "",
            description: "",
            technologies: "",
            teamSize: 1,
            responsibilities: "",
            order: 0
        })
        setIsProjectDialogOpen(true)
    }

    const startEditProject = (expId: string, project: ExperienceProject) => {
        setCurrentExperienceId(expId)
        setEditingProjectId(project.id)
        setProjectFormData({
            name: project.name,
            description: project.description,
            technologies: project.technologies.join(", "),
            teamSize: project.teamSize,
            responsibilities: project.responsibilities.join("\n"),
            order: project.order
        })
        setIsProjectDialogOpen(true)
    }

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setExpandedRows(newSet)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                <Button onClick={startCreateExperience} className="gap-2 bg-red-600 text-white hover:bg-red-700">
                    <Plus size={16} /> Add Position
                </Button>
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-neutral-800 hover:bg-neutral-900">
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="w-[60px]">Order</TableHead>
                            <TableHead>Role & Company</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Tech Stack</TableHead>
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
                                    No experience found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <>
                                    <TableRow key={item.id} className="border-neutral-800 hover:bg-neutral-900/50">
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(item.id)}>
                                                {expandedRows.has(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{item.order}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-neutral-200">{item.position}</span>
                                                <span className="text-sm text-neutral-400 flex items-center gap-1">
                                                    <Briefcase size={12} /> {item.company}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-neutral-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} /> {item.startDate} - {item.endDate || "Present"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-neutral-400">
                                            {item.techStack.join(", ")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => startEditExperience(item)}>
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteExperience(item.id)} className="text-red-500 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {/* Nested Projects Row */}
                                    {expandedRows.has(item.id) && (
                                        <TableRow className="hover:bg-transparent bg-neutral-950/50">
                                            <TableCell colSpan={6} className="p-4 pl-12">
                                                <div className="rounded border border-neutral-800 bg-neutral-900 p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-sm font-semibold text-neutral-300">Projects at {item.company}</h4>
                                                        <Button size="sm" onClick={() => startAddProject(item.id)} className="bg-red-600 text-white hover:bg-red-700">
                                                            <Plus size={14} className="mr-2" /> Add Project
                                                        </Button>
                                                    </div>
                                                    {item.projects.length === 0 ? (
                                                        <div className="text-sm text-neutral-500 italic">No project details added.</div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {item.projects.map(p => (
                                                                <div key={p.id} className="flex items-start justify-between border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
                                                                    <div>
                                                                        <div className="font-medium text-sm text-neutral-200">{p.name}</div>
                                                                        <div className="text-xs text-neutral-500 line-clamp-1">{p.description}</div>
                                                                        <div className="text-xs text-neutral-600 mt-1">Tech: {p.technologies.slice(0, 5).join(", ")}</div>
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => startEditProject(item.id, p)}>
                                                                            <Pencil size={12} />
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDeleteProject(p.id)}>
                                                                            <Trash2 size={12} />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Experience Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="border-l-neutral-800 bg-neutral-950 text-neutral-200 w-[500px] sm:w-[600px] p-6 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-neutral-100">{editingId ? "Edit Experience" : "Add Experience"}</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleExperienceSubmit} className="space-y-6 py-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Input value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} required className="bg-neutral-900 border-neutral-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required className="bg-neutral-900 border-neutral-800" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} placeholder="Jan 2020" required className="bg-neutral-900 border-neutral-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} placeholder="Present" className="bg-neutral-900 border-neutral-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Tech Stack (comma separated)</Label>
                            <Input value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-[100px] bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline" type="button" className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                            </SheetClose>
                            <Button type="submit" disabled={submitting} className="bg-red-600 text-white hover:bg-red-700 border-none">{submitting ? <Loader2 className="animate-spin" /> : "Save"}</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Project Dialog */}
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogContent className="bg-neutral-950 border-neutral-800 text-neutral-200 sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingProjectId ? "Edit Work Project" : "Add Work Project"}</DialogTitle>
                        <DialogDescription>
                            Specific project details for this role.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Project Name</Label>
                            <Input value={projectFormData.name} onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })} required className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input value={projectFormData.description} onChange={e => setProjectFormData({ ...projectFormData, description: e.target.value })} required className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Technologies</Label>
                            <Input value={projectFormData.technologies} onChange={e => setProjectFormData({ ...projectFormData, technologies: e.target.value })} placeholder="Comma separated" className="bg-neutral-900 border-neutral-800" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Team Size</Label>
                                <Input type="number" value={projectFormData.teamSize} onChange={e => setProjectFormData({ ...projectFormData, teamSize: parseInt(e.target.value) || 1 })} className="bg-neutral-900 border-neutral-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Order</Label>
                                <Input type="number" value={projectFormData.order} onChange={e => setProjectFormData({ ...projectFormData, order: parseInt(e.target.value) || 0 })} className="bg-neutral-900 border-neutral-800" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Responsibilities (One per line)</Label>
                            <Textarea value={projectFormData.responsibilities} onChange={e => setProjectFormData({ ...projectFormData, responsibilities: e.target.value })} className="min-h-[100px] bg-neutral-900 border-neutral-800" />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsProjectDialogOpen(false)} className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-900 hover:text-white">Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-red-600 text-white hover:bg-red-700 border-none">{submitting ? <Loader2 className="animate-spin" /> : "Save Project"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
