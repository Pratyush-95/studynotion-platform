// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)
  const location = useLocation()

  // if user is authenticated, prefer redirect from location (state or query)
  if (token) {
    // check navigation state first
    const redirectFromState = location.state && location.state.redirect
    // fallback to query param
    const searchParams = new URLSearchParams(location.search)
    const redirectFromQuery = searchParams.get("redirect")

    const target = redirectFromState || redirectFromQuery || "/dashboard/my-profile"

    return <Navigate to={target} />
  }

  return children
}

export default OpenRoute