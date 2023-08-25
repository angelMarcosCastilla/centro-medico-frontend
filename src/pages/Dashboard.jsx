import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
      <p>This is the dashboard page</p>
    </div>
  )
}
