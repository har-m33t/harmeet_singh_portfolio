"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { NODE_DEFS } from "@/lib/navigation";
import { dragState } from "@/lib/dragState";

const ZOOM_MIN = 5;
const ZOOM_MAX = 40;
const ZOOM_DEFAULT = 14;
const DRAG_SPEED = 0.005;
const ELEVATION_LIMIT = Math.PI / 2.6;
/**
 * Pointer-follow drift, cut ~70% from its original 0.7/0.4. The scene still
 * breathes, but a node no longer slides out from under the cursor on approach.
 */
const SWAY_X = 0.21;
const SWAY_Y = 0.12;
/** How fast sway eases toward its target. Hovering a node freezes it outright. */
const SWAY_EASE = 0.08;

export function CameraRig() {
  const { camera } = useThree();
  const { targetNode, hoveredNode } = useNodeNavigation();
  const zoomDistance = useRef(ZOOM_DEFAULT);
  const currentZoom = useRef(ZOOM_DEFAULT);
  const targetPos = useRef(new THREE.Vector3(0, 0, ZOOM_DEFAULT));
  const sway = useRef({ x: 0, y: 0 });
  /** Where sway is heading. Held still while a node is hovered. */
  const swayTarget = useRef({ x: 0, y: 0 });
  const frozen = useRef(false);
  /** Drag-applied rotation of the camera about the graph, in radians. */
  const orbit = useRef({ azimuth: 0, elevation: 0 });
  const drag = useRef<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      swayTarget.current.x = x;
      swayTarget.current.y = y;
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${e.clientY}px`
      );

      if (drag.current.active) {
        dragState.add(e.clientX - drag.current.x, e.clientY - drag.current.y);
        orbit.current.azimuth -= (e.clientX - drag.current.x) * DRAG_SPEED;
        orbit.current.elevation = THREE.MathUtils.clamp(
          orbit.current.elevation - (e.clientY - drag.current.y) * DRAG_SPEED,
          -ELEVATION_LIMIT,
          ELEVATION_LIMIT
        );
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
      }
    };

    const handleDown = (e: PointerEvent) => {
      // Dragging orbits the graph; inside a panel the pointer belongs to the UI.
      if ((e.target as HTMLElement | null)?.closest("[data-panel]")) return;
      dragState.reset();
      drag.current = { active: true, x: e.clientX, y: e.clientY };
    };
    const handleUp = () => {
      drag.current.active = false;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, []);

  useEffect(() => {
    frozen.current = hoveredNode !== null;
  }, [hoveredNode]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only zoom when the wheel is over the scene itself. Listening on
      // window and always preventing default swallowed scrolling inside
      // the open panels, making their overflow unreachable.
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-panel]")) return;

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

    const base =
      targetNode && targetNode !== "you"
        ? new THREE.Vector3(
            ...NODE_DEFS.find((n) => n.id === targetNode)!.position
          ).normalize()
        : new THREE.Vector3(0, 0, 1);

    // Apply the drag orbit around the graph before pulling out to zoom range.
    const dir = base
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), orbit.current.azimuth);
    const right = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
    if (right.lengthSq() > 0.0001) {
      dir.applyAxisAngle(right, orbit.current.elevation);
    }

    targetPos.current.lerp(dir.multiplyScalar(currentZoom.current), 0.06);

    // Freeze the drift the moment a node is hovered, so the thing you are
    // aiming at stops moving. Released, it eases back rather than snapping.
    if (!frozen.current) {
      sway.current.x = THREE.MathUtils.lerp(
        sway.current.x,
        swayTarget.current.x,
        SWAY_EASE
      );
      sway.current.y = THREE.MathUtils.lerp(
        sway.current.y,
        swayTarget.current.y,
        SWAY_EASE
      );
    }

    const swayOffset = new THREE.Vector3(
      sway.current.x * SWAY_X,
      -sway.current.y * SWAY_Y,
      0
    );

    const desiredPos = targetPos.current.clone().add(swayOffset);
    (camera as THREE.PerspectiveCamera).position.lerp(desiredPos, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
