import { clerkMiddleware, createRouteMatcher  } from '@clerk/nextjs/server'


const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)' , '/bot(.*)'])

export default clerkMiddleware( async (auth , req , event) =>{
 
  
  if (isProtectedRoute(req)) await auth.protect()
 

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
 
// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// // Configure middleware for protected routes
// export default withAuth(
//   function middleware(req) {
//     return NextResponse.next();
//   },
//   {
//     pages: {
//       signIn: "/auth/login", // Redirect to login page if not authenticated
//     },
//   }
// );

// // Define protected routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*" ,'/bot/:p*'], // Protect these routes
// };
