import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '@/types/game';

interface GeminiCoachProps {
    context: {
        situationTitle: string;
        choiceText: string;
        impact: string;
    } | null;
    onAsked?: () => void;
    autoExplain?: boolean;
}

export const GeminiCoach: React.FC<GeminiCoachProps> = ({ context, onAsked, autoExplain }) => {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isExplaining, setIsExplaining] = useState(false);

    const requestExplanation = async () => {
        if (!context) return;

        // notify parent that the coach was invoked (for continue-button logic)
        onAsked?.();

        setIsExplaining(true);
        try {
            const response = await fetch(`${API_URL}/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(context)
            });

            if (!response.ok) throw new Error("API Error");

            const data = await response.json();
            setExplanation(data.explanation);
        } catch (err) {
            toast.error("The Financial Coach is busy right now.");
        } finally {
            setIsExplaining(false);
        }
    };

    // Reset explanation if the context changes (new card)
    React.useEffect(() => {
        setExplanation(null);
    }, [context]);

    // Automatically trigger explanation on worst choices when requested
    React.useEffect(() => {
        if (autoExplain && context && !explanation && !isExplaining) {
            void requestExplanation();
        }
    }, [autoExplain, context, explanation, isExplaining]);

    if (!context) return null;

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-6 px-4">
            <AnimatePresence mode="wait">
                {!explanation ? (
                    <motion.button
                        key="ask-button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={requestExplanation}
                        disabled={isExplaining}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-70"
                    >
                        {isExplaining ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Lightbulb className="w-5 h-5" />
                                Ask Coach Why?
                            </>
                        )}
                    </motion.button>
                ) : (
                    <motion.div
                        key="explanation-box"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-800/80 backdrop-blur-sm border-2 border-amber-500/30 p-5 rounded-2xl shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-amber-500">Coach&apos;s Insight</span>
                        </div>

                        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                            &quot;{explanation}&quot;
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};