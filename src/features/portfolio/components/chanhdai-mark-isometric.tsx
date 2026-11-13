"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { metalClickSound } from "@/lib/soundcn/metal-click"
import { useSound } from "@/hooks/soundcn/use-sound"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

/** Top rings + visible wall bottoms/verticals (no hidden back edges). */
const STROKE_NORMAL =
  "M 278.00 4.00L 352.73 47.14L 153.45 162.18L 3.99 75.90L 103.63 18.38L 153.45 47.14L 128.54 61.52L 153.45 75.90L 278.00 4.00M 352.73 83.14L 153.45 198.18M 352.73 47.14V 83.14M 153.45 162.18V 198.18M 153.45 198.18L 3.99 111.90M 3.99 75.90V 111.90M 3.99 111.90L 103.63 54.38M 103.63 18.38V 54.38M 153.45 83.14L 128.54 97.52M 153.45 47.14V 83.14M 128.54 61.52V 97.52M 128.54 97.52L 153.45 111.90M 153.45 75.90V 111.90M 153.45 111.90L 278.00 40.00M 278.00 4.00V 40.00M 377.64 61.52L 552.01 162.18L 477.28 205.32L 377.64 147.80L 327.82 176.56L 427.46 234.08L 352.73 277.22L 178.36 176.56L 377.64 61.52M 552.01 198.18L 477.28 241.32M 552.01 162.18V 198.18M 477.28 205.32V 241.32M 377.64 183.80L 327.82 212.56M 377.64 147.80V 183.80M 327.82 176.56V 212.56M 327.82 212.56L 427.46 270.08M 427.46 234.08V 270.08M 427.46 270.08L 352.73 313.22M 352.73 277.22V 313.22M 352.73 313.22L 178.36 212.56M 178.36 176.56V 212.56M 178.36 212.56L 377.64 97.52M 377.64 61.52V 97.52"

const STROKE_PRESSED =
  "M 278.00 20.00L 352.73 63.14L 153.45 178.18L 3.99 91.90L 103.63 34.38L 153.45 63.14L 128.54 77.52L 153.45 91.90L 278.00 20.00M 352.73 99.14L 153.45 214.18M 352.73 63.14V 99.14M 153.45 178.18V 214.18M 153.45 214.18L 3.99 127.90M 3.99 91.90V 127.90M 3.99 127.90L 103.63 70.38M 103.63 34.38V 70.38M 153.45 99.14L 128.54 113.52M 153.45 63.14V 99.14M 128.54 77.52V 113.52M 128.54 113.52L 153.45 127.90M 153.45 91.90V 127.90M 153.45 127.90L 278.00 56.00M 278.00 20.00V 56.00M 377.64 77.52L 552.01 178.18L 477.28 221.32L 377.64 163.80L 327.82 192.56L 427.46 250.08L 352.73 293.22L 178.36 192.56L 377.64 77.52M 552.01 214.18L 477.28 257.32M 552.01 178.18V 214.18M 477.28 221.32V 257.32M 377.64 199.80L 327.82 228.56M 377.64 163.80V 199.80M 327.82 192.56V 228.56M 327.82 228.56L 427.46 286.08M 427.46 250.08V 286.08M 427.46 286.08L 352.73 329.22M 352.73 293.22V 329.22M 352.73 329.22L 178.36 228.56M 178.36 192.56V 228.56M 178.36 228.56L 377.64 113.52M 377.64 77.52V 113.52"

