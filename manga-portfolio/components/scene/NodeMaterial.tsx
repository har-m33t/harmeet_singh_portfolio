"use client";

import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const ACCENT = new THREE.Color("#4db8ff");

export const NodeShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uActive: 0,
    uCharge: 0,
    uAccent: ACCENT.clone(),
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vLocalPos;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vLocalPos = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uHover;
    uniform float uActive;
    uniform float uCharge;
    uniform vec3 uAccent;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vLocalPos;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float rim = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.0);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
      float hoverGlow = uHover * 0.4;
      float activeGlow = uActive * 0.9;

      float intensity = rim * (0.3 + pulse * 0.5) + hoverGlow + activeGlow;

      /*
       * Charge reads as mains hum, not a dimmer: a fast flicker plus arcs
       * crawling across the surface, both scaled by uCharge so an idle node
       * is bit-for-bit what it was before this existed.
       */
      float flicker = 0.78 + 0.22 * sin(uTime * 63.0);
      float arcs = pow(
        0.5 + 0.5 * sin(uTime * 11.0 - length(vLocalPos) * 34.0 + vLocalPos.y * 9.0),
        3.0
      );
      float charge = uCharge * flicker;
      intensity += charge * (0.45 + 0.8 * rim + 0.55 * arcs);

      intensity = clamp(intensity, 0.0, 1.6);

      // Monochrome at rest. State — hovered, observed, or charged — tints
      // toward the accent, strongest at the rim so the sphere reads as a lit
      // edge. A charged node tints through its whole body.
      float state = clamp(max(max(uHover, uActive), uCharge), 0.0, 1.0);
      float tint = state * (0.35 + 0.65 * rim) + uCharge * 0.35;
      vec3 col = mix(vec3(intensity), uAccent * intensity, clamp(tint, 0.0, 1.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `
);
