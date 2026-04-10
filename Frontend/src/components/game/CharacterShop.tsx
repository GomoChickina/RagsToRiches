import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayerCharacter, GameItem } from '@/types/game';
import { PlayerCharacterComponent } from './PlayerCharacter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ShoppingBag, Sparkles, Lock, Check, Coins, ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { api } from "@/hooks/Api";

const VISUAL_ASSETS: Record<string, { icon: string; desc: string }> = {
  'default_outfit': { icon: '👕', desc: 'Your everyday look' },
  'business_suit': { icon: '👔', desc: 'Dress for success' },
  'cool_hoodie': { icon: '🧥', desc: 'Comfy and stylish' },
  'grad_cap': { icon: '🎓', desc: 'Proof of genius' },
  'red_cap': { icon: '🧢', desc: 'Cool vibes' },
  'shades': { icon: '🕶️', desc: 'Cool shades' },
  'gold_chain': { icon: '⛓️', desc: 'Bling bling' },
};

const DEFAULT_GUEST_CHARACTER: PlayerCharacter = {
  id: 'guest',
  name: 'Guest',
  email: '',
  appearance: { outfit: 'default', hat: 'none', glasses: 'none', accessory: 'none' },
  inventory: [],
  stats: { money: 0, financeKnowledge: 0, happiness: 100 },
  overallScore: 0,
  outfit: '',
  accessory: ''
};

interface CharacterShopProps {
  userId: string | null;
  isLoggedIn: boolean;
  onClose: () => void;
  onSignInClick?: () => void;
}

type TabType = 'outfit' | 'hat' | 'glasses' | 'accessory';

