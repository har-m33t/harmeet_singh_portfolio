"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ACCENT } from "./NodeMaterial";

/**
 * uJitter is the motion allowance (0 under prefers-reduced-motion): a charged
 * line crackles by displacing its own vertices, and that is movement, so it
 * can be switched off while the brightness still reads.
 */
const ElectricLineVertex = /* glsl */ `
  attribute float progress;
  uniform float uTime;
  uniform float uCharge;
  uniform float uJitter;

  varying float vProgress;

  void main() {
    vProgress = progress;

    // Pinned at both ends, loosest in the middle, so a crackling bolt stays
    // plugged into its nodes.
    float taper = sin(progress * 3.141592);
    float amp = 0.1 * taper * uCharge * uJitter;
    vec3 p = position;
    p.x += sin(progress * 61.0 + uTime * 47.0) * amp;
    p.y += cos(progress * 43.0 + uTime * 39.0) * amp;
    p.z += sin(progress * 53.0 + uTime * 41.0) * amp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

/**
 * uPulse travels 0 → 1 along the line when a node is observed. A tight accent
 * band rides that position, so observing something visibly sends a signal down
 * the entanglement line before the panel opens.
 *
 * uCharge is the supercharge level: the travelling bolt speeds up and a train
 * of surge heads runs outward from the observer at once.
 */
const ElectricLineFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPulse;
  uniform float uCharge;
  uniform vec3 uAccent;

  varying float vProgress;

  void main() {
    float t = fract(vProgress - uTime * (uSpeed + uCharge * 3.2));
    float bolt = smoothstep(0.85, 1.0, t) + smoothstep(0.0, 0.15, t);
    float glow = 0.15 + 0.85 * bolt;

    // uPulse is negative when idle, so no band is drawn.
    float head = smoothstep(0.07, 0.0, abs(vProgress - uPulse));
    float firing = step(0.0, uPulse);
    float pulse = head * firing;

    // Three heads chasing each other out along the line while charged.
    float train = fract(vProgress * 3.0 - uTime * 2.6);
    float surge = smoothstep(0.78, 1.0, train) * uCharge;

    float hot = clamp(max(pulse, surge * 0.9 + uCharge * 0.35), 0.0, 1.0);
    vec3 col = mix(vec3(1.0), uAccent, hot);
    float alpha = clamp(
      glow * (0.9 + uCharge * 0.6) + pulse * 1.2 + surge * 1.1,
      0.0,
      1.0
    );

    gl_FragColor = vec4(col, alpha);
  }
`;

export function createElectricLineMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 0.6 },
      uPulse: { value: -1 },
      uCharge: { value: 0 },
      uJitter: { value: 1 },
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
