import { ACCOUNT_TYPE } from "../utils/constants";
const sidebarLinks = [
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
    name: "Cart",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "AiOutlineShoppingCart",
  },

  {
  id: 7,
  name: "Admin Dashboard",
  path: "/dashboard/admin",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscDashboard",
},

{
  id: 8,
  name: "Pending Instructors",
  path: "/dashboard/pending-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscPerson",
},

{
  id: 9,
  name: "Approved Instructors",
  path: "/dashboard/approved-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscCheck",
},

{
  id: 10,
  name: "Rejected Instructors",
  path: "/dashboard/rejected-instructors",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscClose",
},

{
  id: 11,
  name: "User Management",
  path: "/dashboard/user-management",
  type: ACCOUNT_TYPE.ADMIN,
  icon: "VscOrganization",
},
];

// module.exports = sidebarLinks
export default sidebarLinks