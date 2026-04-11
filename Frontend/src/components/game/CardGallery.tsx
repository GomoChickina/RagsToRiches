import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GameCard } from './GameCard';
import { budgetCards } from '@/data/cards';
import { CardCategory } from '@/types/game';
import { cn } from '@/lib/utils';
import { Wallet, TrendingDown, PiggyBank, LineChart } from 'lucide-react';

const categories: { id: CardCategory; label: string; icon: ReactNode }[] = [
  { id: 'income', label: 'Income', icon: <Wallet className="w-4 h-4" /> },
  { id: 'expense', label: 'Expenses', icon: <TrendingDown className="w-4 h-4" /> },
  { id: 'savings', label: 'Savings', icon: <PiggyBank className="w-4 h-4" /> },
  { id: 'investment', label: 'Investments', icon: <LineChart className="w-4 h-4" /> },
];

const getCategoryButtonClass = (catId: CardCategory, isSelected: boolean) => {
  if (!isSelected) return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  
  switch (catId) {
    case 'income': return 'bg-income text-white';
    case 'expense': return 'bg-expense text-white';
    case 'savings': return 'bg-savings text-white';
    case 'investment': return 'bg-investment text-black';
    default: return 'bg-primary text-primary-foreground';
  }
};

export const CardGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');

  const filteredCards = selectedCategory === 'all' 
    ? budgetCards 
    : budgetCards.filter(card => card.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background/80 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
        >
        <h2 className="font-display text-3xl mb-2 text-gradient-gold">Card Collection</h2>
        <p className="text-muted-foreground">Explore all budget cards and learn their effects</p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            All Cards
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                getCategoryButtonClass(cat.id, selectedCategory === cat.id)
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <motion.div 
          layout
          className="flex flex-wrap justify-center gap-6"
        >
          {filteredCards.map((card, index) => (
            <GameCard key={card.id} card={card} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
