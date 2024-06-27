import "./styles/main.css"

import { authConfigManager } from "@hono/auth-js/react"
import { ClickToComponent } from "click-to-react-component"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { entryModel } from "./core/database"
import { router } from "./router"
import { hydrateDatabase } from "./store/utils/local"

hydrateDatabase()

// const first = await entryModel.table.get("29107076168942595")

// for (let i = 0; i < 20_000; i++) {
//   entryModel.create({
//     ...first,
//     id: `rand-${i}`,
//   })
// }

// authConfigManager.setConfig({
//   baseUrl: import.meta.env.VITE_API_URL,
//   basePath: "/auth",
//   credentials: "include",
// })

// ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//     <ClickToComponent />
//   </React.StrictMode>,
// )
