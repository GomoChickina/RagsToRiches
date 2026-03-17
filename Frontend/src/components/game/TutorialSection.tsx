import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingDown,
  PiggyBank,
  LineChart,
  Target,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Wallet,
  PieChart,
  ArrowUp,
  CreditCard,
  Landmark,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

// === DATA: UPDATED COLORS FOR DARK THEME ===
const concepts = [
  {
    title: 'Income',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    hoverBorder: 'group-hover:border-emerald-400/50',
    description: 'Money you earn from jobs, allowance, or gifts. This is the foundation of your budget!',
    tips: ['Track all income sources', 'Look for ways to increase earnings', 'Save a portion of every paycheck'],
  },
  {
    title: 'Expenses',
    icon: <TrendingDown className="w-6 h-6" />,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
    hoverBorder: 'group-hover:border-rose-400/50',
    description: 'Money you spend on needs and wants. Smart spending means knowing the difference!',
    tips: ['Needs vs wants - know the difference', 'Track every expense', 'Look for discounts and deals'],
  },
  {
    title: 'Savings',
    icon: <PiggyBank className="w-6 h-6" />,
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    borderColor: 'border-sky-400/20',
    hoverBorder: 'group-hover:border-sky-400/50',
    description: 'Money set aside for future goals and emergencies. Pay yourself first!',
    tips: ['Aim to save 20% of income', 'Build an emergency fund', 'Set specific savings goals'],
  },
  {
    title: 'Investments',
    icon: <LineChart className="w-6 h-6" />,
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    borderColor: 'border-violet-400/20',
    hoverBorder: 'group-hover:border-violet-400/50',
    description: 'Make your money work for you! Investments can grow over time through compound interest.',
    tips: ['Start early - time is your friend', 'Diversify your portfolio', 'Learn before you invest'],
  },
];

const budgetRules = [
  { rule: '50/30/20 Rule', description: '50% needs, 30% wants, 20% savings' },
  { rule: 'Pay Yourself First', description: 'Save before you spend' },
  { rule: 'Emergency Fund', description: '3-6 months of expenses saved' },
  { rule: 'Avoid Debt', description: "Don't spend more than you earn" },
];

export const TutorialSection = () => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden font-sans pb-32">

      {/* ========================================= */}
      {/* 1. BACKGROUND DECORATION (Matches Home)   */}
      {/* ========================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-[120px] opacity-50" />

        {/* Perspective Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

        {/* Floating Icons */}
        <FloatingElement className="absolute top-[10%] left-[5%] text-emerald-500/10" delay={0} duration={8}><TrendingUp className="w-16 h-16 rotate-[-12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[28%] left-[18%] text-emerald-300/10" delay={1} duration={9}><PieChart className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[20%] left-[8%] text-emerald-400/10" delay={1.5} duration={7}><PiggyBank className="w-14 h-14 rotate-[12deg]" /></FloatingElement>
        <FloatingElement className="absolute top-[15%] right-[8%] text-gold/10" delay={2} duration={8}><Target className="w-12 h-12" /></FloatingElement>
        <FloatingElement className="absolute bottom-[25%] right-[10%] text-blue-400/10" delay={0.5} duration={7}><Wallet className="w-16 h-16 rotate-[-6deg]" /></FloatingElement>

        {/* Bubbles */}
        <RisingSymbol symbol={<DollarSign />} left="10%" delay={0} size={18} />
        <RisingSymbol symbol={<ArrowUp />} left="90%" delay={2} size={14} />
      </div>

      {/* ========================================= */}
      {/* 2. CONTENT AREA                           */}
      {/* ========================================= */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 pt-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-emerald-900/50 rounded-2xl mb-4 border border-white/10 backdrop-blur-md shadow-lg">
            <Lightbulb className="w-8 h-8 text-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-white font-black tracking-tight drop-shadow-md">
            Learn Budgeting
          </h2>
          <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto font-medium">
            Master these core concepts to become financially literate and win the game!
          </p>
        </motion.div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                'group relative p-8 rounded-3xl border backdrop-blur-md transition-all duration-300',
                // Glassy Dark Green Background for all cards
                'bg-emerald-950/60 hover:bg-emerald-900/80 shadow-xl',
                concept.borderColor,
                concept.hoverBorder
              )}
            >
              {/* Card Header */}
              <div className="flex items-center gap-5 mb-6">
                <div className={cn('p-4 rounded-2xl shadow-inner', concept.bgColor, concept.color)}>
                  {concept.icon}
                </div>
                <h3 className={cn('font-display text-3xl font-bold', concept.color)}>
                  {concept.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-emerald-100/80 mb-6 text-lg leading-relaxed">
                {concept.description}
              </p>

              {/* Tips List */}
              <ul className="space-y-3 bg-black/20 p-5 rounded-xl border border-white/5">
                {concept.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-emerald-200/70">
                    <CheckCircle2 className={cn('w-5 h-5 mt-0.5 flex-shrink-0', concept.color)} />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Budget Rules Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="w-8 h-8 text-primary" />
            <h3 className="font-display text-3xl text-white font-bold">Golden Rules</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {budgetRules.map((item, index) => (
              <motion.div
                key={item.rule}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-500/20 backdrop-blur-sm hover:bg-emerald-800/50 transition-colors"
              >
                <h4 className="font-bold text-xl text-primary mb-2">{item.rule}</h4>
                <p className="text-emerald-200/70 font-medium">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pro Tips Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-900/50 border border-primary/20 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Decorative shine */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-gold/20 p-2 rounded-lg">
                <Lightbulb className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Pro Tip</h3>
            </div>
            <p className="text-emerald-100/80 text-lg leading-relaxed relative z-10">
              In the game, try to maintain a balance between spending and saving.
              While income cards add to your budget, <span className="text-sky-400 font-bold">savings</span> and{' '}
              <span className="text-violet-400 font-bold">investment</span> cards earn you more points!
              Smart financial decisions lead to higher scores.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// --- HELPER COMPONENTS (Background Animations) ---

const FloatingElement = ({ children, className, delay, duration = 6 }: { children: ReactNode, className?: string, delay: number, duration?: number }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

const RisingSymbol = ({ symbol, left, delay, size }: { symbol: ReactNode, left: string, delay: number, size: number }) => (
  <motion.div
    className="absolute bottom-[-50px] text-emerald-500/20"
    style={{ left, fontSize: size }}
    animate={{
      y: [-50, -800],
      opacity: [0, 0.5, 0],
      x: [0, Math.random() * 50 - 25]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear",
      delay: delay
    }}
  >
    {symbol}
  </motion.div>
);