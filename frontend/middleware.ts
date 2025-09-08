export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // protect dashboard pages
}