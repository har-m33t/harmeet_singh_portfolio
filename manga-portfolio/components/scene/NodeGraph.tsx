"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { NODE_DEFS, type NodeId } from "@/lib/navigation";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { NodeShaderMaterial } from "./NodeMaterial";
import { useElectricLineMaterials } from "./ElectricLineMaterial";
import { Html } from "@react-three/drei";
import { dragState } from "@/lib/dragState";

const SPHERE_RADIUS = 0.45;
/** Invisible pick sphere. Nodes are small on screen and the camera drifts. */
const HIT_RADIUS = SPHERE_RADIUS * 1.5;
/** Line ends this far inside the sphere so they read as "plugged in" from any angle */
const LINE_INSET = 0.05;
const LIGHTNING_SEGMENTS = 52;
const JAG_AMOUNT = 0.12;
/** Entanglement pulse duration, matching the CSS/Framer transitions. */
const PULSE_MS = 350;

function lightningPath(
  start: THREE.Vector3,
  end: THREE.Vector3,
  seed: number
): { positions: Float32Array; progress: Float32Array } {
  const tangent = end.clone().sub(start).normalize();
  let right = new THREE.Vector3(0, 1, 0).cross(tangent);
  if (right.length() < 0.01) {
    right = new THREE.Vector3(1, 0, 0).cross(tangent).normalize();
  } else {
    right.normalize();
  }
  const up = tangent.clone().cross(right).normalize();

  const positions: number[] = [];
  const progress: number[] = [];

  for (let i = 0; i <= LIGHTNING_SEGMENTS; i++) {
    const t = i / LIGHTNING_SEGMENTS;
    const base = start.clone().lerp(end, t);
    const taper = Math.sin(t * Math.PI);
    const jag =
      JAG_AMOUNT *
      taper *
      (Math.sin(seed + t * 28) * 0.6 + Math.cos(seed + t * 19) * 0.4);
    base.addScaledVector(right, jag * Math.sin(seed * 2 + t * 22));
    base.addScaledVector(up, jag * Math.cos(seed * 3 + t * 17));
    positions.push(base.x, base.y, base.z);
    progress.push(t);
  }

  return {
    positions: new Float32Array(positions),
    progress: new Float32Array(progress),
  };
}

type NodeProps = {
  id: NodeId;
  position: [number, number, number];
  label: string;
  href: string;
};

function Node({ id, position, label, href }: NodeProps) {
  const router = useRouter();
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const {
    activeNode,
    setHoveredNode,
    firePulse,
    setOrigin,
  } = useNodeNavigation();

  const material = useMemo(
    () => new NodeShaderMaterial({ transparent: true }) as THREE.ShaderMaterial,
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (material.uniforms.uTime) material.uniforms.uTime.value = t;
    if (material.uniforms.uHover) material.uniforms.uHover.value = hovered ? 1 : 0;
    if (material.uniforms.uActive)
      material.uniforms.uActive.value = activeNode === id ? 1 : 0;
  });

  const isDimmed = activeNode && activeNode !== id;
  const panelOpen = activeNode !== null && activeNode !== "you";

  const observe = () => {
    // A drag that happens to end on a node is a camera move, not a pick.
    if (dragState.wasDrag) return;

    // Record where this node sits on screen so the panel can grow out of it.
    const world = new THREE.Vector3();
    groupRef.current.getWorldPosition(world);
    const projected = world.project(camera);
    setOrigin({
      x: (projected.x * size.width) / 2,
      y: (-projected.y * size.height) / 2,
    });

    if (id !== "you") firePulse(id);

    // The pulse runs down the line first, then the panel collapses out of it.
    const delay = id === "you" ? 0 : PULSE_MS;
    window.setTimeout(() => router.push(href), delay);
  };

  const setHover = (on: boolean) => {
    setHovered(on);
    setHoveredNode(on ? id : null);
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh material={material}>
        <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      </mesh>

      {/* Invisible, larger pick target. Visually the sphere is unchanged. */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          observe();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[HIT_RADIUS, 16, 16]} />
      </mesh>

      <Html
        center
        distanceFactor={6}
        // drei defaults to a z-index near 16.7M, which painted these labels
        // over every open panel. Keep them above the canvas but below the UI.
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: "none",
          textTransform: "uppercase",
          fontSize: "10px",
          letterSpacing: "0.2em",
          // Label text stays white: at this size accent-on-black loses too much
          // contrast. The brackets and the ring carry the state instead.
          color: "#ffffff",
          opacity: panelOpen ? 0 : isDimmed ? 0.4 : 0.9,
          visibility: panelOpen ? "hidden" : "visible",
          transition: "opacity 0.3s ease-out, color 0.2s ease-out",
          // Screen blend lets the idle label sit in the scene, but a hovered
          // node glows bright enough that it would erase its own label.
          mixBlendMode: hovered ? "normal" : "screen",
        }}
      >
        <div
          className={`relative whitespace-nowrap border px-2 py-1 backdrop-blur-sm transition-colors duration-200 ${
            hovered
              ? "observe-ring border-[#4db8ff] bg-black/85"
              : "border-white/40 bg-black/60"
          }`}
        >
          {/* Brackets are the hover affordance: this is the thing you'd observe. */}
          <span
            aria-hidden
            className="inline-block overflow-hidden text-[#4db8ff] transition-all duration-200"
            style={{ width: hovered ? "0.9em" : 0, opacity: hovered ? 1 : 0 }}
          >
            [
          </span>
          {label}
          <span
            aria-hidden
            className="inline-block overflow-hidden text-[#4db8ff] transition-all duration-200"
            style={{ width: hovered ? "0.9em" : 0, opacity: hovered ? 1 : 0 }}
          >
            ]
          </span>
        </div>
      </Html>
    </group>
  );
}

export function NodeGraph() {
  const linked = useMemo(() => NODE_DEFS.filter((n) => n.id !== "you"), []);
  const materials = useElectricLineMaterials(linked.length);
  const { pulseNode, pulseStart } = useNodeNavigation();

  const lineGeometries = useMemo(() => {
    const r = SPHERE_RADIUS - LINE_INSET;
    return linked.map((n, idx) => {
      const nodePos = new THREE.Vector3(...n.position);
      const dir = nodePos.clone().normalize();
      const start = dir.clone().multiplyScalar(r);
      const end = nodePos.clone().sub(dir.clone().multiplyScalar(r));

      const { positions, progress } = lightningPath(start, end, (idx + 1) * 7.3);

      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("progress", new THREE.BufferAttribute(progress, 1));
      return geom;
    });
  }, [linked]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const since = performance.now() - pulseStart;
    // 0 → 1 across PULSE_MS on the fired line only; -1 parks every other line.
    const head = since >= 0 && since <= PULSE_MS ? since / PULSE_MS : -1;

    materials.forEach((m, i) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uPulse.value = linked[i].id === pulseNode ? head : -1;
    });
  });

  return (
    <group>
      {NODE_DEFS.map((n) => (
        <Node
          key={n.id}
          id={n.id}
          position={n.position}
          label={n.label}
          href={n.href}
        />
      ))}

      {lineGeometries.map((geom, i) => (
        <group key={linked[i].id}>
          {/* @ts-expect-error: R3F line accepts geometry but JSX types conflict with SVGLineElement */}
          <line geometry={geom}>
            <lineBasicMaterial
              color="white"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </line>
          {/* @ts-expect-error: R3F line accepts geometry but JSX types conflict with SVGLineElement */}
          <line geometry={geom} material={materials[i]} />
        </group>
      ))}
    </group>
  );
}
