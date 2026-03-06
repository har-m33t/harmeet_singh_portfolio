"use client";

import { shaderMaterial } from "@react-three/drei";

export const NodeShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0,
    uActive: 0,
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

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float rim = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.0);

      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
      float hoverGlow = uHover * 0.6;
      float activeGlow = uActive * 0.9;

      float intensity = rim * (0.3 + pulse * 0.5) + hoverGlow + activeGlow;
      intensity = clamp(intensity, 0.0, 1.0);

      vec3 col = vec3(intensity);
      gl_FragColor = vec4(col, 1.0);
    }
  `
);
