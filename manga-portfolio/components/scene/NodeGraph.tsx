"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NODE_DEFS, type NodeId } from "@/lib/navigation";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { NodeShaderMaterial } from "./NodeMaterial";
import { useElectricLineMaterial } from "./ElectricLineMaterial";
import { Html } from "@react-three/drei";

const SPHERE_RADIUS = 0.45;
/** Line ends this far inside the sphere so they read as "plugged in" from any angle */
const LINE_INSET = 0.05;
const LIGHTNING_SEGMENTS = 52;
const JAG_AMOUNT = 0.12;

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
};

function Node({ id, position, label }: NodeProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const { activeNode, setActiveNode, setTargetNode } = useNodeNavigation();
  const material = useMemo(
    () => new NodeShaderMaterial({ transparent: true }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    material.uTime = t;
    material.uHover = hovered ? 1 : 0;
    material.uActive = activeNode === id ? 1 : 0;
  });

  const isDimmed = activeNode && activeNode !== id;

  return (
    <group position={position}>
      <mesh
        ref={ref}
        material={material}
        onClick={(e) => {
          e.stopPropagation();
          setTargetNode(id);
          setActiveNode(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      </mesh>

      <Html
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          textTransform: "uppercase",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "#ffffff",
          opacity: isDimmed ? 0.4 : 0.9,
          mixBlendMode: "screen",
        }}
      >
        <div className="px-2 py-1 border border-white/40 bg-black/60 backdrop-blur-sm">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function NodeGraph() {
  const electricMaterial = useElectricLineMaterial();

  const lineGeometries = useMemo(() => {
    const r = SPHERE_RADIUS - LINE_INSET;
    return NODE_DEFS.filter((n) => n.id !== "you").map((n, idx) => {
      const nodePos = new THREE.Vector3(...n.position);
      const dir = nodePos.clone().normalize();
      const start = dir.clone().multiplyScalar(r);
      const end = nodePos.clone().sub(dir.clone().multiplyScalar(r));

      const { positions, progress } = lightningPath(
        start,
        end,
        (idx + 1) * 7.3
      );

      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("progress", new THREE.BufferAttribute(progress, 1));
      return geom;
    });
  }, []);

  return (
    <group>
      {NODE_DEFS.map((n) => (
        <Node key={n.id} id={n.id} position={n.position} label={n.label} />
      ))}

      {lineGeometries.map((geom, i) => (
        <group key={i}>
          <line geometry={geom}>
            <lineBasicMaterial
              color="white"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </line>
          <line geometry={geom} material={electricMaterial} />
        </group>
      ))}
    </group>
  );
}
