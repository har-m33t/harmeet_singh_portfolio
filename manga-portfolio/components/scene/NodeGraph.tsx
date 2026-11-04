"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { NODE_DEFS, type NodeId } from "@/lib/navigation";
import { useNodeNavigation } from "@/lib/useNodeNavigation";
import { NodeShaderMaterial } from "./NodeMaterial";
import { useElectricLineMaterials } from "./ElectricLineMaterial";
import { Html } from "@react-three/drei";
import { dragState } from "@/lib/dragState";
import { usePrefersReducedMotion } from "@/lib/motion";
import { ACCENT } from "./NodeMaterial";
import { beamProgress, currentSurge, SHELL_MS, useSurge } from "@/lib/surge";

const SPHERE_RADIUS = 0.45;
/** Invisible pick sphere. Nodes are small on screen and the camera drifts. */
const HIT_RADIUS = SPHERE_RADIUS * 1.5;
/** Line ends this far inside the sphere so they read as "plugged in" from any angle */
const LINE_INSET = 0.05;
const LIGHTNING_SEGMENTS = 52;
const JAG_AMOUNT = 0.12;
/** Entanglement pulse duration, matching the CSS/Framer transitions. */
const PULSE_MS = 350;
/** How much of a charge the outer nodes pick up from the observer's surge. */
const SYMPATHY = 0.5;

/** The fired ray: a bolt of this length, travelling toward the observer. */
const BEAM_LENGTH = 3.4;
const BEAM_RADIUS = 0.042;
/** Where the shot leaves from, in camera space: ahead, right, and below. */
const MUZZLE = { forward: 1.6, right: 1.6, down: 1.2 };
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const ATOM = new THREE.Vector3(0, 0, 0);

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
  href: string;
};

function Node({ id, position, label, href }: NodeProps) {
  const router = useRouter();
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();
  const {
    activeNode,
    setHoveredNode,
    firePulse,
    setOrigin,
  } = useNodeNavigation();

  const material = useMemo(
    () => new NodeShaderMaterial({ transparent: true }) as THREE.ShaderMaterial,
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (material.uniforms.uTime) material.uniforms.uTime.value = t;
    if (material.uniforms.uHover) material.uniforms.uHover.value = hovered ? 1 : 0;
    if (material.uniforms.uActive)
      material.uniforms.uActive.value = activeNode === id ? 1 : 0;

    // The observer takes the full charge; the entangled nodes light up less,
    // so the energy visibly comes from the middle.
    const level = currentSurge();
    const charge = level * (id === "you" ? 1 : SYMPATHY);
    if (material.uniforms.uCharge) material.uniforms.uCharge.value = charge;

    // Swelling is motion, so reduced motion keeps the glow and drops the heave.
    const swell = reduced
      ? 0
      : charge * 0.14 * (0.8 + 0.2 * Math.sin(t * 38.0));
    coreRef.current.scale.setScalar(1 + swell);
  });

  const isDimmed = activeNode && activeNode !== id;
  const panelOpen = activeNode !== null && activeNode !== "you";

  const observe = () => {
    // A drag that happens to end on a node is a camera move, not a pick.
    if (dragState.wasDrag) return;

    // Record where this node sits on screen so the panel can grow out of it.
    const world = new THREE.Vector3();
    groupRef.current.getWorldPosition(world);
    const projected = world.project(camera);
    setOrigin({
      x: (projected.x * size.width) / 2,
      y: (-projected.y * size.height) / 2,
    });

    if (id !== "you") firePulse(id);

    // The pulse runs down the line first, then the panel collapses out of it.
    const delay = id === "you" ? 0 : PULSE_MS;
    window.setTimeout(() => router.push(href), delay);
  };

  const setHover = (on: boolean) => {
    setHovered(on);
    setHoveredNode(on ? id : null);
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={coreRef} material={material}>
        <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      </mesh>

      {/* Invisible, larger pick target. Visually the sphere is unchanged. */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          observe();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[HIT_RADIUS, 16, 16]} />
      </mesh>

      <Html
        center
        distanceFactor={6}
        // drei defaults to a z-index near 16.7M, which painted these labels
        // over every open panel. Keep them above the canvas but below the UI.
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: "none",
          textTransform: "uppercase",
          fontSize: "10px",
          letterSpacing: "0.2em",
          // Label text stays white: at this size accent-on-black loses too much
          // contrast. The brackets and the ring carry the state instead.
          color: "#ffffff",
          opacity: panelOpen ? 0 : isDimmed ? 0.4 : 0.9,
          visibility: panelOpen ? "hidden" : "visible",
          transition: "opacity 0.3s ease-out, color 0.2s ease-out",
          // Screen blend lets the idle label sit in the scene, but a hovered
          // node glows bright enough that it would erase its own label.
          mixBlendMode: hovered ? "normal" : "screen",
        }}
      >
        <div
          className={`relative whitespace-nowrap border px-2 py-1 backdrop-blur-sm transition-colors duration-200 ${
            hovered
              ? "observe-ring border-[#4db8ff] bg-black/85"
              : "border-white/40 bg-black/60"
          }`}
        >
          {/* Brackets are the hover affordance: this is the thing you'd observe. */}
          <span
            aria-hidden
            className="inline-block overflow-hidden text-[#4db8ff] transition-all duration-200"
            style={{ width: hovered ? "0.9em" : 0, opacity: hovered ? 1 : 0 }}
          >
            [
          </span>
          {label}
          <span
            aria-hidden
            className="inline-block overflow-hidden text-[#4db8ff] transition-all duration-200"
            style={{ width: hovered ? "0.9em" : 0, opacity: hovered ? 1 : 0 }}
          >
            ]
          </span>
        </div>
      </Html>
    </group>
  );
}

