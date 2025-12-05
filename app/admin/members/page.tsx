"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react"

interface Member {
  id: number
  name: string
  position: string
  image: string
  image_url?: string
  email: string
  phone: string
  facebookname?: string
  facebooknames?: string
  href?: string
  hrefs?: string
  company?: string
  telegram?: { title?: string; href?: string }
  viber?: { title?: string; href?: string }
  order?: number
  is_active: boolean
}

const ITEMS_PER_PAGE = 10

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    company: "",
    facebookname: "",
    facebooknames: "",
    href: "",
    hrefs: "",
    telegram_title: "",
    telegram_href: "",
    viber_title: "",
    viber_href: "",
    order: 0,
    is_active: true,
    image: null as File | null,
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members")
      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }
      const data = await response.json()
      
      if (data.success && data.data) {
        setMembers(Array.isArray(data.data) ? data.data : [])
      } else if (Array.isArray(data)) {
        setMembers(data)
      } else {
        setMembers([])
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      setMessage("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      email: "",
      phone: "",
      company: "",
      facebookname: "",
      facebooknames: "",
      href: "",
      hrefs: "",
      telegram_title: "",
      telegram_href: "",
      viber_title: "",
      viber_href: "",
      order: 0,
      is_active: true,
      image: null,
    })
    setImagePreview(null)
    setSelectedMember(null)
    setIsEditing(false)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.position || !formData.email || !formData.phone) {
      setMessage("Please fill in all required fields")
      return
    }

    if (!isEditing && !formData.image) {
      setMessage("Please upload an image")
      return
    }

    setSaving(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("position", formData.position)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("company", formData.company || "")
      formDataToSend.append("facebookname", formData.facebookname || "")
      formDataToSend.append("facebooknames", formData.facebooknames || "")
      formDataToSend.append("href", formData.href || "")
      formDataToSend.append("hrefs", formData.hrefs || "")
      formDataToSend.append("order", formData.order.toString())
      formDataToSend.append("is_active", formData.is_active ? "1" : "0")
      
      if (formData.telegram_title || formData.telegram_href) {
        formDataToSend.append("telegram[title]", formData.telegram_title || "")
        formDataToSend.append("telegram[href]", formData.telegram_href || "")
      }
      
      if (formData.viber_title || formData.viber_href) {
        formDataToSend.append("viber[title]", formData.viber_title || "")
        formDataToSend.append("viber[href]", formData.viber_href || "")
      }

      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      const url = isEditing ? `/api/members/${selectedMember?.id}` : "/api/members"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to save member")
      }

      setMessage(isEditing ? "Member updated successfully!" : "Member created successfully!")
      fetchMembers()
      setIsDialogOpen(false)
      resetForm()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error saving member:", error)
      setMessage(error instanceof Error ? error.message : "Failed to save member")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setIsEditing(true)
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone,
      company: member.company || "",
      facebookname: member.facebookname || "",
      facebooknames: member.facebooknames || "",
      href: member.href || "",
      hrefs: member.hrefs || "",
      telegram_title: member.telegram?.title || "",
      telegram_href: member.telegram?.href || "",
      viber_title: member.viber?.title || "",
      viber_href: member.viber?.href || "",
      order: member.order || 0,
      is_active: member.is_active,
      image: null,
    })
    setImagePreview(member.image_url || null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (memberId: number) => {
    if (!confirm("Are you sure you want to delete this member?")) {
      return
    }

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete member")
      }
      setMessage("Member deleted successfully")
      fetchMembers()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting member:", error)
      setMessage("Failed to delete member")
    }
  }

  const toggleStatus = async (memberId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update status")
      }
      fetchMembers()
    } catch (error) {
      console.error("Error updating status:", error)
      setMessage("Failed to update status")
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && member.is_active) ||
      (filterStatus === "inactive" && !member.is_active)
    return matchesSearch && matchesStatus
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => (a.order || 0) - (b.order || 0))

  const stats = {
    total: members.length,
    active: members.filter((m) => m.is_active).length,
    inactive: members.filter((m) => !m.is_active).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedMembers = sortedMembers.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 dark:from-slate-950 dark:via-cyan-900/10 dark:to-blue-950/10">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-900 dark:to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="h-8 w-8 sm:h-10 sm:w-10" />
                Team Members
              </h1>
              <p className="text-cyan-100">Manage your team members</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-white hover:bg-gray-100 text-cyan-900">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {isEditing ? "Edit Member" : "Add New Member"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditing ? "Update member information" : "Fill in the details to add a new team member"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium mb-2 block">Profile Image *</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mt-1"
                        />
                        {imagePreview && (
                          <div className="mt-3">
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Position *</label>
                        <Input
                          value={formData.position}
                          onChange={(e) => handleInputChange("position", e.target.value)}
                          placeholder="CEO"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone *</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+63 123 456 7890"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Company</label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Display Order</label>
                        <Input
                          type="number"
                          value={formData.order}
                          onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select
                          value={formData.is_active ? "active" : "inactive"}
                          onValueChange={(value) => handleInputChange("is_active", value === "active")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Facebook Profile 1 */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Facebook Name 1</label>
                        <Input
                          value={formData.facebookname}
                          onChange={(e) => handleInputChange("facebookname", e.target.value)}
                          placeholder="Facebook Profile Name"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Facebook URL 1</label>
                        <Input
                          value={formData.href}
                          onChange={(e) => handleInputChange("href", e.target.value)}
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      {/* Facebook Profile 2 - THESE WERE MISSING */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Facebook Name 2</label>
                        <Input
                          value={formData.facebooknames}
                          onChange={(e) => handleInputChange("facebooknames", e.target.value)}
                          placeholder="Second Facebook Profile Name"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Facebook URL 2</label>
                        <Input
                          value={formData.hrefs}
                          onChange={(e) => handleInputChange("hrefs", e.target.value)}
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Telegram Title</label>
                        <Input
                          value={formData.telegram_title}
                          onChange={(e) => handleInputChange("telegram_title", e.target.value)}
                          placeholder="Telegram"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Telegram URL</label>
                        <Input
                          value={formData.telegram_href}
                          onChange={(e) => handleInputChange("telegram_href", e.target.value)}
                          placeholder="https://t.me/..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Viber Title</label>
                        <Input
                          value={formData.viber_title}
                          onChange={(e) => handleInputChange("viber_title", e.target.value)}
                          placeholder="Viber"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Viber URL</label>
                        <Input
                          value={formData.viber_href}
                          onChange={(e) => handleInputChange("viber_href", e.target.value)}
                          placeholder="viber://..."
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                    >
                      {saving ? "Saving..." : isEditing ? "Update Member" : "Add Member"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/admin/dashboard">
                <Button variant="secondary" className="bg-white hover:bg-gray-100 text-cyan-900">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Inactive</p>
                  <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {message && (
          <Alert className="mb-6" variant={message.includes("successfully") ? "default" : "destructive"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2">
          <CardHeader className="border-b">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                All Members
              </CardTitle>
              <div className="flex gap-3">
                <div className="relative flex-1 sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Member</TableHead>
                    <TableHead className="whitespace-nowrap">Position</TableHead>
                    <TableHead className="whitespace-nowrap hidden md:table-cell">Email</TableHead>
                    <TableHead className="whitespace-nowrap hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Order</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-muted-foreground">No members found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3 min-w-[150px]">
                            <img
                              src={member.image_url || "/placeholder.jpg"}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{member.position}</TableCell>
                        <TableCell className="whitespace-nowrap hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{member.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            variant={member.is_active ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleStatus(member.id, member.is_active)}
                          >
                            {member.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{member.order || 0}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(member)}
                              className="border-cyan-200 hover:bg-cyan-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(member.id)}
                              className="border-red-200 hover:bg-red-50"
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
            </CardContent>
        </Card>
      </div>
    </div>
  )
}