/** All extrusion walls, painter-sorted back-to-front. */
const SIDE_WALLS: { normal: string; pressed: string }[] = [
  {
    normal: "M278.00 4.00L352.73 47.14L352.73 83.14L278.00 40.00Z",
    pressed: "M278.00 20.00L352.73 63.14L352.73 99.14L278.00 56.00Z",
  },
  {
    normal: "M103.63 18.38L153.45 47.14L153.45 83.14L103.63 54.38Z",
    pressed: "M103.63 34.38L153.45 63.14L153.45 99.14L103.63 70.38Z",
  },
  {
    normal: "M153.45 75.90L278.00 4.00L278.00 40.00L153.45 111.90Z",
    pressed: "M153.45 91.90L278.00 20.00L278.00 56.00L153.45 127.90Z",
  },
  {
    normal: "M3.99 75.90L103.63 18.38L103.63 54.38L3.99 111.90Z",
    pressed: "M3.99 91.90L103.63 34.38L103.63 70.38L3.99 127.90Z",
  },
  {
    normal: "M153.45 47.14L128.54 61.52L128.54 97.52L153.45 83.14Z",
    pressed: "M153.45 63.14L128.54 77.52L128.54 113.52L153.45 99.14Z",
  },
  {
    normal: "M128.54 61.52L153.45 75.90L153.45 111.90L128.54 97.52Z",
    pressed: "M128.54 77.52L153.45 91.90L153.45 127.90L128.54 113.52Z",
  },
  {
    normal: "M352.73 47.14L153.45 162.18L153.45 198.18L352.73 83.14Z",
    pressed: "M352.73 63.14L153.45 178.18L153.45 214.18L352.73 99.14Z",
  },
  {
    normal: "M153.45 162.18L3.99 75.90L3.99 111.90L153.45 198.18Z",
    pressed: "M153.45 178.18L3.99 91.90L3.99 127.90L153.45 214.18Z",
  },
  {
    normal: "M377.64 61.52L552.01 162.18L552.01 198.18L377.64 97.52Z",
    pressed: "M377.64 77.52L552.01 178.18L552.01 214.18L377.64 113.52Z",
  },
  {
    normal: "M178.36 176.56L377.64 61.52L377.64 97.52L178.36 212.56Z",
    pressed: "M178.36 192.56L377.64 77.52L377.64 113.52L178.36 228.56Z",
  },
  {
    normal: "M377.64 147.80L327.82 176.56L327.82 212.56L377.64 183.80Z",
    pressed: "M377.64 163.80L327.82 192.56L327.82 228.56L377.64 199.80Z",
  },
  {
    normal: "M477.28 205.32L377.64 147.80L377.64 183.80L477.28 241.32Z",
    pressed: "M477.28 221.32L377.64 163.80L377.64 199.80L477.28 257.32Z",
  },
  {
    normal: "M552.01 162.18L477.28 205.32L477.28 241.32L552.01 198.18Z",
    pressed: "M552.01 178.18L477.28 221.32L477.28 257.32L552.01 214.18Z",
  },
  {
    normal: "M327.82 176.56L427.46 234.08L427.46 270.08L327.82 212.56Z",
    pressed: "M327.82 192.56L427.46 250.08L427.46 286.08L327.82 228.56Z",
  },
  {
    normal: "M352.73 277.22L178.36 176.56L178.36 212.56L352.73 313.22Z",
    pressed: "M352.73 293.22L178.36 192.56L178.36 228.56L352.73 329.22Z",
  },
  {
    normal: "M427.46 234.08L352.73 277.22L352.73 313.22L427.46 270.08Z",
    pressed: "M427.46 250.08L352.73 293.22L352.73 329.22L427.46 286.08Z",
  },
]

/**
 * Isometric JC — solid walls + CD-style visible edge strokes only.
 */
export function ChanhDaiMarkIsometric() {
  const id = useId()
  const ids = {
    facePattern: `jc-face-pattern-${id}`,
    faceFill: `jc-face-fill-${id}`,
    stroke: `jc-stroke-${id}`,
    radialGradient: `jc-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)
  const [play] = useSound(metalClickSound)
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })
  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return
    if (window.matchMedia("(hover: none)").matches) return
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full cursor-pointer touch-manipulation overflow-visible [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_50%,var(--background))]"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="JC"
      role="img"
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        {/* y, not a transform string: Motion runs those on WAAPI, which the
            <use> copies don't follow, so the hatch drifts off the outline. */}
        <motion.g
          id={ids.faceFill}
          variants={{
            normal: { y: 0 },
            pressed: { y: 16 },
          }}
          transition={transition}
        >
          <path d="M278.00 4.00L352.73 47.14L153.45 162.18L3.99 75.90L103.63 18.38L153.45 47.14L128.54 61.52L153.45 75.90Z" />
          <path d="M377.64 61.52L552.01 162.18L477.28 205.32L377.64 147.80L327.82 176.56L427.46 234.08L352.73 277.22L178.36 176.56Z" />
        </motion.g>

        <motion.path
          id={ids.stroke}
          variants={{
            normal: { d: STROKE_NORMAL },
            pressed: { d: STROKE_PRESSED },
          }}
          transition={transition}
        />

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <g className="stroke-line" strokeWidth="1" strokeDasharray="4 2">
        <path d="M-477.55 756.57L1254.51 -243.41" />
        <path d="M977.37 788.58L-754.67 -211.42" />
        <path d="M1143.65 692.58L-588.39 -307.42" />
      </g>

      {/* Opaque extrusion walls (fill only — edges come from the cage stroke) */}
      <g className="fill-background" fillRule="nonzero">
        {SIDE_WALLS.map((wall, i) => (
          <motion.path
            key={i}
            variants={{
              normal: { d: wall.normal },
              pressed: { d: wall.pressed },
            }}
            transition={transition}
          />
        ))}
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <motion.path
        variants={{
          normal: { d: STROKE_NORMAL },
          pressed: { d: STROKE_PRESSED },
        }}
        transition={transition}
        stroke="var(--stroke)"
        strokeWidth="1.25"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <use
        href={`#${ids.stroke}`}
        stroke={`url(#${ids.radialGradient})`}
        strokeWidth="1.25"
      />
    </motion.svg>
  )
}
