"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/members")

      if (!response.ok) {
        throw new Error("Failed to fetch members")
      }

      const data = await response.json()
      let membersData: Member[] = []

      if (data.success && data.data) {
        membersData = Array.isArray(data.data) ? data.data : []
      } else if (Array.isArray(data)) {
        membersData = data
      }

      const activeMembers = membersData
        .filter(member => member.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0))

      setMembers(activeMembers)
    } catch (err) {
      console.error("Error fetching members:", err)
      setError(err instanceof Error ? err.message : "Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  const handleMemberClick = (memberId: number) => {
    router.push(`/about/${memberId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our amazing team...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMembers}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            OUR TEAM
          </h1>
          <p className="text-2xl font-bold text-blue-900">
            Meet Our Dedicated And Passionate<br />Team Members
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No team members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member.id)}
                className="cursor-pointer group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-200">
                    <img
                      src={member.image_url || member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5 line-clamp-2 uppercase">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{member.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}