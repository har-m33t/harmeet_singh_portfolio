"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Particles } from "./Particles";
import { NodeGraph } from "./NodeGraph";
import { GridBackground } from "./GridBackground";
import { CameraRig } from "./CameraRig";
import {
  EffectComposer,
  Bloom,
  Noise,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";

export function NodeGraphScene({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-500 ease-out-lab"
      // An open panel is the subject; the scene behind it drops back to 30%.
      style={{ opacity: dimmed ? 0.3 : 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        // Half resolution behind an open panel — the scene is only framing
        // then, and the post-processing stack is the expensive part.
        dpr={dimmed ? 1 : [1, 1.8]}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0a0a0a", 18, 50]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.2}
            color="#ffffff"
          />

          <GridBackground />
          <Particles />
          <NodeGraph />
          <CameraRig />

          <EffectComposer enableNormalPass={false}>
            <DepthOfField
              focusDistance={0.02}
              focalLength={0.025}
              bokehScale={2.0}
            />
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
            <Noise opacity={0.08} />
            <Vignette eskil={false} offset={0.3} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
