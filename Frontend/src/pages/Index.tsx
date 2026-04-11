import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { HeroSection } from "@/components/game/HeroSection";
import { TutorialSection } from "@/components/game/TutorialSection";
import { api } from "@/hooks/Api";
import { useAuth } from "@/components/auth/AuthContext";
import { PlayerCharacter } from "@/types/game";
import { toast } from "sonner";

const createGuestPlayer = (): PlayerCharacter => ({
  id: `guest_${Math.random().toString(36).slice(2, 9)}`,
  name: "Guest",
  email: "guest@example.com",
  appearance: { outfit: "default_outfit", hat: "none_hat", glasses: "none_glasses", accessory: "none_accessory" },
  inventory: ["default_outfit", "none_hat", "none_glasses", "none_accessory"],
  stats: { money: 1000, financeKnowledge: 0, happiness: 100 },
  overallScore: 0,
});

const Index = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [player, setPlayer] = useState<PlayerCharacter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      setLoading(true);
      try {
        if (!authUser) {
          setPlayer(createGuestPlayer());
          return;
        }

        const profile = await api.getProfile(authUser.id);
        if (profile) {
          setPlayer(profile);
        } else {
          setPlayer(authUser);
        }
      } catch (error) {
        console.error("Failed to load home profile", error);
        toast.error("Could not load your profile. Showing guest mode.");
        setPlayer(createGuestPlayer());
      } finally {
        setLoading(false);
      }
    };

    void loadHome();
  }, [authUser]);

  const handleNavigate = (page: "play" | "learn" | "shop" | "leaderboard") => {
    if (page === "learn") {
      const tutorial = document.getElementById("learn-section");
      tutorial?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate(page === "leaderboard" ? "/leaderboard" : page === "play" ? "/play" : "/shop");
  };

  if (loading || !player) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-primary">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onNavigate={handleNavigate} playerCharacter={player} />
      <section id="learn-section">
        <TutorialSection />
      </section>
    </div>
  );
};

export default Index;
