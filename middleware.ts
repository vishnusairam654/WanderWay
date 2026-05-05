// middleware.ts  ← MUST be named middleware.ts for Next.js to pick it up
// (Previously misnamed proxy.ts — Next.js was ignoring the file entirely)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/api/plan(.*)", "/api/chat(.*)"]);

export const middleware = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const { userId } = await auth();
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please sign in." }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        await auth.protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};