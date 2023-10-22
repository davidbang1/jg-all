import React, { lazy } from "react"
import { Route } from "react-router-dom"

export const renderRoutes = (routes = []) => {
  routes.map((route, i) => {
    return (
      <Route
        key={i}
        path={route.path}
        render={(props) => <route.component {...props} />}
      />
    )
  })
}
const routes = [
  {
    path: "/",
    component: lazy(() => import("./features/pages/JewelDuel")),
  },
]

export default routes
