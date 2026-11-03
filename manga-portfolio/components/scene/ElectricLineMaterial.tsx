"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ACCENT } from "./NodeMaterial";

const ElectricLineVertex = /* glsl */ `
  attribute float progress;
  varying float vProgress;

  void main() {
    vProgress = progress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * uPulse travels 0 → 1 along the line when a node is observed. A tight accent
 * band rides that position, so observing something visibly sends a signal down
 * the entanglement line before the panel opens.
 */
const ElectricLineFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPulse;
  uniform vec3 uAccent;

  varying float vProgress;

  void main() {
    float t = fract(vProgress - uTime * uSpeed);
    float bolt = smoothstep(0.85, 1.0, t) + smoothstep(0.0, 0.15, t);
    float glow = 0.15 + 0.85 * bolt;

    // uPulse is negative when idle, so no band is drawn.
    float head = smoothstep(0.07, 0.0, abs(vProgress - uPulse));
    float firing = step(0.0, uPulse);
    float pulse = head * firing;

    vec3 col = mix(vec3(1.0), uAccent, pulse);
    float alpha = clamp(glow * 0.9 + pulse * 1.2, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

export function createElectricLineMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 0.6 },
      uPulse: { value: -1 },
      uAccent: { value: ACCENT.clone() },
    },
    vertexShader: ElectricLineVertex,
    fragmentShader: ElectricLineFragment,
    transparent: true,
    depthWrite: false,
  });
}

/** One material per line, so a pulse fires down the observed link alone. */
export function useElectricLineMaterials(count: number) {
  return useMemo(
    () => Array.from({ length: count }, createElectricLineMaterial),
    [count]
  );
}
