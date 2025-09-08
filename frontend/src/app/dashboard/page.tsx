"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

interface Job {
  id: number
  title: string
  company: string
  status: string
  applied_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [statusField, setStatusField] = useState("applied")

  const fetchJobs = async () => {
    if (!session?.accessToken) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/jobs`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      setJobs(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [session])

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.accessToken) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({ title, company, status: statusField })
    })

    if (res.ok) {
      setTitle("")
      setCompany("")
      setStatusField("applied")
      fetchJobs() // refresh list
    } else {
      console.error("Failed to add job")
    }
  }

  if (status === "loading") return <p>Loading session...</p>
  if (!session) return <p className="text-center mt-10">Not authorized</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Applications</h1>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md"
          onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
        >
          Logout
        </button>
      </div>

      {/* Job Creation Form */}
      <form
        onSubmit={handleAddJob}
        className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col gap-3"
      >
        <h2 className="font-semibold">Add a New Job</h2>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
        <select
          value={statusField}
          onChange={(e) => setStatusField(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded-md"
        >
          Add Job
        </button>
      </form>

      {/* Job List */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="p-3 border rounded-lg shadow-sm flex justify-between"
            >
              <span>
                <strong>{job.title}</strong> @ {job.company}
              </span>
              <span className="text-sm text-gray-500">{job.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found. Add your first job!</p>
      )}
    </div>
  )
}
