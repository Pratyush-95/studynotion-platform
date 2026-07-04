import { ACCOUNT_TYPE } from "../utils/constants"

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
  {
    id: 7,
    name: "Courses",
    path: "/dashboard/courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscLibrary",
  },
  {
    id: 8,
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscArchive",
  },

  {
  id: 9,
  name: "Admin Dashboard",
  path: "/dashboard/admin",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscDashboard",
},
{
  id: 10,
  name: "Pending Instructors",
  path: "/dashboard/pending-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscAccount",
},
{
  id: 11,
  name: "Approved Instructors",
  path: "/dashboard/approved-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscAccount",
},
{
  id: 12,
  name: "Rejected Instructors",
  path: "/dashboard/rejected-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscAccount",
},
]