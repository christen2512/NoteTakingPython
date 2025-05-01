import RecentPagesCarousel from "@/components/recent-pages-carousel"
import React from "react"

export default function Home() {
  const user = {
    name: "John Doe"
  }
  return (
    <div className="flex flex-col p-8 items-center min-h-screen">
      <div>
        <span className="text-2xl font-semibold">Welcome back, {user.name}</span>
      </div>
      <div className="gap-4">
        <RecentPagesCarousel />
      </div>
      
      

    </div>
  )
}
