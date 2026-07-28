import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-3.5rem)]">
        <div className="mx-auto w-full max-w-[1440px] px-6 xl:px-8 py-8 xl:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard