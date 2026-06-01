"use client"

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
      {/* Mobile: CSS animations, lighter blur, fewer bubbles */}
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

      {/* Desktop: CSS animations, all 5 bubbles */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ filter: "blur(40px)" }}
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
            transformOrigin: "calc(50% - 400px) center",
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
          className="absolute inset-0 flex justify-center items-center will-change-transform"
          style={{
            transformOrigin: "calc(50% + 400px) center",
            animation: "bubble-rotate 40s linear infinite",
          }}
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
        <div
          className="absolute inset-0 flex justify-center items-center will-change-transform"
          style={{
            transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
            animation: "bubble-rotate 20s linear infinite",
          }}
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
        </div>
      </div>

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}
