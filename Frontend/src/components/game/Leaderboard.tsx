import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, TrendingUp, PiggyBank, Target, Wallet, PieChart, DollarSign, ArrowUp, Crown } from 'lucide-react';
import { api } from '@/hooks/Api';
import { BackendUser } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LeaderboardProps {
    onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
    const [players, setPlayers] = useState<BackendUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await api.getLeaderboard();
                // Sort descending by score just to be safe
                const sorted = (data || []).sort((a: BackendUser, b: BackendUser) => (b.overallScore || 0) - (a.overallScore || 0));
                setPlayers(sorted);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                toast.error("Could not load rankings");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Split top 3 for the podium, and the rest for the list
    const top3 = players.slice(0, 3);
    const restOfPlayers = players.slice(3, 10);

    // Safely get players for specific podium spots (Rank 1, 2, 3)
    const firstPlace = top3[0];
    const secondPlace = top3[1];
    const thirdPlace = top3[2];

    return (
        <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans flex flex-col pb-32">

            {/* ========================================= */}
            {/* 1. BACKGROUND DECORATION (Matches Home)   */}
            {/* ========================================= */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-60" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                <FloatingElement className="absolute top-[10%] left-[5%] text-emerald-500/10" delay={0} duration={8}><TrendingUp className="w-16 h-16 rotate-[-12deg]" /></FloatingElement>
                <FloatingElement className="absolute top-[28%] left-[18%] text-emerald-300/10" delay={1} duration={9}><PieChart className="w-12 h-12" /></FloatingElement>
                <FloatingElement className="absolute bottom-[20%] left-[8%] text-emerald-400/10" delay={1.5} duration={7}><PiggyBank className="w-14 h-14 rotate-[12deg]" /></FloatingElement>
                <FloatingElement className="absolute top-[15%] right-[8%] text-gold/10" delay={2} duration={8}><Target className="w-12 h-12" /></FloatingElement>
                <FloatingElement className="absolute bottom-[25%] right-[10%] text-blue-400/10" delay={0.5} duration={7}><Wallet className="w-16 h-16 rotate-[-6deg]" /></FloatingElement>

                <RisingSymbol symbol={<DollarSign />} left="15%" delay={0} size={18} />
                <RisingSymbol symbol={<ArrowUp />} left="85%" delay={2} size={14} />
            </div>

            {/* ========================================= */}
            {/* 2. HEADER                                 */}
            {/* ========================================= */}
            <div className="relative z-10 flex items-center p-6 max-w-5xl mx-auto w-full">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-gold drop-shadow-lg" />
                    <h1 className="font-display text-3xl font-bold text-white tracking-tight">Top Players</h1>
                </div>
            </div>

            {/* ========================================= */}
            {/* 3. CONTENT AREA                           */}
            {/* ========================================= */}
            <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-emerald-400 animate-pulse font-bold text-xl">
                        Loading Ranks...
                    </div>
                ) : (
                    <>
                        {/* --- PODIUM SECTION (Fills upper white space) --- */}
                        <div className="flex justify-center items-end gap-2 sm:gap-6 mt-12 mb-16 h-[300px]">

                            {/* Rank 2 (Left) */}
                            {secondPlace && (
                                <PodiumBar
                                    user={secondPlace}
                                    rank={2}
                                    height="h-[180px]"
                                    color="bg-emerald-800/80 border-emerald-500/30 text-emerald-200"
                                    delay={0.2}
                                />
                            )}

                            {/* Rank 1 (Center) */}
                            {firstPlace && (
                                <PodiumBar
                                    user={firstPlace}
                                    rank={1}
                                    height="h-[260px]"
                                    color="bg-primary border-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.3)] text-emerald-950"
                                    delay={0}
                                    isWinner
                                />
                            )}

                            {/* Rank 3 (Right) */}
                            {thirdPlace && (
                                <PodiumBar
                                    user={thirdPlace}
                                    rank={3}
                                    height="h-[140px]"
                                    color="bg-emerald-900/80 border-emerald-600/30 text-emerald-300"
                                    delay={0.4}
                                />
                            )}
                        </div>

                        {/* --- LIST SECTION (Fills lower white space) --- */}
                        <div className="w-full bg-emerald-950/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
                            <h2 className="text-xl font-bold text-emerald-100 mb-4 px-2">Global Rankings</h2>

                            {restOfPlayers.length > 0 ? (
                                <div className="space-y-3">
                                    {restOfPlayers.map((user, idx) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + (idx * 0.1) }}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-emerald-500/50 w-6 text-right">#{idx + 4}</span>
                                                <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center overflow-hidden border border-emerald-500/30">
                                                    {/* Tiny avatar preview */}
                                                    <div className="scale-[0.3] mt-4">
                                                        <PlayerCharacterComponent character={user} size="sm" />
                                                    </div>
                                                </div>
                                                <span className="font-bold text-white">{user.name}</span>
                                            </div>
                                            <div className="font-mono font-bold text-primary">
                                                {Math.round(user.overallScore || 0).toLocaleString()} pts
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 opacity-60">
                                    <Medal className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
                                    <p className="text-emerald-200 font-medium">More players needed to fill the board!</p>
                                    <p className="text-sm text-emerald-300/70">Keep playing to secure your spot.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// --- SUB-COMPONENTS ---

interface PodiumBarProps {
    user: BackendUser;
    rank: number;
    height: string;
    color: string;
    delay: number;
    isWinner?: boolean;
}

const PodiumBar = ({ user, rank, height, color, delay, isWinner }: PodiumBarProps) => {
    return (
        <div className="flex flex-col items-center justify-end w-24 sm:w-32">
            {/* Avatar & Score */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.3 }}
                className="flex flex-col items-center mb-3 relative z-10"
            >
                {isWinner && (
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: delay + 0.6, type: "spring" }}
                        className="absolute -top-8 text-gold drop-shadow-lg"
                    >
                        <Crown className="w-8 h-8 fill-current" />
                    </motion.div>
                )}

                <div className={cn(
                    "rounded-full border-4 p-1 bg-slate-900 shadow-xl z-10 relative",
                    isWinner ? "border-gold scale-110 mb-2" : rank === 2 ? "border-slate-400" : "border-amber-700"
                )}>
                    <PlayerCharacterComponent character={user} size="sm" />

                    {/* Rank Badge attached to avatar */}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                        {rank}
                    </div>
                </div>

                <div className="text-center mt-3">
                    <p className="text-xs font-bold text-white truncate w-24 px-1">{user.name}</p>
                    <p className="text-sm font-black text-primary drop-shadow-md">
                        {Math.round(user.overallScore || 0).toLocaleString()}
                    </p>
                </div>
            </motion.div>

            {/* The Physical Podium Bar */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 0.8, delay, type: "spring", bounce: 0.2 }}
                className={cn(
                    "w-full rounded-t-xl border-t border-l border-r flex items-end justify-center pb-4 backdrop-blur-sm",
                    height,
                    color
                )}
            >
                <span className="text-6xl font-black opacity-20">{rank}</span>
            </motion.div>
        </div>
    );
};


// --- BACKGROUND ANIMATION HELPERS ---

const FloatingElement = ({ children, className, delay, duration = 6 }: { children: React.ReactNode, className?: string, delay: number, duration?: number }) => (
    <motion.div
        className={className}
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay }}
    >
        {children}
    </motion.div>
);

const RisingSymbol = ({ symbol, left, delay, size }: { symbol: React.ReactNode, left: string, delay: number, size: number }) => (
    <motion.div
        className="absolute bottom-[-50px] text-emerald-500/20"
        style={{ left, fontSize: size }}
        animate={{ y: [-50, -800], opacity: [0, 0.5, 0], x: [0, Math.random() * 50 - 25] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: delay }}
    >
        {symbol}
    </motion.div>
);