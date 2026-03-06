"use client";

export function GridBackground() {
  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[30, 18, 64, 64]} />
      <meshBasicMaterial color="#ffffff" opacity={0.08} transparent wireframe />
    </mesh>
  );
}
