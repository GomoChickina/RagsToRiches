import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { PlayerCharacter, SituationCard, API_URL, BackendUser } from '@/types/game';
import { api } from '@/hooks/Api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthContext';

const Game = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth(); // Grab the logged-in user!

    const [user, setUser] = useState<PlayerCharacter | null>(null);
    const [cards, setCards] = useState<SituationCard[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Game Data
    useEffect(() => {
        const loadGameData = async () => {
            try {
                // 1. Always fetch the game cards
                const cRes = await fetch(`${API_URL}/cards`);
                const cardData = await cRes.json();
                setCards(cardData);

                // 2. Handle User Profile (Logged In vs Guest)
                if (authUser) {
                    // Fetch real profile from MongoDB
                    const uRes = await fetch(`${API_URL}/profile/${authUser.id}`);
                    if (!uRes.ok) throw new Error("Profile not found");
                    const userData = await uRes.json();
                    setUser(userData);
                } else {
                    // Generate a temporary Guest profile in memory
                    setUser({
                        id: "guest_" + Math.random().toString(36).substring(2, 9),
                        name: "Guest Player",
                        email: "guest@example.com",
                        appearance: { outfit: "default", hat: "none", glasses: "none", accessory: "none" },
                        inventory: ["default_outfit", "none_hat", "none_glasses", "none_accessory"],
                        stats: { money: 1000, financeKnowledge: 0, happiness: 100 },
                        overallScore: 0
                    } as PlayerCharacter);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load game data");
                navigate('/'); // Go back home on error
            } finally {
                setLoading(false);
            }
        };
        loadGameData();
    }, [authUser, navigate]);

    const handleGameEnd = async (score: number) => {
        if (!user) return;

        // 1. Calculate New Stats
        const newTotalPoints = (user.overallScore || 0) + Math.round(score);

        // 2. Prepare Payload
        const userToSave: BackendUser = {
            ...user,
            overallScore: newTotalPoints,
            stats: {
                ...user.stats,
                money: user.stats.money + score,
                financeKnowledge: user.stats.financeKnowledge + 10
            }
        };

        // 3. Save Logic
        if (authUser) {
            try {
                // Real user: Save to MongoDB
                await api.saveProfile(userToSave);
                toast.success(`Game Over! You earned $${score}`);
            } catch (err) {
                toast.error("Failed to save progress");
            }
        } else {
            // Guest user: Just show a toast, don't ping the database
            toast.success(`Game Over, Guest! Sign in next time to save your ${newTotalPoints} points!`);
        }

        navigate('/'); // Return to Main Menu
    };

    if (loading || !user) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <GameBoard
                playerCharacter={user}
                cards={cards}
                onGameEnd={handleGameEnd}
            />
        </div>
    );
};

export default Game;