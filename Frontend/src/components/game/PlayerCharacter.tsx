import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCharacter } from '@/types/game';

interface PlayerProps {
  character: PlayerCharacter;
  reaction?: 'neutral' | 'happy' | 'thinking' | 'sad';
  size?: 'sm' | 'lg';
}

export const PlayerCharacterComponent = ({
  character,
  reaction = 'neutral',
  size = 'lg'
}: PlayerProps) => {

  const outfitId = character.appearance?.outfit || 'default_outfit';
  const hatId = character.appearance?.hat || 'none_hat';
  const glassesId = character.appearance?.glasses || 'none_glasses';
  const accessoryId = character.appearance?.accessory || 'none_accessory';

  const c = {
    skin: '#fca5a5',
    shirtDefault: '#3b82f6',
    shirtHoodie: '#4f46e5',
    suit: '#1e293b',
    black: '#1f2937',
    gold: '#fbbf24',
    cap: '#ef4444',
    white: '#ffffff',
    blush: '#f87171',
  };

  // ============================================================
  // BODY ANIMATIONS
  // ============================================================
  const bodyAnim = {
    neutral: {
      y: [0, -2, 0],
      rotate: 0,
      x: 0,
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
    },
    happy: {
      // Full victory dance: bounce + shimmy
      y: [0, -18, 0, -14, 0, -18, 0],
      rotate: [0, -8, 8, -6, 6, 0, 0],
      x: [0, -6, 6, -4, 4, 0, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const }
    },
    sad: {
      y: 12,
      rotate: -8,
      x: -5,
      transition: { duration: 0.6, type: 'spring' as const, stiffness: 80 }
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, 4, 0],
      x: [0, 3, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
    },
  };

  // ============================================================
  // ARM ANIMATIONS — much more expressive
  // ============================================================
  const leftArmAnim = {
    neutral: { d: 'M 70 120 L 42 148', opacity: 1 },
    happy: {
      // Pumping arm up in the air — dance move!
      d: ['M 70 120 L 35 90', 'M 70 120 L 28 75', 'M 70 120 L 35 90', 'M 70 120 L 32 80'],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const }
    },
    thinking: {
      // Raised to chin for thinking
      d: ['M 70 120 L 55 95', 'M 70 120 L 58 92', 'M 70 120 L 55 95'],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }
    },
    sad: {
      // Dragging on the ground
      d: 'M 70 125 L 48 175',
      transition: { duration: 0.5 }
    },
  };

  const rightArmAnim = {
    neutral: { d: 'M 130 120 L 158 148', opacity: 1 },
    happy: {
      // Other arm pumping too — offset for stagger effect
      d: ['M 130 120 L 172 80', 'M 130 120 L 165 90', 'M 130 120 L 172 75', 'M 130 120 L 168 85'],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.2 }
    },
    thinking: {
      // Down by side
      d: 'M 130 120 L 158 148',
    },
    sad: {
      // Dragging low
      d: 'M 130 125 L 152 175',
      transition: { duration: 0.5 }
    },
  };

  // ============================================================
  // LEG ANIMATIONS
  // ============================================================
  const leftLegAnim = {
    neutral: { d: 'M 88 190 L 82 222', rotate: 0 },
    happy: {
      // Kicking left leg to the beat
      d: ['M 88 190 L 70 210', 'M 88 190 L 82 222', 'M 88 190 L 70 210'],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const }
    },
    thinking: { d: 'M 88 190 L 82 222' },
    sad: {
      d: 'M 88 190 L 80 225',
      transition: { duration: 0.5 }
    },
  };

  const rightLegAnim = {
    neutral: { d: 'M 112 190 L 118 222', rotate: 0 },
    happy: {
      // Kicking right leg offset from left
      d: ['M 112 190 L 118 222', 'M 112 190 L 130 210', 'M 112 190 L 118 222'],
      transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.2 }
    },
    thinking: { d: 'M 112 190 L 118 222' },
    sad: {
      d: 'M 112 190 L 120 225',
      transition: { duration: 0.5 }
    },
  };

  // ============================================================
  // HEAD ANIMATIONS
  // ============================================================
  const headAnim = {
    neutral: { rotate: 0, y: 0, x: 0 },
    happy: {
      rotate: [0, -10, 10, -8, 8, 0],
      y: [0, -5, 0, -5, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const }
    },
    thinking: {
      rotate: [0, 10, 8, 10],
      x: [0, 5, 5, 5],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
    },
    sad: {
      rotate: -15,
      y: 5,
      x: -5,
      transition: { duration: 0.6, type: 'spring' as const }
    },
  };

  // ============================================================
  // EYES
  // ============================================================
  const renderEyes = (mode: string) => {
    if (mode === 'happy') {
      // Happy crescent / arc eyes
      return (
        <g>
          <path d="M 78 63 Q 85 55 92 63" stroke={c.black} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 108 63 Q 115 55 122 63" stroke={c.black} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Blush marks */}
          <ellipse cx="82" cy="72" rx="7" ry="4" fill={c.blush} opacity="0.5" />
          <ellipse cx="118" cy="72" rx="7" ry="4" fill={c.blush} opacity="0.5" />
        </g>
      );
    }
    if (mode === 'sad') {
      // Droopy sad eyes with tears
      return (
        <g>
          <circle cx="85" cy="65" r="5" fill={c.black} />
          <circle cx="115" cy="65" r="5" fill={c.black} />
          {/* Sad eyebrows angled down */}
          <path d="M 78 55 L 93 58" stroke={c.black} strokeWidth="3" strokeLinecap="round" />
          <path d="M 107 58 L 122 55" stroke={c.black} strokeWidth="3" strokeLinecap="round" />
          {/* Tear drops */}
          <motion.path
            d="M 85 72 Q 83 78 85 84 Q 87 78 85 72"
            fill="#60a5fa"
            animate={{ y: [0, 10, 0], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' as const }}
          />
          <motion.path
            d="M 115 72 Q 113 78 115 84 Q 117 78 115 72"
            fill="#60a5fa"
            animate={{ y: [0, 10, 0], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' as const, delay: 0.5 }}
          />
        </g>
      );
    }
    if (mode === 'thinking') {
      // One squinting eye, one wide
      return (
        <g>
          <circle cx="85" cy="65" r="4" fill={c.black} />
          {/* Right eye squinting (looking up-right) */}
          <path d="M 109 63 Q 115 59 121 63" stroke={c.black} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Raised eyebrow on thinking side */}
          <motion.path
            d="M 107 56 L 122 52"
            stroke={c.black} strokeWidth="3" strokeLinecap="round"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Thought bubble dots */}
          <motion.circle cx="140" cy="42" r="3" fill="white" opacity="0.6"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.circle cx="152" cy="30" r="5" fill="white" opacity="0.6"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle cx="165" cy="16" r="7" fill="white" opacity="0.6"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </g>
      );
    }
    // neutral
    return (
      <g>
        <circle cx="85" cy="65" r="4" fill={c.black} />
        <circle cx="115" cy="65" r="4" fill={c.black} />
        {/* Subtle highlight */}
        <circle cx="87" cy="63" r="1.5" fill="white" opacity="0.6" />
        <circle cx="117" cy="63" r="1.5" fill="white" opacity="0.6" />
      </g>
    );
  };

  // ============================================================
  // MOUTH
  // ============================================================
  const renderMouth = (mode: string) => {
    if (mode === 'happy') return (
      <g>
        <path d="M 82 85 Q 100 100 118 85" stroke={c.black} strokeWidth="3.5" strokeLinecap="round" fill="white" />
        {/* Tongue peek */}
        <motion.path
          d="M 94 93 Q 100 99 106 93"
          fill="#f87171"
          animate={{ scaleY: [1, 1.3, 1], y: [0, 2, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </g>
    );
    if (mode === 'sad') return (
      <path d="M 85 92 Q 100 80 115 92" stroke={c.black} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    );
    if (mode === 'thinking') return (
      <g>
        <path d="M 88 88 Q 102 88 112 84" stroke={c.black} strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Tongue in cheek indicator */}
        <circle cx="113" cy="84" r="4" fill={c.skin} stroke={c.black} strokeWidth="1.5" />
      </g>
    );
    return <path d="M 90 85 Q 100 92 110 85" stroke={c.black} strokeWidth="3" strokeLinecap="round" fill="none" />;
  };

  // ============================================================
  // SWEAT (only for thinking)
  // ============================================================
  const renderSweat = (mode: string) => {
    if (mode !== 'thinking') return null;
    return (
      <motion.path
        d="M 55 50 Q 50 58 55 66 Q 60 58 55 50"
        fill="#60a5fa"
        animate={{ y: [0, 8, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeIn' as const }}
      />
    );
  };

  // ============================================================
  // STARS for happy mode
  // ============================================================
  const renderStars = (mode: string) => {
    if (mode !== 'happy') return null;
    return (
      <g>
        {[
          { cx: 35, cy: 40, delay: 0 },
          { cx: 165, cy: 35, delay: 0.2 },
          { cx: 25, cy: 75, delay: 0.4 },
          { cx: 178, cy: 70, delay: 0.15 },
        ].map((s, i) => (
          <motion.text
            key={i}
            x={s.cx} y={s.cy}
            textAnchor="middle"
            fontSize="16"
            animate={{ scale: [0, 1.4, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: s.delay }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >⭐</motion.text>
        ))}
      </g>
    );
  };

  // ============================================================
  // FULL AVATAR RENDER
  // ============================================================
  const renderAvatar = (mode: string) => (
    <motion.svg
      viewBox="-25 -10 250 270"
      className="w-full h-full drop-shadow-xl"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Stars / sparkles (happy only) */}
      {renderStars(mode)}

      {/* === LAYER 1: STICK LIMBS === */}
      {/* Left Leg */}
      <motion.path
        stroke={c.black} strokeWidth="7" strokeLinecap="round"
        variants={leftLegAnim}
        animate={mode}
        initial={false}
      />
      {/* Right Leg */}
      <motion.path
        stroke={c.black} strokeWidth="7" strokeLinecap="round"
        variants={rightLegAnim}
        animate={mode}
        initial={false}
      />
      {/* Left Arm */}
      <motion.path
        stroke={c.black} strokeWidth="6.5" strokeLinecap="round"
        variants={leftArmAnim}
        animate={mode}
        initial={false}
      />
      {/* Right Arm */}
      <motion.path
        stroke={c.black} strokeWidth="6.5" strokeLinecap="round"
        variants={rightArmAnim}
        animate={mode}
        initial={false}
      />

      {/* === LAYER 2: BODY === */}
      <motion.g variants={bodyAnim} animate={mode} initial={false}>
        <rect
          x="65" y="110" width="70" height="80"
          fill={
            outfitId === 'business_suit'
              ? c.suit
              : outfitId === 'cool_hoodie'
              ? c.shirtHoodie
              : c.shirtDefault
          }
          stroke={c.black} strokeWidth="3.5"
          rx="6"
        />
        {/* Outfit details */}
        {outfitId === 'business_suit' ? (
          <g>
            <path d="M 100 110 L 100 165" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            <polygon points="100,110 94,125 100,122 106,125" fill="#ef4444" />
          </g>
        ) : (
          <g>
            <line x1="90" y1="112" x2="90" y2="145" stroke="white" strokeWidth="2.5" opacity="0.4" strokeDasharray="4 4" />
            <line x1="110" y1="112" x2="110" y2="145" stroke="white" strokeWidth="2.5" opacity="0.4" strokeDasharray="4 4" />
            <circle cx="100" cy="148" r="4" fill="white" opacity="0.3" />
          </g>
        )}

        {/* === HEAD === */}
        <motion.g
          variants={headAnim}
          animate={mode}
          initial={false}
          style={{ transformBox: 'fill-box', transformOrigin: '100px 70px' }}
        >
          {/* Head shadow for depth */}
          <circle cx="102" cy="73" r="40" fill="rgba(0,0,0,0.15)" />
          {/* Head */}
          <circle cx="100" cy="70" r="40" fill={c.skin} stroke={c.black} strokeWidth="3.5" />

          {/* Ears */}
          <circle cx="60" cy="70" r="8" fill={c.skin} stroke={c.black} strokeWidth="3" />
          <circle cx="140" cy="70" r="8" fill={c.skin} stroke={c.black} strokeWidth="3" />

          {/* Eyes */}
          {renderEyes(mode)}

          {/* Mouth */}
          {renderMouth(mode)}

          {/* Sweat drops (thinking) */}
          {renderSweat(mode)}

          {/* === ACCESSORIES === */}
          {accessoryId === 'gold_chain' && (
            <path d="M 80 110 Q 100 140 120 110" stroke={c.gold} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          )}
          {glassesId !== 'none_glasses' && (
            <g>
              <line x1="60" y1="65" x2="78" y2="65" stroke={c.black} strokeWidth="2.5" />
              <rect x="78" y="55" width="22" height="14" fill={c.black} opacity="0.85" rx="3" />
              <line x1="100" y1="65" x2="122" y2="65" stroke={c.black} strokeWidth="2.5" />
              <rect x="100" y="55" width="22" height="14" fill={c.black} opacity="0.85" rx="3" />
              <line x1="138" y1="65" x2="148" y2="65" stroke={c.black} strokeWidth="2.5" />
              {/* Lens glare */}
              <line x1="81" y1="57" x2="85" y2="61" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
              <line x1="103" y1="57" x2="107" y2="61" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
            </g>
          )}
          {hatId !== 'none_hat' && (
            <g>
              <path d="M 58 45 Q 100 8 142 45 L 145 52 H 55 Z" fill={c.cap} stroke={c.black} strokeWidth="2.5" />
              <rect x="55" y="45" width="90" height="10" fill={c.cap} stroke={c.black} strokeWidth="2" rx="2" />
              <path d="M 75 45 L 78 12 Q 100 5 122 12 L 125 45" fill={c.cap} stroke="none" />
            </g>
          )}
        </motion.g>
      </motion.g>
    </motion.svg>
  );

  return (
    <>
      {/* 1. NORMAL VERSION in header */}
      {/* Use visibility:hidden instead of opacity:0 to prevent drop-shadow parent from painting a ghost box */}
      <div
        className={`relative ${size === 'sm' ? 'w-36 h-44' : 'w-48 h-56'} overflow-visible`}
        style={{ visibility: reaction === 'happy' ? 'hidden' : 'visible' }}
      >
        {renderAvatar(reaction)}
      </div>

      {/* 2. VICTORY OVERLAY — full screen hero moment */}
      <AnimatePresence>
        {reaction === 'happy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 backdrop-blur-sm"
          >
            {/* Rotating rainbow burst */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[600px] h-4 rounded-full opacity-20"
                  style={{
                    background: `hsl(${i * 45}, 90%, 60%)`,
                    rotate: `${i * 45}deg`,
                    transformOrigin: 'center',
                  }}
                  animate={{ scaleX: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>

            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  background: `hsl(${i * 30}, 80%, 60%)`,
                  left: `${20 + (i % 6) * 12}%`,
                  top: `20%`,
                }}
                animate={{
                  y: [0, 300 + Math.random() * 200],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 720],
                  opacity: [1, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: 'easeIn' }}
              />
            ))}

            {/* The Big Dancing Player */}
            <motion.div
              initial={{ scale: 0.3, y: 120, rotate: -20 }}
              animate={{ scale: 2.2, y: 0, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 20 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="w-64 h-72"
            >
              {renderAvatar('happy')}
            </motion.div>

            {/* Victory text with pop */}
            <motion.div
              initial={{ scale: 0, y: 60 }}
              animate={{ scale: [0, 1.3, 1], y: 200 }}
              className="absolute font-black text-5xl tracking-widest text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.8)]"
              style={{ textShadow: '0 0 30px rgba(251,191,36,0.8)' }}
            >
              SMART MOVE! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
