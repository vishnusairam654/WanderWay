import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/api/plan(.*)", "/api/chat(.*)"]);

export const proxy = clerkMiddleware(async (auth, req) => {
    // API routes don't block unauthenticated users but attach user context
    // Protected routes require auth
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};