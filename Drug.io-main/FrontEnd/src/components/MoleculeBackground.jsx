import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const DNA_STRAND_LENGTH = 35; // Number of base pairs
const ROTATION_DURATION = 15; // Seconds for full rotation

const DnaBasePair = ({ index, total }) => {
    // Calculate relative position (0 to 1) along the helix
    const progress = index / total;
    // Offset angle for the twist
    const angleOffset = progress * Math.PI * 4; // 2 full twists

    return (
        <motion.div
            className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
            style={{ top: `${15 + (progress * 70)}%` }} // Center vertically, spanning 70% of height
        >
            {/* Container for the rotating pair */}
            <motion.div
                className="relative w-[300px] h-[20px] md:w-[500px]" // Width of the helix
                animate={{
                    rotateY: [0, 360]
                }}
                transition={{
                    duration: ROTATION_DURATION,
                    ease: "linear",
                    repeat: Infinity,
                }}
                style={{
                    transformStyle: "preserve-3d", // Critical for 3D effect
                }}
            >
                {/* Strand A Dot */}
                <div
                    className="absolute left-0 top-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    style={{ transform: `translate(-50%, -50%) rotateY(${angleOffset}rad) translateZ(100px)` }}
                />

                {/* Strand B Dot */}
                <div
                    className="absolute right-0 top-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                    style={{ transform: `translate(50%, -50%) rotateY(${angleOffset}rad) translateZ(-100px)` }}
                />

                {/* Connector Line (Base Pair) */}
                {/* Note: True 3D lines are hard in pure CSS. 
            We use a pseudo-element logic or just simplify by not rendering the line to keep it clean 
            and looking like floating particles, OR we animate a line. 
            For this simplified 3D approach, floating nodes look cleaner and more "tech". 
            Let's add a subtle connecting beam that fades in/out. */}
                <div
                    className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/30 to-purple-500/30"
                    style={{
                        transform: `translateY(-50%) rotateY(${angleOffset}rad)`,
                        width: '100%'
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

const MoleculeBackground = () => {
    // Generate simple particle clouds for ambiance
    const particles = useMemo(() => Array.from({ length: 15 }), []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a192f] pointer-events-none perspective-[1000px]">
            {/* Deep Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,34,64,1)_0%,_rgba(10,25,47,1)_100%)]" />

            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(#64ffda 1px, transparent 1px), linear-gradient(90deg, #64ffda 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />

            {/* Glowing Atmosphere Orbs */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]"
            />

            {/* DNA Helix Container */}
            <div className="relative w-full h-full flex items-center justify-center opacity-60 scale-125 md:scale-100">
                {Array.from({ length: DNA_STRAND_LENGTH }).map((_, i) => (
                    <DnaBasePair key={i} index={i} total={DNA_STRAND_LENGTH} />
                ))}
            </div>

            {/* Floating Background Particles */}
            {particles.map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="absolute bg-white/10 rounded-full"
                    style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                    }}
                />
            ))}
        </div>
    );
};

export default MoleculeBackground;
