"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { NODE_DEFS } from "@/lib/navigation";

const ZOOM_MIN = 5;
const ZOOM_MAX = 40;
const ZOOM_DEFAULT = 14;

export function CameraRig() {
  const { camera } = useThree();
  const { targetNode } = useNodeNavigation();
  const zoomDistance = useRef(ZOOM_DEFAULT);
  const currentZoom = useRef(ZOOM_DEFAULT);
  const targetPos = useRef(new THREE.Vector3(0, 0, ZOOM_DEFAULT));
  const sway = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      sway.current.x = x;
      sway.current.y = y;
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${e.clientY}px`
      );
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.8 : -0.8;
      zoomDistance.current = THREE.MathUtils.clamp(
        zoomDistance.current + delta,
        ZOOM_MIN,
        ZOOM_MAX
      );
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  useFrame(() => {
    currentZoom.current = THREE.MathUtils.lerp(
      currentZoom.current,
      zoomDistance.current,
      0.08
    );

    if (targetNode && targetNode !== "you") {
      const meta = NODE_DEFS.find((n) => n.id === targetNode)!;
      const dir = new THREE.Vector3(
        meta.position[0],
        meta.position[1],
        meta.position[2]
      )
        .normalize()
        .multiplyScalar(currentZoom.current);
      targetPos.current.lerp(dir, 0.06);
    } else {
      targetPos.current.lerp(
        new THREE.Vector3(0, 0, currentZoom.current),
        0.06
      );
    }

    const swayOffset = new THREE.Vector3(
      sway.current.x * 0.7,
      -sway.current.y * 0.4,
      0
    );

    const desiredPos = targetPos.current.clone().add(swayOffset);
    (camera as THREE.PerspectiveCamera).position.lerp(desiredPos, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
