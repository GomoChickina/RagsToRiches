import { motion } from 'framer-motion';
import { Home, Gamepad2, BookOpen, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Page = 'home' | 'play' | 'learn' | 'shop';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'home' as Page, label: 'Home', icon: Home },
  { id: 'play' as Page, label: 'Play', icon: Gamepad2 },
  { id: 'learn' as Page, label: 'Learn', icon: BookOpen },
  { id: 'shop' as Page, label: 'Shop', icon: ShoppingBag },
];

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  return (
    // GLASS CONTAINER: Dark semi-transparent bg + Blur + White Border
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-full px-6 py-2 shadow-2xl z-50 flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className={cn(
              "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
              // Active: Bright Green Icon
              isActive ? "text-primary -translate-y-1" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]")} />

            {/* Active Dot Indicator */}
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
