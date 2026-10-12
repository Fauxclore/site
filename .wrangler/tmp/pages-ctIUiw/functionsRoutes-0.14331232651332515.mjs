import { onRequestPost as __api_click_js_onRequestPost } from "C:\\Users\\Jorge\\Jottacloud\\Fauxclore\\_website\\Fauxclore\\site\\functions\\api\\click.js"
import { onRequestGet as __api_next_js_onRequestGet } from "C:\\Users\\Jorge\\Jottacloud\\Fauxclore\\_website\\Fauxclore\\site\\functions\\api\\next.js"
import { onRequest as __index_js_onRequest } from "C:\\Users\\Jorge\\Jottacloud\\Fauxclore\\_website\\Fauxclore\\site\\functions\\index.js"

export const routes = [
    {
      routePath: "/api/click",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_click_js_onRequestPost],
    },
  {
      routePath: "/api/next",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_next_js_onRequestGet],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__index_js_onRequest],
    },
  ]