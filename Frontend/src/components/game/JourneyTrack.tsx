import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PlayerCharacter } from '@/types/game';

interface JourneyTrackProps {
    currentRound: number;
    totalRounds: number;
    character: PlayerCharacter;
}

// The winding path the player travels along (SVG coords in 1000x100 viewBox)
const TRACK_PATH = 'M 18 52 C 80 52 140 20 230 52 C 320 84 390 84 480 52 C 570 20 640 20 730 52 C 800 76 870 60 982 52';

// Resolve XY position at a given 0–1 fraction along an SVG path
function getPointAtFraction(fraction: number): { x: number; y: number; angle: number } {
    if (typeof document === 'undefined') return { x: 18, y: 52, angle: 0 };
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', TRACK_PATH);
    const len = path.getTotalLength();
    const t = Math.max(0, Math.min(1, fraction));
    const pt = path.getPointAtLength(t * len);
    const pt2 = path.getPointAtLength(Math.min((t + 0.01) * len, len));
    const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
    return { x: pt.x, y: pt.y, angle };
}

export const JourneyTrack = ({ currentRound, totalRounds, character }: JourneyTrackProps) => {
    const safeTotal = Math.max(1, totalRounds - 1);
    const progress = Math.min(1, currentRound / safeTotal);

    const c = { skin: '#fca5a5', cap: '#ef4444', outline: '#1f2937' };

    // Animated marker position
    const frac = useMotionValue(0);
    const [pos, setPos] = useState({ x: 18, y: 52, angle: 0 });

    useEffect(() => {
        const controls = animate(frac, progress, {
            type: 'spring', stiffness: 40, damping: 18,
            onUpdate: (v) => setPos(getPointAtFraction(v)),
        });
        return controls.stop;
    }, [progress]);

    // Decorative trees along the course
    const trees = [
        { x: 55, y: 26 }, { x: 55, y: 78 },
        { x: 170, y: 20 }, { x: 155, y: 72 },
        { x: 310, y: 78 }, { x: 330, y: 28 },
        { x: 435, y: 80 }, { x: 450, y: 22 },
        { x: 528, y: 20 }, { x: 510, y: 78 },
        { x: 625, y: 22 }, { x: 640, y: 78 },
        { x: 695, y: 20 }, { x: 710, y: 78 },
        { x: 790, y: 28 }, { x: 810, y: 72 },
        { x: 900, y: 22 }, { x: 910, y: 76 },
    ];

    // Sand bunkers
    const bunkers = [
        { x: 265, y: 68, rx: 18, ry: 10 },
        { x: 410, y: 30, rx: 15, ry: 9 },
        { x: 590, y: 70, rx: 20, ry: 10 },
        { x: 770, y: 35, rx: 16, ry: 9 },
    ];

    // Milestone round numbers to show as dots on the path
    const milestones = [0, 0.25, 0.5, 0.75, 1].map(f => ({
        frac: f,
        pt: getPointAtFraction(f),
        label: Math.round(f * totalRounds),
    }));

    return (
        <div className="w-full mx-auto mb-4 px-2 select-none">
            {/* Labels */}
            <div className="flex justify-between text-[10px] font-bold text-emerald-400/70 mb-1 px-1 uppercase tracking-widest">
                <span>Start</span>
                <span>Financial Freedom</span>
            </div>

            {/* The course SVG */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                style={{ height: 88 }}>
                <svg
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full"
                >
                    {/* ── GRASS BACKGROUND ──────────────────────── */}
                    <defs>
                        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14532d" />
                            <stop offset="100%" stopColor="#166534" />
                        </linearGradient>
                        {/* Subtle grass stripe pattern */}
                        <pattern id="stripes" width="30" height="100" patternUnits="userSpaceOnUse">
                            <rect width="15" height="100" fill="rgba(0,0,0,0.07)" />
                        </pattern>
                        <filter id="blur2">
                            <feGaussianBlur stdDeviation="2" />
                        </filter>
                    </defs>
                    <rect width="1000" height="100" fill="url(#grassGrad)" />
                    <rect width="1000" height="100" fill="url(#stripes)" opacity="0.4" />

                    {/* ── SAND BUNKERS ──────────────────────────── */}
                    {bunkers.map((b, i) => (
                        <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry}
                            fill="#d4b483" stroke="#b8965a" strokeWidth="1" opacity="0.85" />
                    ))}

                    {/* ── TRACK ROAD (wide stroke = the road surface) */}
                    {/* Outer border glow */}
                    <path d={TRACK_PATH} stroke="rgba(0,0,0,0.35)" strokeWidth="20"
                        fill="none" strokeLinecap="round" filter="url(#blur2)" />
                    {/* Road surface */}
                    <path d={TRACK_PATH} stroke="#1c1917" strokeWidth="16"
                        fill="none" strokeLinecap="round" />
                    {/* Road edge lines */}
                    <path d={TRACK_PATH} stroke="#fbbf24" strokeWidth="1.5"
                        fill="none" strokeLinecap="round" strokeDasharray="12 8" opacity="0.5" />
                    {/* Center dashes */}
                    <path d={TRACK_PATH} stroke="white" strokeWidth="1.2"
                        fill="none" strokeLinecap="round" strokeDasharray="18 14" opacity="0.35" />

                    {/* ── TREES ─────────────────────────────────── */}
                    {trees.map((t, i) => (
                        <g key={i}>
                            {/* Trunk */}
                            <rect x={t.x - 1.5} y={t.y + 5} width="3" height="5"
                                fill="#78350f" rx="1" />
                            {/* Canopy shadow */}
                            <circle cx={t.x + 1} cy={t.y + 2} r="7"
                                fill="rgba(0,0,0,0.2)" />
                            {/* Canopy */}
                            <circle cx={t.x} cy={t.y} r="7"
                                fill={i % 3 === 0 ? '#15803d' : i % 3 === 1 ? '#166534' : '#14532d'}
                                stroke="#052e16" strokeWidth="1" />
                            {/* Canopy highlight */}
                            <circle cx={t.x - 2} cy={t.y - 2} r="3"
                                fill="#4ade80" opacity="0.25" />
                        </g>
                    ))}

                    {/* ── MILESTONE DOTS on the path ────────────── */}
                    {milestones.map((m, i) => (
                        <g key={i}>
                            <circle cx={m.pt.x} cy={m.pt.y} r="4.5"
                                fill={m.frac <= progress ? '#fbbf24' : '#374151'}
                                stroke={m.frac <= progress ? '#92400e' : '#6b7280'}
                                strokeWidth="1.5" />
                        </g>
                    ))}

                    {/* ── START MARKER ──────────────────────────── */}
                    <g>
                        {/* Checkered tee box */}
                        {[0, 1, 2, 3].map(i => (
                            <rect key={i}
                                x={5 + (i % 2) * 5} y={44 + Math.floor(i / 2) * 5}
                                width="5" height="5"
                                fill={i % 2 === Math.floor(i / 2) % 2 ? 'white' : '#374151'}
                                opacity="0.9"
                            />
                        ))}
                        <text x="9" y="72" textAnchor="middle"
                            fontSize="7" fill="#86efac" fontFamily="monospace" fontWeight="bold">GO</text>
                    </g>

                    {/* ── FINISH FLAG / GOLF HOLE ───────────────── */}
                    <g>
                        {/* Hole cup */}
                        <ellipse cx="982" cy="58" rx="10" ry="5"
                            fill="#111827" stroke="#374151" strokeWidth="1" />
                        {/* Flagpole */}
                        <line x1="982" y1="58" x2="982" y2="30"
                            stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Flag */}
                        <motion.polygon
                            points="982,30 998,36 982,42"
                            fill="#ef4444"
                            animate={{ skewX: [-3, 3, -3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {/* Flag stripe */}
                        <motion.line x1="982" y1="34" x2="996" y2="38.5"
                            stroke="white" strokeWidth="1" opacity="0.6"
                            animate={{ skewX: [-3, 3, -3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </g>

                    {/* ── PROGRESS GLOW TRAIL ───────────────────── */}
                    {/* Rendered as a clipped road highlight overlay */}
                    <path d={TRACK_PATH} stroke="#34d399" strokeWidth="6"
                        fill="none" strokeLinecap="round"
                        opacity="0.22"
                        strokeDasharray={`${progress * 1000} 1000`}
                    />
                </svg>

                {/* ── PLAYER MARKER (DOM element, positioned absolutely) ─── */}
                {/* We use absolute positioning driven by the SVG coordinate math */}
                <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={{
                        // Convert SVG coords (0–1000, 0–100) to percentage of container
                        left: `${(pos.x / 1000) * 100}%`,
                        top: `${(pos.y / 100) * 100}%`,
                        x: '-50%',
                        y: '-60%',
                    }}
                >
                    {/* Marker shadow */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-7 h-2 bg-black/40 rounded-full blur-sm" />

                    {/* Mini head */}
                    <div className="w-9 h-9 drop-shadow-xl">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* White halo */}
                            <circle cx="50" cy="50" r="45" fill="white" opacity="0.15" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="5" opacity="0.9" />
                            {/* Head */}
                            <circle cx="50" cy="50" r="40" fill={c.skin} stroke={c.outline} strokeWidth="3" />
                            {/* Eyes */}
                            <circle cx="35" cy="45" r="5" fill={c.outline} />
                            <circle cx="65" cy="45" r="5" fill={c.outline} />
                            <circle cx="37" cy="43" r="2" fill="white" opacity="0.7" />
                            <circle cx="67" cy="43" r="2" fill="white" opacity="0.7" />
                            {/* Smile */}
                            <path d="M 34 62 Q 50 72 66 62" stroke={c.outline} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                            {/* Hat */}
                            {character.accessory === 'hat' && (
                                <path d="M 10 30 Q 50 -10 90 30 L 90 36 H 10 Z" fill={c.cap} stroke={c.outline} strokeWidth="2" />
                            )}
                            {/* Glasses */}
                            {character.accessory === 'glasses' && (
                                <g>
                                    <rect x="22" y="33" width="22" height="14" fill="black" rx="3" opacity="0.85" />
                                    <rect x="56" y="33" width="22" height="14" fill="black" rx="3" opacity="0.85" />
                                    <line x1="10" y1="40" x2="22" y2="40" stroke="black" strokeWidth="2" />
                                    <line x1="78" y1="40" x2="90" y2="40" stroke="black" strokeWidth="2" />
                                    <line x1="44" y1="40" x2="56" y2="40" stroke="black" strokeWidth="2" />
                                </g>
                            )}
                        </svg>
                    </div>

                    {/* Round bubble */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-900 text-emerald-200 text-[8px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap border border-emerald-700 shadow-lg">
                        {currentRound + 1}/{totalRounds}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
