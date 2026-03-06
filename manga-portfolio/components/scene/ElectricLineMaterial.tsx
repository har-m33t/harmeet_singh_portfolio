"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ElectricLineVertex = /* glsl */ `
  attribute float progress;
  varying float vProgress;

  void main() {
    vProgress = progress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ElectricLineFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;

  varying float vProgress;

  void main() {
    float t = fract(vProgress - uTime * uSpeed);
    float bolt = smoothstep(0.85, 1.0, t) + smoothstep(0.0, 0.15, t);
    float glow = 0.15 + 0.85 * bolt;
    gl_FragColor = vec4(1.0, 1.0, 1.0, glow * 0.9);
  }
`;

export function useElectricLineMaterial() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  if (materialRef.current === null) {
    materialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.6 },
      },
      vertexShader: ElectricLineVertex,
      fragmentShader: ElectricLineFragment,
      transparent: true,
      depthWrite: false,
    });
  }

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return materialRef.current;
}