export const CharacterShop = ({ userId, isLoggedIn, onClose, onSignInClick }: CharacterShopProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('outfit');
  const [user, setUser] = useState<PlayerCharacter | null>(null);
  const [catalog, setCatalog] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUser, setPreviewUser] = useState<PlayerCharacter>(DEFAULT_GUEST_CHARACTER);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch catalog independently so the shop ALWAYS has items
        const catalogData = await api.getShopCatalog();
        setCatalog(catalogData || []);

        // 2. Try to fetch the user profile separately
        if (isLoggedIn && userId) {
          try {
            const userData = await api.getProfile(userId);
            if (userData) {
              if (!userData.inventory) userData.inventory = [];
              const pc = userData as PlayerCharacter;
              setUser(pc);
              setPreviewUser(pc);
            }
          } catch (profileErr) {
            console.warn("Could not load user profile, defaulting to guest view", profileErr);
            setUser(null);
            setPreviewUser(DEFAULT_GUEST_CHARACTER);
          }
        } else {
          setUser(null);
          setPreviewUser(DEFAULT_GUEST_CHARACTER);
        }
      } catch (err) {
        toast.error("Failed to load shop catalog");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, isLoggedIn]);

  const handleBuy = async (item: GameItem) => {
    if (!user) return; setLoading(true);
    try {
      const updatedUser = await api.buyItem(userId, item.id);
      if (updatedUser) {
        setUser(updatedUser as PlayerCharacter);
        setPreviewUser(updatedUser as PlayerCharacter);
        toast.success(`Bought ${item.name}!`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not buy item");
    } finally {
      setLoading(false);
    }
  };

  const handleEquip = async (item: GameItem) => {
    if (!user) return; setLoading(true);
    try {
      const updatedUser = await api.equipItem(userId, item.id);
      if (updatedUser) {
        setUser(updatedUser as PlayerCharacter);
        setPreviewUser(updatedUser as PlayerCharacter);
        toast.success(`Equipped ${item.name}!`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not equip item");
    } finally {
      setLoading(false);
    }
  };

  const handleHover = (item: GameItem | null) => {
    const base = user ?? DEFAULT_GUEST_CHARACTER;
    if (!item) setPreviewUser(base);
    else {
      const updated = { ...base, appearance: { ...base.appearance } };
      if (item.type === 'outfit') updated.appearance.outfit = item.id;
      if (item.type === 'hat') updated.appearance.hat = item.id;
      if (item.type === 'glasses') updated.appearance.glasses = item.id;
      if (item.type === 'accessory') updated.appearance.accessory = item.id;
      setPreviewUser(updated);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-emerald-950 flex flex-col items-center justify-center text-emerald-50">
      <Loader2 className="animate-spin w-10 h-10 mb-4" />
      <h2 className="text-xl font-bold">Loading Style Shop...</h2>
    </div>
  );

  const currentItems = catalog.filter(i => i.type === activeTab);
  const canBuyOrEquip = isLoggedIn && user != null;

  return (
    <motion.div className="fixed inset-0 bg-slate-950 backdrop-blur-xl z-50 flex flex-col overflow-y-auto lg:overflow-hidden">
      {/* Header - Mobile Sticky Height Fix */}
      <div className="h-16 p-4 border-b border-emerald-500/30 flex items-center justify-between bg-emerald-950/80 sticky top-0 z-30">
        <button onClick={onClose} className="flex items-center gap-2 text-emerald-100"><ArrowLeft className="w-4 h-4" /><span className="font-semibold text-sm">Back</span></button>
        <div className="bg-emerald-900/80 rounded-full px-3 py-1 border border-emerald-500/40 flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-gold" /><span className="font-bold text-sm text-emerald-50">${user ? Math.round(user.stats.money) : 0}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Top/Left: Preview - Optimized for Mobile Viewport */}
        <div className="w-full lg:w-1/3 lg:min-w-[300px] border-b lg:border-b-0 lg:border-r border-emerald-500/20 bg-gradient-to-b from-emerald-950 to-slate-950 flex flex-col items-center justify-center p-4 py-8 lg:p-6 lg:py-6 shrink-0">
          <div className="w-48 h-56 mb-4 transition-all flex items-center justify-center scale-75 sm:scale-100 origin-center">
            <PlayerCharacterComponent character={previewUser} size="lg" />
          </div>
          <div className="text-center text-emerald-100/60 text-[10px] sm:text-sm max-w-[200px]">Customize your avatar with your smart earnings.</div>
        </div>

        {/* Bottom/Right: Grid with Scrollable Tabs */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
          <div className="flex gap-2 p-3 sm:p-4 border-b border-emerald-500/20 bg-slate-950/90 overflow-x-auto no-scrollbar whitespace-nowrap sticky top-16 lg:static z-20">
            {(['outfit', 'hat', 'glasses', 'accessory'] as TabType[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-semibold capitalize transition-all whitespace-nowrap",
                  activeTab === t
                    ? "bg-emerald-500 text-emerald-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : "bg-emerald-900/40 text-emerald-100/80 border border-emerald-500/20"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 p-3 sm:p-4 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-24 lg:pb-6">
            {currentItems.map(item => {
              const owned = canBuyOrEquip && user?.inventory?.includes(item.id);
              const equipped = canBuyOrEquip && user && ((item.type === 'outfit' && user.appearance.outfit === item.id) || (item.type === 'hat' && user.appearance.hat === item.id) || (item.type === 'glasses' && user.appearance.glasses === item.id) || (item.type === 'accessory' && user.appearance.accessory === item.id));
              const visual = VISUAL_ASSETS[item.id] || { icon: '✨', desc: '' };
              return (
                <div key={item.id} onMouseEnter={() => handleHover(item)} onMouseLeave={() => handleHover(null)} className={cn("relative p-3 sm:p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/30 flex flex-col gap-2.5 sm:gap-3", equipped && "border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-lg sm:text-xl">{visual.icon}</div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs sm:text-sm text-emerald-50 truncate">{item.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-emerald-200/60 truncate">{visual.desc}</div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] sm:text-xs shrink-0"><div className="font-bold text-emerald-300">${item.price}</div></div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="text-[9px] sm:text-[10px] text-emerald-200/50">{owned ? "Owned" : "Available"}</div>
                    <div className="flex gap-2">
                      {!canBuyOrEquip ? <span className="text-amber-200/70 text-[9px] font-bold uppercase tracking-tighter">Login Required</span> : equipped ? <span className="text-emerald-400 text-[9px] font-bold uppercase">Equipped</span> : owned ? <button onClick={() => handleEquip(item)} className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500 text-emerald-950 active:scale-95 transition-transform">Equip</button> : <button onClick={() => handleBuy(item)} className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950 flex items-center gap-1 active:scale-95 transition-transform"><ShoppingBag className="w-2.5 h-2.5" /> Buy</button>}
                    </div>
                  </div>
                </div>
              );
            })}
            {currentItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-emerald-500/40 text-xs sm:text-sm italic">
                No items available in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};