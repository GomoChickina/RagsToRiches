import { motion, AnimatePresence } from 'framer-motion';
import { EvilCharacter } from '@/types/game';
import { ImpulseDemon } from './ImpulseDemon';

export type VillainState = 'idle' | 'laughing' | 'scared';

interface VillainProps {
  character: EvilCharacter;
  state: VillainState;
  health: number;
  maxHealth: number;
  damage?: number;
}

export const VillainCharacter = ({ state, health, maxHealth, damage }: VillainProps) => {

  const renderAvatar = (mode: VillainState) => <ImpulseDemon state={mode} />;

  return (
    <>
      {/* =========================================================
          1. THE "NORMAL" HEADER VILLAIN
          visibility:hidden (not opacity:0) so the parent drop-shadow
          filter doesn't paint a black ghost box when he jumps away.
      ========================================================= */}
      <div
        className="relative flex flex-col items-center justify-end h-32 w-24 md:h-48 md:w-32"
        style={{ visibility: state === 'laughing' ? 'hidden' : 'visible' }}
      >
        {/* Damage Number Popup */}
        <AnimatePresence>
          {damage && damage > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -50, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 z-20 font-black text-4xl text-red-500 drop-shadow-lg"
            >
              -{damage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Health Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-2 border border-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-700 to-purple-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(health / maxHealth) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* The Avatar (Small) */}
        <div className="w-full h-full">
          {renderAvatar(state)}
        </div>
      </div>

      {/* =========================================================
          2. THE "LAUGH" OVERLAY — playful, not a jumpscare
          - Soft purple tint instead of black
          - Smaller scale (1.6x instead of 2.5x)
          - Bouncy entrance instead of slamming in
          - Friendly taunt text
      ========================================================= */}
      <AnimatePresence>
        {state === 'laughing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-[2px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(88,28,135,0.55) 0%, rgba(15,10,30,0.45) 100%)' }}
          >
            {/* Soft pulsing ring — not aggressive, just fun */}
            <motion.div
              className="absolute rounded-full border-2 border-purple-400/30"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              style={{ width: 240, height: 240 }}
            />
            <motion.div
              className="absolute rounded-full border-2 border-purple-300/20"
              animate={{ scale: [1, 3], opacity: [0.4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              style={{ width: 240, height: 240 }}
            />

            {/* The Villain — bouncy pop-in, not a slam */}
            <motion.div
              initial={{ scale: 0.6, y: 40, rotate: -8 }}
              animate={{ scale: 1.6, y: 0, rotate: [0, -4, 4, -3, 0] }}
              exit={{ scale: 0.4, opacity: 0, y: 30 }}
              transition={{
                scale: { type: 'spring', stiffness: 220, damping: 18 },
                rotate: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="w-52 h-52 md:w-64 md:h-64"
            >
              {renderAvatar('laughing')}
            </motion.div>

            {/* Playful taunts — rotates through messages */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 130 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="absolute text-purple-200 font-black text-2xl tracking-widest uppercase"
              style={{ textShadow: '0 0 20px rgba(168,85,247,0.8), 0 2px 0 rgba(0,0,0,0.6)' }}
            >
              Nice try... 😏
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
