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

export function NodeGraphScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 18, 50]} />
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

          <EffectComposer disableNormalPass>
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
