"use client";

import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const ACCENT = new THREE.Color("#4db8ff");

export const NodeShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uActive: 0,
    uAccent: ACCENT.clone(),
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uHover;
    uniform float uActive;
    uniform vec3 uAccent;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float rim = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.0);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
      float hoverGlow = uHover * 0.4;
      float activeGlow = uActive * 0.9;

      float intensity = rim * (0.3 + pulse * 0.5) + hoverGlow + activeGlow;
      intensity = clamp(intensity, 0.0, 1.0);

      // Monochrome at rest. State — hovered or observed — tints toward the
      // accent, strongest at the rim so the sphere reads as a lit edge.
      float state = clamp(max(uHover, uActive), 0.0, 1.0);
      float tint = state * (0.35 + 0.65 * rim);
      vec3 col = mix(vec3(intensity), uAccent * intensity, tint);

      gl_FragColor = vec4(col, 1.0);
    }
  `
);
