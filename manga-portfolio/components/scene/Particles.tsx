"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT } from "./NodeMaterial";
import { currentSurge } from "@/lib/surge";

const WHITE = new THREE.Color("#ffffff");

export function Particles() {
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const [positions, count] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    return [positions, count];
  }, []);

  /*
   * The dust is the medium the field sits in, so a surge ionises it: brighter,
   * fatter and tinted toward the accent for as long as the charge holds. No
   * positions move, so this costs three property writes a frame.
   */
  useFrame(() => {
    const level = currentSurge();
    const m = matRef.current;
    if (!m) return;
    m.opacity = 0.18 + level * 0.45;
    m.size = 0.03 + level * 0.025;
    m.color.copy(WHITE).lerp(ACCENT, level * 0.7);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="white"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.18}
      />
    </points>
  );
}
