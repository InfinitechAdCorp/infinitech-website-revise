"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Globe,
  Code,
  Palette,
  Search,
  Filter,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react"

interface Solution {
  id: number
  project: string
  description: string
  link: string
  image: string
  category: string
  technologies: string[]
  created_at?: string
  updated_at?: string
}

const ITEMS_PER_PAGE = 10

const CATEGORIES = [
  "Hotel Management",
  "Corporate Website",
  "Manpower Platform",
  "Real Estate",
  "E-Commerce",
  "Booking System",
  "Property Specialist",
]

const TECHNOLOGIES = [
  "Next.js",
  "Laravel",
  "MySQL",
  "TypeScript",
  "Tailwind CSS",
  "React",
  "Node.js",
  "Hero UI",
  "Shadcn/ui",
]

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    project: "",
    description: "",
    link: "",
    category: "",
    technologies: [] as string[],
  })

 const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
 const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchSolutions()
  }, [])

  const fetchSolutions = async () => {
    try {
      const response = await fetch(`${API_URL}/solutions`)
      if (!response.ok) throw new Error("Failed to fetch solutions")
      const data = await response.json()
      setSolutions(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error("Error fetching solutions:", error)
      setMessage("Failed to load solutions")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setMessage("Please select a valid image file (JPEG, PNG, GIF, or WEBP)")
      return
    }

    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB')

    // If file is larger than 2MB, compress it
    if (file.size > 2 * 1024 * 1024) {
      try {
        setMessage("Compressing large image...")
        const compressed = await compressImage(file)
        console.log('Compressed file size:', (compressed.size / 1024 / 1024).toFixed(2), 'MB')
        setImageFile(compressed)
        
        // Create preview from compressed image
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
          setMessage("")
        }
        reader.readAsDataURL(compressed)
      } catch (error) {
        console.error('Compression failed:', error)
        setMessage("Failed to compress image. Please try a smaller file.")
      }
    } else {
      // File is small enough, use as is
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions (max 1920px width)
          const maxWidth = 1920
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to blob with quality adjustment
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }
              
              // Create new File from blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              
              resolve(compressedFile)
            },
            file.type,
            0.8 // 80% quality
          )
        }
        img.onerror = () => reject(new Error('Failed to load image'))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
    })
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate image is selected for new solutions
    if (!selectedSolution && !imageFile) {
      setMessage("Please select an image")
      return
    }
    
    setSubmitting(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('project', formData.project)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('category', formData.category)
      
      // Append technologies individually
      formData.technologies.forEach((tech, index) => {
        formDataToSend.append(`technologies[${index}]`, tech)
      })

      // Append image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile, imageFile.name)
      }

      // For updates, add _method field for Laravel
      if (selectedSolution) {
        formDataToSend.append('_method', 'PUT')
      }

      // Debug: Log FormData contents
      console.log('Sending to Laravel:', `${API_URL}/solutions${selectedSolution ? `/${selectedSolution.id}` : ''}`)

      const url = selectedSolution
        ? `${API_URL}/solutions/${selectedSolution.id}`
        : `${API_URL}/solutions`

      const response = await fetch(url, {
        method: "POST", // Always POST (use _method for PUT)
        body: formDataToSend,
        // Don't set Content-Type - let browser set it with boundary
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server returned an error. Check console for details.")
      }

      const result = await response.json()

      if (!response.ok) {
        // Show validation errors if available
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(', ')
          throw new Error(errorMessages)
        }
        throw new Error(result.message || "Failed to save solution")
      }

      setMessage(
        selectedSolution
          ? "Solution updated successfully!"
          : "Solution created successfully!"
      )
      resetForm()
      setIsDialogOpen(false)
      fetchSolutions()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error saving solution:", error)
      setMessage(error instanceof Error ? error.message : "Failed to save solution")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this solution?")) return

    try {
      const response = await fetch(`${API_URL}/solutions/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete solution")

      setMessage("Solution deleted successfully")
      fetchSolutions()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting solution:", error)
      setMessage("Failed to delete solution")
    }
  }

  const handleEdit = (solution: Solution) => {
    setSelectedSolution(solution)
    setFormData({
      project: solution.project,
      description: solution.description,
      link: solution.link,
      category: solution.category,
      technologies: solution.technologies,
    })
    setImagePreview(solution.image ? `/${solution.image}` : null)
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setSelectedSolution(null)
    setFormData({
      project: "",
      description: "",
      link: "",
      category: "",
      technologies: [],
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleTechnologyToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }))
  }

  const filteredSolutions = solutions.filter((solution) => {
    const matchesSearch =
      solution.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      filterCategory === "all" || solution.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedSolutions = [...filteredSolutions].sort(
    (a, b) =>
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
  )

  const totalPages = Math.ceil(sortedSolutions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedSolutions = sortedSolutions.slice(startIndex, endIndex)

  const stats = {
    total: solutions.length,
    categories: new Set(solutions.map((s) => s.category)).size,
    ecommerce: solutions.filter((s) => s.category === "E-Commerce").length,
    realEstate: solutions.filter((s) => s.category.includes("Real Estate") || s.category.includes("Property")).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading solutions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-950 dark:via-cyan-900/10 dark:to-blue-950/10">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-900 dark:to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Globe className="h-8 w-8 sm:h-10 sm:w-10" />
                Solutions
              </h1>
              <p className="text-cyan-100">Manage your portfolio websites and projects</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="secondary" className="bg-white hover:bg-gray-100 text-cyan-900">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-2 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Total Solutions
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Categories
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {stats.categories}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    E-Commerce
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {stats.ecommerce}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Code className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                    Real Estate
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {stats.realEstate}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {message && (
          <Alert className="mb-6 border-2" variant={message.includes("successfully") ? "default" : "destructive"}>
            <AlertDescription className="font-medium">{message}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-cyan-50/30 dark:from-slate-800 dark:to-cyan-900/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
                  All Solutions
                </CardTitle>
                <CardDescription className="mt-1">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedSolutions.length)} of{" "}
                  {sortedSolutions.length}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-2"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] border-2">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={resetForm}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Solution
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-2">
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <Globe className="h-6 w-6 text-cyan-600" />
                        {selectedSolution ? "Edit Solution" : "Add New Solution"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedSolution
                          ? "Update the solution details below"
                          : "Fill in the details for the new solution"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Project Name</label>
                        <Input
                          placeholder="e.g., Eurotel Hotel Management System"
                          value={formData.project}
                          onChange={(e) =>
                            setFormData({ ...formData, project: e.target.value })
                          }
                          required
                          className="border-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Description</label>
                        <Textarea
                          placeholder="Brief description of the project..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          required
                          className="min-h-24 border-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Website Link</label>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          value={formData.link}
                          onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                          }
                          required
                          className="border-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Project Image *</label>
                        <div className="space-y-3">
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg border-2"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeImage}
                                className="absolute top-2 right-2"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                              <div className="space-y-2">
                                <label htmlFor="image-upload" className="cursor-pointer block">
                                  <span className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                                    Click to upload
                                  </span>
                                  <span className="text-sm text-muted-foreground"> or drag and drop</span>
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, GIF, WEBP (Large images will be auto-compressed)
                                </p>
                              </div>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </div>
                          )}
                          {!selectedSolution && !imageFile && (
                            <p className="text-xs text-red-500">* Image is required</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Category</label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        >
                          <SelectTrigger className="border-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Technologies</label>
                        <div className="flex flex-wrap gap-2 p-4 border-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                          {TECHNOLOGIES.map((tech) => (
                            <Badge
                              key={tech}
                              variant={
                                formData.technologies.includes(tech)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer transition-all ${
                                formData.technologies.includes(tech)
                                  ? "bg-cyan-600 hover:bg-cyan-700"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                              onClick={() => handleTechnologyToggle(tech)}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-12 text-base font-semibold"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            {selectedSolution ? "Update Solution" : "Create Solution"}
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Technologies</TableHead>
                    <TableHead className="font-semibold">Link</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSolutions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Globe className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground font-medium">No solutions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedSolutions.map((solution) => (
                      <TableRow key={solution.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                           <img
  src={`${IMAGE_URL}/${solution.image}`}
  alt={solution.project}
  className="w-12 h-12 rounded-lg object-cover border-2"
/>
                            <div>
                              <p className="font-semibold">{solution.project}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {solution.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{solution.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {solution.technologies.slice(0, 2).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {solution.technologies.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{solution.technologies.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={solution.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="text-sm">Visit</span>
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(solution)}
                              className="border-2 border-cyan-200 hover:bg-cyan-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(solution.id)}
                              className="border-2 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t">
                <p className="text-sm text-muted-foreground font-medium">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-2"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}