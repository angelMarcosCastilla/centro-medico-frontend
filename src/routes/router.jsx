import { createBrowserRouter } from "react-router-dom"

import Login from "../pages/Login.jsx"
import Dashboard from "../pages/Dashboard.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <h1>Home</h1>,
        index: true,
      },
      {
        path: "triaje",
        element: <h1>Triaje</h1>,
      },
      {
        path: "tomografia",
        element: <h1>Tomografía</h1>
      },
      {
        path: "rayosx",
        element: <h1>Rayos X</h1>,
      }, 
      {
        path: "laboratorio",
        element: <h1>Laboratorio</h1>,
      }
    ],
  }
])

export { router }