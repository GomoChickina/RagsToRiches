import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// COMPONENTS
import { HeroSection } from '@/components/game/HeroSection';
import { GameBoard } from '@/components/game/GameBoard';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Navigation, Page as NavPage } from '@/components/game/Navigation';
import { TutorialSection } from '@/components/game/TutorialSection';
import { CharacterShop } from '@/components/game/CharacterShop';
// TYPES & API
import { PlayerCharacter, BackendUser, SituationCard } from '@/types/game';
import { api } from "@/hooks/Api";
import { toast } from "sonner";
import { AuthPanel } from '@/components/auth/AuthPanel'; // Make sure this path is correct!
import { useAuth } from '@/components/auth/AuthContext'; // Make sure this path is correct!
import { Loader2 } from 'lucide-react';

type Page = NavPage | 'leaderboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);

  // Hook into your new global auth system
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<PlayerCharacter | null>(null);
  const [cards, setCards] = useState<SituationCard[]>([]);

  const refreshGameData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Always fetch the cards
      const backendCards = await api.getCards();
      if (backendCards) setCards(backendCards);

      // 2. Fetch real user or create temporary Guest
      if (authUser) {
        const backendUser = await api.getProfile(authUser.id);
        if (backendUser) setUser(backendUser as PlayerCharacter);
      } else {
        // Guest Mode fallback
        setUser({
          id: "guest_" + Math.random().toString(36).substring(2, 9),
          name: "Guest",
          email: "guest@example.com",
          appearance: { outfit: "default", hat: "none", glasses: "none", accessory: "none" },
          inventory: ["default_outfit", "none_hat", "none_glasses", "none_accessory"],
          stats: { money: 1000, financeKnowledge: 0, happiness: 100 },
          overallScore: 0
        } as PlayerCharacter);
      }
    } catch {
      toast.error("Failed to load game data");
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    refreshGameData();
  }, [refreshGameData]);

  const handleGameEnd = async (score: number) => {
    if (!user) return;

    const newScore = (user.overallScore || 0) + score;
    const userToSave: BackendUser = {
      ...user,
      overallScore: newScore,
      stats: { ...user.stats, money: user.stats.money + score, financeKnowledge: user.stats.financeKnowledge + 10 }
    };

    if (authUser) {
      try {
        await api.saveProfile(userToSave);
        toast.success("Progress Saved!");
      } catch {
        toast.error("Failed to save progress to server.");
      }
    } else {
      toast.success(`Guest game over! You earned $${score}. Sign in to save next time!`);
    }

    refreshGameData();
    setCurrentPage('home');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-primary"><Loader2 className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans pb-24">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.05),transparent_60%)]" />
      </div>

      {/* Render the fully self-contained AuthPanel we built earlier */}
      <div className="relative z-50">
        <AuthPanel />
      </div>

      <AnimatePresence mode="wait">
        {/* HOME PAGE */}
        {currentPage === 'home' && user && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
            <HeroSection onNavigate={handleNavigate} playerCharacter={user} />
          </motion.div>
        )}

        {/* GAME PAGE */}
        {currentPage === 'play' && user && (
          <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
            <GameBoard playerCharacter={user} onGameEnd={handleGameEnd} cards={cards} />
          </motion.div>
        )}

        {/* LEADERBOARD PAGE */}
        {currentPage === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-20 relative">
            <Leaderboard onBack={() => setCurrentPage('home')} />
          </motion.div>
        )}

        {/* SHOP PAGE */}
        {currentPage === 'shop' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-20 relative">
            <CharacterShop
              userId={authUser?.id ?? null}
              isLoggedIn={!!authUser}
              onClose={() => setCurrentPage('home')}
              onSignInClick={() => setCurrentPage('home')}
            />
          </motion.div>
        )}

        {/* LEARN PAGE */}
        {currentPage === 'learn' && (
          <motion.div key="learn" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="z-20 relative">
            <TutorialSection />
          </motion.div>
        )}
      </AnimatePresence>
      <Navigation currentPage={currentPage as NavPage} onNavigate={(p) => setCurrentPage(p)} />
    </div>
  );
};

export default Index;