/**
 * The shot. It leaves from just off the viewer's shoulder — not dead centre,
 * which would foreshorten to a dot — and flies into the observer atom, which
 * is what sets the charge off.
 *
 * The muzzle is captured once per press rather than tracked: a beam whose
 * origin slid with the drifting camera would read as attached to the screen
 * instead of fired from a place.
 */
function Beam() {
  const { camera } = useThree();
  const boltRef = useRef<THREE.Group>(null!);
  const { surgeStart, beamMs } = useSurge();
  const muzzle = useRef(new THREE.Vector3());
  const firedFrom = useRef(-Infinity);

  const scratch = useMemo(
    () => ({
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      back: new THREE.Vector3(),
      head: new THREE.Vector3(),
      tail: new THREE.Vector3(),
    }),
    []
  );

  useFrame(() => {
    // Reduced motion renders no bolt at all, and the hook still runs.
    const bolt = boltRef.current;
    if (!bolt) return;

    const p = beamProgress(performance.now() - surgeStart, beamMs);
    if (p < 0) {
      bolt.visible = false;
      return;
    }

    if (firedFrom.current !== surgeStart) {
      firedFrom.current = surgeStart;
      // extractBasis gives camera right / up / backward (the camera looks down -Z).
      camera.matrixWorld.extractBasis(scratch.right, scratch.up, scratch.back);
      muzzle.current
        .copy(camera.position)
        .addScaledVector(scratch.back, -MUZZLE.forward)
        .addScaledVector(scratch.right, MUZZLE.right)
        .addScaledVector(scratch.up, -MUZZLE.down);
    }

    const start = muzzle.current;
    const span = start.distanceTo(ATOM);
    // The head overshoots the atom so the tail has somewhere to arrive.
    const headAt = p * (span + BEAM_LENGTH);
    const tail = Math.max(headAt - BEAM_LENGTH, 0);

    scratch.head.copy(start).lerp(ATOM, Math.min(headAt / span, 1));
    scratch.tail.copy(start).lerp(ATOM, Math.min(tail / span, 1));

    const length = scratch.head.distanceTo(scratch.tail);
    bolt.visible = length > 0.001;
    if (!bolt.visible) return;

    bolt.position.copy(scratch.tail).add(scratch.head).multiplyScalar(0.5);
    bolt.quaternion.setFromUnitVectors(
      AXIS_Y,
      scratch.head.clone().sub(scratch.tail).normalize()
    );
    // The unit-height cylinders are stretched along their own axis only.
    bolt.scale.set(1, length, 1);
  });

  if (beamMs <= 0) return null;

  return (
    <group ref={boltRef} visible={false}>
      <mesh>
        <cylinderGeometry args={[BEAM_RADIUS * 0.55, BEAM_RADIUS, 1, 10]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Sheath: the accent halo the white core sits inside. */}
      <mesh>
        <cylinderGeometry args={[BEAM_RADIUS * 2.0, BEAM_RADIUS * 2.9, 1, 10]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * One expanding wireframe shell per press, fired from the observer. It is the
 * shockwave that says the press landed, and it is gone before the hold phase
 * ends — the sustained part of the surge is carried by the lines and the atom.
 */
function ChargeShell() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const { surgeStart, beamMs } = useSurge();
  const reduced = usePrefersReducedMotion();

  useFrame(() => {
    // Reduced motion renders no shell at all, and the hook still runs.
    if (!meshRef.current || !matRef.current) return;

    // The shell is the impact, so it starts when the ray lands, not when the
    // button is pressed.
    const p = (performance.now() - surgeStart - beamMs) / SHELL_MS;
    const on = p >= 0 && p <= 1;
    meshRef.current.visible = on;
    if (!on) return;

    const eased = 1 - Math.pow(1 - p, 2);
    meshRef.current.scale.setScalar(0.5 + eased * 6.2);
    matRef.current.opacity = 0.5 * Math.pow(1 - p, 1.5);
  });

  if (reduced) return null;

  return (
    <mesh ref={meshRef} visible={false}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial
        ref={matRef}
        color={ACCENT}
        wireframe
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export function NodeGraph() {
  const linked = useMemo(() => NODE_DEFS.filter((n) => n.id !== "you"), []);
  const materials = useElectricLineMaterials(linked.length);
  const { pulseNode, pulseStart } = useNodeNavigation();
  const reduced = usePrefersReducedMotion();

  const lineGeometries = useMemo(() => {
    const r = SPHERE_RADIUS - LINE_INSET;
    return linked.map((n, idx) => {
      const nodePos = new THREE.Vector3(...n.position);
      const dir = nodePos.clone().normalize();
      const start = dir.clone().multiplyScalar(r);
      const end = nodePos.clone().sub(dir.clone().multiplyScalar(r));

      const { positions, progress } = lightningPath(start, end, (idx + 1) * 7.3);

      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geom.setAttribute("progress", new THREE.BufferAttribute(progress, 1));
      return geom;
    });
  }, [linked]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const since = performance.now() - pulseStart;
    // 0 → 1 across PULSE_MS on the fired line only; -1 parks every other line.
    const head = since >= 0 && since <= PULSE_MS ? since / PULSE_MS : -1;

    const charge = currentSurge();

    materials.forEach((m, i) => {
      m.uniforms.uTime.value = t;
      m.uniforms.uPulse.value = linked[i].id === pulseNode ? head : -1;
      m.uniforms.uCharge.value = charge;
      m.uniforms.uJitter.value = reduced ? 0 : 1;
    });
  });

  return (
    <group>
      <Beam />
      <ChargeShell />

      {NODE_DEFS.map((n) => (
        <Node
          key={n.id}
          id={n.id}
          position={n.position}
          label={n.label}
          href={n.href}
        />
      ))}

      {lineGeometries.map((geom, i) => (
        <group key={linked[i].id}>
          {/* @ts-expect-error: R3F line accepts geometry but JSX types conflict with SVGLineElement */}
          <line geometry={geom}>
            <lineBasicMaterial
              color="white"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </line>
          {/* @ts-expect-error: R3F line accepts geometry but JSX types conflict with SVGLineElement */}
          <line geometry={geom} material={materials[i]} />
        </group>
      ))}
    </group>
  );
}
