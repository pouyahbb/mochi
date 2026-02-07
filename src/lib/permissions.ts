export const isBypassRoutes = [
    "/api/polar/webhook",
    "/api/inngest(.*)",
    "/api/auth(.*)",
    "/convex(.*)"
]

export const isPublicRoutes = ["/auth(.*)", "/pricing"]

export const isProtectedRoutes = ["/dashboard(.*)", "/billing(.*)"]