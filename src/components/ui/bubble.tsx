"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface BubbleBackgroundProps {
  className?: string
  children?: React.ReactNode
  colors?: {
    first: string
    second: string
    third: string
    fourth: string
    fifth: string
  }
}

export function BubbleBackground({
  className,
  children,
  colors = {
    first: "16,100,54",
    second: "8,95,68",
    third: "3,78,56",
    fourth: "10,95,86",
    fifth: "34,115,64",
  },
}: BubbleBackgroundProps) {
  const makeGradient = (color: string) =>
    `radial-gradient(circle at center, rgba(${color}, 0.8) 0%, rgba(${color}, 0) 50%)`

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {/* SVG goo filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="bubble-goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Mobile: CSS animations, lighter filter (no goo), fewer bubbles */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ filter: "blur(20px)" }}
      >
        <div
          className="absolute rounded-full mix-blend-hard-light will-change-transform"
          style={{
            width: "80%",
            height: "80%",
            top: "10%",
            left: "10%",
            background: makeGradient(colors.first),
            animation: "bubble-float-y 30s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 flex justify-center items-center will-change-transform"
          style={{
            transformOrigin: "calc(50% - 200px) center",
            animation: "bubble-rotate 20s linear infinite",
          }}
        >
          <div
            className="rounded-full mix-blend-hard-light"
            style={{
              width: "80%",
              height: "80%",
              background: makeGradient(colors.second),
            }}
          />
        </div>
        <div
          className="absolute rounded-full mix-blend-hard-light opacity-70 will-change-transform"
          style={{
            width: "80%",
            height: "80%",
            top: "10%",
            left: "10%",
            background: makeGradient(colors.fourth),
            animation: "bubble-float-x 40s ease-in-out infinite",
          }}
        />
      </div>

      {/* Desktop: Framer Motion animations, full goo filter, all 5 bubbles */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ filter: "url(#bubble-goo) blur(40px)" }}
      >
        <motion.div
          className="absolute rounded-full mix-blend-hard-light"
          style={{
            width: "80%",
            height: "80%",
            top: "10%",
            left: "10%",
            background: makeGradient(colors.first),
          }}
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{ transformOrigin: "calc(50% - 400px) center" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          <div
            className="rounded-full mix-blend-hard-light"
            style={{
              width: "80%",
              height: "80%",
              background: makeGradient(colors.second),
            }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{ transformOrigin: "calc(50% + 400px) center" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          <div
            className="absolute rounded-full mix-blend-hard-light"
            style={{
              width: "80%",
              height: "80%",
              top: "calc(50% + 200px)",
              left: "calc(50% - 500px)",
              background: makeGradient(colors.third),
            }}
          />
        </motion.div>
        <motion.div
          className="absolute rounded-full mix-blend-hard-light opacity-70"
          style={{
            width: "80%",
            height: "80%",
            top: "10%",
            left: "10%",
            background: makeGradient(colors.fourth),
          }}
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          style={{ transformOrigin: "calc(50% - 800px) calc(50% + 200px)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        >
          <div
            className="absolute rounded-full mix-blend-hard-light"
            style={{
              width: "160%",
              height: "160%",
              top: "calc(50% - 80%)",
              left: "calc(50% - 80%)",
              background: makeGradient(colors.fifth),
            }}
          />
        </motion.div>
      </div>

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}
