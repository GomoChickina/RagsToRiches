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
        if (isLoggedIn && userId) {
          const [userData, catalogData] = await Promise.all([
            api.getProfile(userId),
            api.getShopCatalog()
          ]);
          if (userData) {
            if (!userData.inventory) userData.inventory = [];
            const pc = userData as PlayerCharacter;
            setUser(pc);
            setPreviewUser(pc);
          } else {
            setUser(null);
            setPreviewUser(DEFAULT_GUEST_CHARACTER);
          }
          setCatalog(catalogData);
        } else {
          const catalogData = await api.getShopCatalog();
          setCatalog(catalogData);
          setUser(null);
          setPreviewUser(DEFAULT_GUEST_CHARACTER);
        }
      } catch (err) {
        console.error("Shop load error:", err);
        toast.error("Failed to load shop");
        setUser(null);
        setPreviewUser(DEFAULT_GUEST_CHARACTER);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, isLoggedIn]);

  const handleBuy = async (item: GameItem) => {
    console.log(`🔍 Attempting to buy: ${item.id}`);
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await api.buyItem(userId, item.id);
      console.log("🔍 Buy Success:", updatedUser);
      if (updatedUser) {
        setUser(updatedUser as PlayerCharacter);
        setPreviewUser(updatedUser as PlayerCharacter);
        toast.success(`Bought ${item.name}!`);
      }
    } catch (err: any) {
      console.error("🔍 Buy Failed:", err);
      toast.error(err.message || "Could not buy item");
    } finally {
      setLoading(false);
    }
  };
  const applyPreview = (base: PlayerCharacter, item: GameItem | null): PlayerCharacter => {
    if (!item) return base;
    const updated: PlayerCharacter = {
      ...base,
      appearance: { ...base.appearance },
    };
    if (item.type === 'outfit') updated.appearance.outfit = item.id;
    if (item.type === 'hat') updated.appearance.hat = item.id;
    if (item.type === 'glasses') updated.appearance.glasses = item.id;
    if (item.type === 'accessory') updated.appearance.accessory = item.id;
    return updated;
  };

  const handleEquip = async (item: GameItem) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await api.equipItem(userId, item.id);
      if (updatedUser) {
        setUser(updatedUser as PlayerCharacter);
        setPreviewUser(updatedUser as PlayerCharacter);
        toast.success(`Equipped ${item.name}!`);
      }
    } catch (err: any) {
      console.error("🔍 Equip Failed:", err);
      toast.error(err.message || "Could not equip item");
    } finally {
      setLoading(false);
    }
  };

  const handleHover = (item: GameItem | null) => {
    const base = user ?? DEFAULT_GUEST_CHARACTER;
    if (!item) {
      setPreviewUser(base);
    } else {
      setPreviewUser(applyPreview(base, item));
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-emerald-950 to-slate-950 flex flex-col items-center justify-center text-emerald-50">
      <Loader2 className="animate-spin w-10 h-10 mb-4" />
      <h2 className="text-xl font-bold tracking-wide">Loading Style Shop...</h2>
      <p className="text-sm text-emerald-300/70">Turning your smart moves into drip.</p>
    </div>
  );

  const currentItems = catalog.filter(i => i.type === activeTab);
  const canBuyOrEquip = isLoggedIn && user != null;

  return (
    <motion.div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.35),_rgba(2,6,23,0.95))] backdrop-blur-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-emerald-500/30 flex items-center justify-between bg-emerald-950/80">
        <button onClick={onClose} className="flex items-center gap-2 text-emerald-100 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Back to Journey</span>
        </button>
        <div className="flex items-center gap-2 text-emerald-100">
          {canBuyOrEquip && user && (
            <div className="bg-emerald-900/80 rounded-full px-3 py-1 border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.35)]">
              <Coins className="w-4 h-4 text-gold" />
              <span className="font-bold text-emerald-50">${Math.round(user.stats.money)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Guest: Sign in to buy banner */}
      {!canBuyOrEquip && (
        <div className="flex items-center justify-center gap-3 py-3 px-4 bg-amber-500/20 border-b border-amber-500/30 text-amber-100">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold text-sm">Sign in to buy and equip items.</span>
          {onSignInClick && (
            <button
              onClick={onSignInClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 text-emerald-950 font-bold text-sm hover:bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
            >
              <LogIn className="w-4 h-4" /> Sign in
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex">
        {/* Left: Character Preview */}
        <div className="w-1/3 min-w-[260px] border-r border-emerald-500/20 bg-gradient-to-b from-emerald-950 via-slate-950 to-black flex flex-col items-center justify-center p-6">
          <div className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-300/80 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Your Look
          </div>
          <div className="w-48 h-60 mb-4">
            <PlayerCharacterComponent character={previewUser} size="lg" />
          </div>
          <div className="text-center text-emerald-100/80 text-sm">
            Dress your avatar using the <span className="font-semibold text-emerald-300">money</span> you earn from smart choices.
          </div>
        </div>

        {/* Right: Shop Tabs + Grid */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 p-4 border-b border-emerald-500/20 bg-slate-950/80">
            {(['outfit', 'hat', 'glasses', 'accessory'] as TabType[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all",
                  activeTab === t
                    ? "bg-emerald-500 text-emerald-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : "bg-emerald-900/40 text-emerald-100/80 hover:bg-emerald-800/70 border border-emerald-500/20"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {currentItems.map(item => {
              const owned = canBuyOrEquip && user?.inventory?.includes(item.id);
              const equipped =
                canBuyOrEquip &&
                user &&
                ((item.type === 'outfit' && user.appearance.outfit === item.id) ||
                  (item.type === 'hat' && user.appearance.hat === item.id) ||
                  (item.type === 'glasses' && user.appearance.glasses === item.id) ||
                  (item.type === 'accessory' && user.appearance.accessory === item.id));

              const visual = VISUAL_ASSETS[item.id] || { icon: '✨', desc: '' };

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => handleHover(item)}
                  onMouseLeave={() => handleHover(null)}
                  className={cn(
                    "relative p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950 via-emerald-950/70 to-slate-950 flex flex-col gap-3",
                    equipped && "border-emerald-400/80 shadow-[0_0_24px_rgba(52,211,153,0.7)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-xl">
                        {visual.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-50">{item.name}</div>
                        <div className="text-xs text-emerald-200/80">{visual.desc}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-bold text-emerald-300">${item.price}</div>
                      {item.knowledgeReq > 0 && (
                        <div className="text-[11px] text-emerald-200/70">
                          Req: {item.knowledgeReq} 📚
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-emerald-200/75">
                      {owned ? "Owned" : canBuyOrEquip ? "New item" : "—"}
                    </div>
                    <div className="flex gap-2">
                      {!canBuyOrEquip ? (
                        <span className="flex items-center gap-1 text-amber-200/90 text-xs font-semibold">
                          <Lock className="w-3 h-3" /> Sign in to buy
                        </span>
                      ) : equipped ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <Check className="w-3 h-3" /> Equipped
                        </span>
                      ) : owned ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-emerald-950 hover:bg-amber-300 flex items-center gap-1 shadow-[0_0_10px_rgba(250,204,21,0.45)]"
                        >
                          <ShoppingBag className="w-3 h-3" /> Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {currentItems.length === 0 && (
              <div className="col-span-full text-center text-emerald-200/70 text-sm">
                No items in this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};