import localFont from "next/font/local"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

const fontSans = GeistSans
const fontMono = GeistMono

// Self-hosted to avoid Next 16.3 Turbopack + next/font/google kit-URL failures.
// See https://github.com/vercel/next.js/issues/99114
const fontSerif = localFont({
  src: [
    {
      path: "../assets/fonts/IBMPlexSerif-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSerif-500-latin.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-ibm-plex-serif",
  fallback: ["Georgia", "serif"],
})

const fontHandwritten = localFont({
  src: [
    {
      path: "../assets/fonts/Caveat-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Caveat-latin.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-caveat",
  fallback: ["cursive"],
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  fontHandwritten.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-mono:var(--font-geist-mono)]",
  "[--font-serif:var(--font-ibm-plex-serif)]",
  "[--font-handwritten:var(--font-caveat)]"
)
