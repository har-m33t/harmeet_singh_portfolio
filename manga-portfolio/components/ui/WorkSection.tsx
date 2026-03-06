"use client";

import { SectionShell } from "./SectionShell";
import { motion } from "framer-motion";

const experiences = [
  {
    period: "FEB 2026 — PRESENT",
    org: "Underwater Robotics Project (RoboSub) @ UCI",
    role: "Computer Vision Engineer",
    location: "Irvine, CA",
    stack: "Python · OpenCV · CV2 · NumPy · ROS2",
    bullets: [
      "Developed and integrated computer vision pipelines for real-time underwater object detection and obstacle recognition, feeding actionable insights into the AUV's ROS2-based autonomy node.",
      "Built and tested Python-based ROS2 nodes with state machines that translate vision outputs into commands, enabling live control of AUV motion in simulation and hardware.",
      "Collaborated across mechanical, electrical, and software teams to synchronize sensor data, vision processing, and autonomous navigation for robust real-time perception-driven tasks.",
    ],
  },
  {
    period: "JAN 2026 — PRESENT",
    org: "Theta Tau Hybrid RC Car",
    role: "Embedded Systems Engineer",
    location: "Irvine, CA",
    stack: "C/C++ · STM32 · PID · PWM · ECU · LCD",
    bullets: [
      "Designed and programmed STM32 microcontrollers using CubeIDE, implementing PID control loops, PWM motor control, and ECU interfacing for electromechanical systems.",
      "Integrated multiple communication protocols (UART, SPI, I2C) to interface with sensors and peripherals, including accelerometers, LCD displays, and Flash memory modules.",
      "Developed algorithms for Gas-to-Electric and Electric-to-Gas transitions, battery monitoring, and real-time system feedback, optimizing performance across embedded hardware and software layers.",
    ],
  },
  {
    period: "SEP 2025 — NOV 2025",
    org: "FoundationFix",
    role: "Software Engineer",
    location: "Irvine, CA",
    stack: "React · TypeScript · CSS · Python · Flask · OpenCV · NumPy · Raspberry Pi",
    bullets: [
      "Designed and built a full-stack foundation shade-matching system (React/TypeScript, Flask) that computes optimal pigment ratios from user images using LAB/RGB matrix transformations.",
      "Developed a computer vision and color calibration pipeline leveraging OpenCV (Haar Cascades, adaptive Otsu thresholding), facial region detection, and Macbeth reference chart normalization for lighting-invariant skin tone extraction.",
      "Engineered an end-to-end IoT manufacturing workflow integrating Raspberry Pi hardware with a web dashboard to automate sub-milliliter precision pigment dispensing in under 25 seconds.",
    ],
  },
];

export function WorkSection() {
  return (
    <SectionShell
      title="TRAJECTORY"
      subtitle="World line"
      subLabel="t"
    >
      <div className="relative overflow-y-auto h-full pr-1">
        <div className="absolute left-4 md:left-8 top-0 bottom-0 border-l border-white/25" />
        <div className="space-y-8 md:space-y-10 pl-10 md:pl-16">
          {experiences.map((item, i) => (
            <motion.div
              key={item.period}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
            >
              <div className="absolute -left-6 md:-left-10 w-4 h-4 rounded-full border border-white bg-black" />
              <div className="uppercase text-[11px] tracking-[0.25em] text-fgMuted">
                {item.period}
              </div>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-sans text-sm">{item.role}</span>
                <span className="text-[10px] text-fgMuted">{item.location}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-fgMuted uppercase tracking-[0.1em]">
                {item.org}
              </div>
              <div className="mt-1 text-[10px] text-white/40 italic">
                {item.stack}
              </div>
              <ul className="mt-2 space-y-1 text-xs text-fgMuted list-disc list-inside max-w-2xl leading-relaxed">
                {item.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
