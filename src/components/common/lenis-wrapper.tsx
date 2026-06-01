"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";

interface LenisWrapperProps {
    children: ReactNode;
}

export default function LenisWrapper({ children }: LenisWrapperProps) {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice(
            "ontouchstart" in window || navigator.maxTouchPoints > 0
        );
    }, []);

    // On touch devices, skip Lenis entirely — native scrolling is smoother
    if (isTouchDevice) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,
                duration: 1.2,
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            }}
        >
            {children}
        </ReactLenis>
    );
}
