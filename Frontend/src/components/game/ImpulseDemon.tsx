import { motion } from 'framer-motion';
import { VillainState } from './VillainCharacter';

interface DemonProps {
    state: VillainState;
}

export const ImpulseDemon = ({ state }: DemonProps) => {
    const c = {
        body: '#b97cf8',
        bodyLight: '#d4a8fb',
        bodyDark: '#8b46f0',
        outline: '#5b21b6',
        belly: '#e9d5ff',
        eyeWhite: '#ffffff',
        pupil: '#3b0764',
        cheek: '#f0abfc',
        horn: '#7c3aed',
        hornTip: '#a78bfa',
        tooth: '#ffffff',
        toothOutline: '#c4b5fd',
        tongue: '#fb7185',
        scared: '#93c5fd',
        scaredLight: '#bfdbfe',
        scaredDark: '#1e40af',
        scaredOutline: '#1d4ed8',
    };

    const isScared = state === 'scared';
    const isLaughing = state === 'laughing';

    const bodyFill = isScared ? c.scared : c.body;
    const bodyFillLight = isScared ? c.scaredLight : c.bodyLight;
    const bodyOutline = isScared ? c.scaredOutline : c.outline;
    const bellyFill = isScared ? c.scaredLight : c.belly;
    const hornFill = isScared ? c.scaredDark : c.horn;

    // ── BODY ─────────────────────────────────────────────────────
    const bodyAnim = {
        idle: {
            y: [0, -8, 0],
            rotate: [0, -1.5, 1.5, 0],
            transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const },
        },
        laughing: {
            y: [0, -14, 4, -10, 2, 0],
            rotate: [0, -8, 9, -6, 7, 0],
            scale: [1, 1.08, 0.96, 1.1, 0.97, 1],
            transition: { duration: 0.55, repeat: Infinity, ease: 'easeInOut' as const },
        },
        scared: {
            y: 10,
            scale: 0.88,
            x: [-2, 2, -1.5, 1.5, 0],
            rotate: [-1, 1, -1, 1, 0],
            transition: { duration: 0.18, repeat: Infinity },
        },
    };

    // ── HORNS ────────────────────────────────────────────────────
    const leftHornAnim = {
        idle: { rotate: [0, -6, 6, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const } },
        laughing: { rotate: [-12, 6, -12], y: [-2, 3, -2], transition: { duration: 0.55, repeat: Infinity } },
        scared: { rotate: -40, y: 8, x: -6, transition: { duration: 0.35, type: 'spring' as const } },
    };
    const rightHornAnim = {
        idle: { rotate: [0, 6, -6, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.4 } },
        laughing: { rotate: [12, -6, 12], y: [-2, 3, -2], transition: { duration: 0.55, repeat: Infinity, delay: 0.08 } },
        scared: { rotate: 40, y: 8, x: 6, transition: { duration: 0.35, type: 'spring' as const } },
    };

    // ── TAIL ─────────────────────────────────────────────────────
    const tailAnim = {
        idle: {
            d: [
                'M 128 148 Q 158 148 162 130 Q 165 115 155 108',
                'M 128 148 Q 160 152 165 133 Q 168 117 157 110',
                'M 128 148 Q 158 148 162 130 Q 165 115 155 108',
            ],
            transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const },
        },
        laughing: {
            d: [
                'M 128 148 Q 162 138 168 118 Q 172 102 162 96',
                'M 128 148 Q 165 132 170 112 Q 173 96 163 90',
                'M 128 148 Q 162 138 168 118 Q 172 102 162 96',
            ],
            transition: { duration: 0.45, repeat: Infinity },
        },
        scared: {
            d: [
                'M 128 148 Q 118 172 100 180 Q 85 186 78 178',
                'M 128 148 Q 116 174 98 182 Q 83 188 76 180',
                'M 128 148 Q 118 172 100 180 Q 85 186 78 178',
            ],
            transition: { duration: 0.25, repeat: Infinity },
        },
    };

    // ── JAW ──────────────────────────────────────────────────────
    const jawAnim = {
        idle: { y: 0, rotate: 0 },
        laughing: {
            y: [0, 16, 0, 18, 2, 16, 0],
            rotate: [0, -3, 3, -2, 0],
            transition: { duration: 0.55, repeat: Infinity },
        },
        scared: {
            y: [18, 20, 18],
            rotate: [0, 4, -4, 0],
            transition: { duration: 0.22, repeat: Infinity },
        },
    };

    // ── ARMS ─────────────────────────────────────────────────────
    const leftArmAnim = {
        idle: { rotate: [0, 8, -4, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const } },
        laughing: { rotate: [-20, 15, -20], y: [-4, 6, -4], transition: { duration: 0.55, repeat: Infinity } },
        scared: { rotate: [-70, -80, -70], y: [-6, -4, -6], transition: { duration: 0.3, repeat: Infinity } },
    };
    const rightArmAnim = {
        idle: { rotate: [0, -8, 4, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 } },
        laughing: { rotate: [20, -15, 20], y: [-4, 6, -4], transition: { duration: 0.55, repeat: Infinity, delay: 0.1 } },
        scared: { rotate: [70, 80, 70], y: [-6, -4, -6], transition: { duration: 0.3, repeat: Infinity, delay: 0.1 } },
    };

    // ── SPARKLE (pure SVG — no emoji, no black box) ───────────────
    const SparkleItem = ({ cx, cy, delay, r = 5 }: { cx: number; cy: number; delay: number; r?: number }) => (
        <motion.g
            animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, repeat: Infinity, delay, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: `${cx}px ${cy}px` }}
        >
            <rect x={cx - r * 0.2} y={cy - r} width={r * 0.4} height={r * 2} rx={r * 0.2} fill="#fbbf24" />
            <rect x={cx - r} y={cy - r * 0.2} width={r * 2} height={r * 0.4} rx={r * 0.2} fill="#fbbf24" />
            <rect x={cx - r * 0.2} y={cy - r * 0.7} width={r * 0.4} height={r * 1.4} rx={r * 0.2}
                fill="#fde68a" style={{ transform: 'rotate(45deg)', transformBox: 'fill-box' as const, transformOrigin: 'center' }} />
        </motion.g>
    );

    // ── SWEAT DROP ───────────────────────────────────────────────
    const SweatDrop = ({ cx, cy, delay }: { cx: number; cy: number; delay: number }) => (
        <motion.g
            animate={isScared ? { y: [0, 22], opacity: [0, 0.9, 0] } : { opacity: 0, y: 0 }}
            transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeIn' }}
        >
            <ellipse cx={cx} cy={cy} rx="4" ry="6" fill="#60a5fa" />
            <ellipse cx={cx} cy={cy - 4} rx="2" ry="2" fill="#93c5fd" opacity="0.7" />
        </motion.g>
    );

    return (
        <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 200 210"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={state}
            variants={bodyAnim}
            style={{ overflow: 'visible' }}
        >
            {/* ── SHADOW ────────────────────────────────────────── */}
            <motion.ellipse cx="100" cy="200" rx="45" ry="9"
                fill={isScared ? 'rgba(30,64,175,0.15)' : 'rgba(91,33,182,0.2)'}
                animate={{ scaleX: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: isLaughing ? 0.55 : 2.2, repeat: Infinity }}
            />

            {/* ── TAIL ──────────────────────────────────────────── */}
            <motion.path
                stroke={hornFill} strokeWidth="7" strokeLinecap="round" fill="none"
                variants={tailAnim} animate={state} initial={false}
            />
            {/* Heart-shaped tail tip */}
            <motion.g
                animate={isLaughing
                    ? { rotate: [0, 25, -10, 25], x: [0, 4, 0] }
                    : isScared
                        ? { rotate: [-20, 20, -20], x: [-2, 2, -2] }
                        : { rotate: [0, 8, -8, 0] }}
                transition={{ duration: isLaughing ? 0.45 : isScared ? 0.25 : 2.2, repeat: Infinity }}
                style={{ transformBox: 'fill-box', transformOrigin: '156px 100px' }}
            >
                <circle cx="151" cy="97" r="5" fill={hornFill} />
                <circle cx="161" cy="97" r="5" fill={hornFill} />
                <polygon points="146,100 166,100 156,110" fill={hornFill} />
            </motion.g>

            {/* ── HORNS (rounded blobs, not spikes) ─────────────── */}
            <motion.g
                variants={leftHornAnim} animate={state} initial={false}
                style={{ transformBox: 'fill-box', transformOrigin: '72px 52px' }}
            >
                <ellipse cx="72" cy="44" rx="9" ry="15" fill={hornFill} stroke={bodyOutline} strokeWidth="2.5"
                    style={{ transform: 'rotate(-15deg)', transformBox: 'fill-box' as const, transformOrigin: 'center' }} />
                <ellipse cx="72" cy="34" rx="5" ry="6" fill={c.hornTip} opacity="0.6" />
            </motion.g>
            <motion.g
                variants={rightHornAnim} animate={state} initial={false}
                style={{ transformBox: 'fill-box', transformOrigin: '128px 52px' }}
            >
                <ellipse cx="128" cy="44" rx="9" ry="15" fill={hornFill} stroke={bodyOutline} strokeWidth="2.5"
                    style={{ transform: 'rotate(15deg)', transformBox: 'fill-box' as const, transformOrigin: 'center' }} />
                <ellipse cx="128" cy="34" rx="5" ry="6" fill={c.hornTip} opacity="0.6" />
            </motion.g>

            {/* ── BODY (chubby oval) ────────────────────────────── */}
            <ellipse cx="100" cy="150" rx="46" ry="42" fill={bodyFill} stroke={bodyOutline} strokeWidth="3.5" />
            {/* Belly patch */}
            <ellipse cx="100" cy="157" rx="28" ry="25" fill={bellyFill} opacity="0.55" />

            {/* ── ARMS ──────────────────────────────────────────── */}
            <motion.g
                variants={leftArmAnim} animate={state} initial={false}
                style={{ transformBox: 'fill-box', transformOrigin: '65px 140px' }}
            >
                <ellipse cx="50" cy="150" rx="10" ry="14" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
                <circle cx="44" cy="161" r="8" fill={bodyFillLight} stroke={bodyOutline} strokeWidth="2.5" />
            </motion.g>
            <motion.g
                variants={rightArmAnim} animate={state} initial={false}
                style={{ transformBox: 'fill-box', transformOrigin: '135px 140px' }}
            >
                <ellipse cx="150" cy="150" rx="10" ry="14" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
                <circle cx="156" cy="161" r="8" fill={bodyFillLight} stroke={bodyOutline} strokeWidth="2.5" />
            </motion.g>

            {/* ── HEAD ──────────────────────────────────────────── */}
            <circle cx="100" cy="88" r="46" fill={bodyFill} stroke={bodyOutline} strokeWidth="3.5" />
            {/* Sheen */}
            <ellipse cx="85" cy="68" rx="14" ry="8" fill={bodyFillLight} opacity="0.3"
                style={{ transform: 'rotate(-25deg)', transformBox: 'fill-box' as const, transformOrigin: 'center' }} />
            {/* Ear nubs */}
            <circle cx="58" cy="80" r="10" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
            <circle cx="142" cy="80" r="10" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
            <circle cx="58" cy="80" r="5" fill={bodyFillLight} opacity="0.5" />
            <circle cx="142" cy="80" r="5" fill={bodyFillLight} opacity="0.5" />

            {/* ── EYES ──────────────────────────────────────────── */}
            {isLaughing ? (
                <g>
                    {/* Happy squints */}
                    <path d="M 78 84 Q 87 74 96 84" stroke={bodyOutline} strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 104 84 Q 113 74 122 84" stroke={bodyOutline} strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M 74 88 L 70 94" stroke={bodyOutline} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
                    <path d="M 126 88 L 130 94" stroke={bodyOutline} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
                </g>
            ) : isScared ? (
                <g>
                    {/* Wide eyes */}
                    <circle cx="85" cy="84" r="13" fill={c.eyeWhite} stroke={bodyOutline} strokeWidth="2.5" />
                    <circle cx="115" cy="84" r="13" fill={c.eyeWhite} stroke={bodyOutline} strokeWidth="2.5" />
                    <motion.circle cx="85" cy="84" r="5" fill={c.scaredDark}
                        animate={{ cx: [83, 87, 85], cy: [82, 86, 84] }}
                        transition={{ duration: 0.28, repeat: Infinity }}
                    />
                    <motion.circle cx="115" cy="84" r="5" fill={c.scaredDark}
                        animate={{ cx: [113, 117, 115], cy: [82, 86, 84] }}
                        transition={{ duration: 0.28, repeat: Infinity, delay: 0.12 }}
                    />
                    <circle cx="80" cy="79" r="2.5" fill={c.eyeWhite} opacity="0.9" />
                    <circle cx="110" cy="79" r="2.5" fill={c.eyeWhite} opacity="0.9" />
                </g>
            ) : (
                <g>
                    {/* Normal big cute eyes */}
                    <circle cx="85" cy="84" r="13" fill={c.eyeWhite} stroke={bodyOutline} strokeWidth="2.5" />
                    <circle cx="115" cy="84" r="13" fill={c.eyeWhite} stroke={bodyOutline} strokeWidth="2.5" />
                    <motion.circle cx="85" cy="84" r="6" fill={c.pupil}
                        animate={{ cx: [84, 87, 85], cy: [83, 85, 84] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const }}
                    />
                    <motion.circle cx="115" cy="84" r="6" fill={c.pupil}
                        animate={{ cx: [114, 117, 115], cy: [83, 85, 84] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.2 }}
                    />
                    <circle cx="80" cy="79" r="3" fill={c.eyeWhite} opacity="0.9" />
                    <circle cx="110" cy="79" r="3" fill={c.eyeWhite} opacity="0.9" />
                    <circle cx="82" cy="77" r="1.2" fill={c.eyeWhite} opacity="0.6" />
                    <circle cx="112" cy="77" r="1.2" fill={c.eyeWhite} opacity="0.6" />
                </g>
            )}

            {/* ── ROSY CHEEKS ────────────────────────────────────── */}
            <ellipse cx="72" cy="97" rx="10" ry="7" fill={c.cheek} opacity={isScared ? 0.12 : 0.32} />
            <ellipse cx="128" cy="97" rx="10" ry="7" fill={c.cheek} opacity={isScared ? 0.12 : 0.32} />

            {/* ── MOUTH / JAW ─────────────────────────────────────── */}
            <motion.g
                variants={jawAnim} animate={state} initial={false}
                style={{ transformBox: 'fill-box', transformOrigin: '100px 106px' }}
            >
                {isLaughing ? (
                    <g>
                        <path d="M 76 104 Q 100 130 124 104" fill="#3b0764" stroke={bodyOutline} strokeWidth="3" strokeLinecap="round" />
                        {/* 2 small rounded teeth — cute */}
                        <rect x="88" y="104" width="10" height="8" rx="3" fill={c.tooth} stroke={c.toothOutline} strokeWidth="1.5" />
                        <rect x="102" y="104" width="10" height="8" rx="3" fill={c.tooth} stroke={c.toothOutline} strokeWidth="1.5" />
                        <motion.ellipse cx="100" cy="120" rx="12" ry="8" fill={c.tongue}
                            animate={{ scaleY: [1, 1.2, 1], y: [0, 3, 0] }}
                            transition={{ duration: 0.45, repeat: Infinity }}
                        />
                    </g>
                ) : isScared ? (
                    <motion.ellipse cx="100" cy="110" rx="14" ry="10" fill="#3b0764" stroke={bodyOutline} strokeWidth="3"
                        animate={{ rx: [14, 12, 14], ry: [10, 12, 10] }}
                        transition={{ duration: 0.22, repeat: Infinity }}
                    />
                ) : (
                    <path d="M 86 108 Q 100 118 114 108" stroke={bodyOutline} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                )}
            </motion.g>

            {/* ── LEGS ────────────────────────────────────────────── */}
            <motion.g
                animate={isLaughing ? { x: [-3, 3, -3], y: [0, -4, 0] } : isScared ? { y: [0, -3, 0] } : {}}
                transition={{ duration: isLaughing ? 0.55 : 0.25, repeat: Infinity }}
            >
                <rect x="76" y="184" width="18" height="20" rx="9" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
                <ellipse cx="85" cy="205" rx="14" ry="7" fill={bodyFillLight} stroke={bodyOutline} strokeWidth="2.5" />
            </motion.g>
            <motion.g
                animate={isLaughing ? { x: [3, -3, 3], y: [0, -4, 0] } : isScared ? { y: [0, -3, 0] } : {}}
                transition={{ duration: isLaughing ? 0.55 : 0.25, repeat: Infinity, delay: 0.15 }}
            >
                <rect x="106" y="184" width="18" height="20" rx="9" fill={bodyFill} stroke={bodyOutline} strokeWidth="3" />
                <ellipse cx="115" cy="205" rx="14" ry="7" fill={bodyFillLight} stroke={bodyOutline} strokeWidth="2.5" />
            </motion.g>

            {/* ── SWEAT DROPS ─────────────────────────────────────── */}
            <SweatDrop cx={44} cy={60} delay={0} />
            <SweatDrop cx={30} cy={82} delay={0.35} />
            <SweatDrop cx={162} cy={58} delay={0.18} />

            {/* ── SPARKLES — pure geometry, zero emoji, zero black box */}
            {isLaughing && (
                <>
                    <SparkleItem cx={30} cy={42} delay={0} r={6} />
                    <SparkleItem cx={170} cy={38} delay={0.2} r={5} />
                    <SparkleItem cx={20} cy={92} delay={0.4} r={5} />
                    <SparkleItem cx={180} cy={82} delay={0.15} r={7} />
                </>
            )}
        </motion.svg>
    );
};
