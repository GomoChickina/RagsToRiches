import { useNavigate } from "react-router-dom";
import { Leaderboard as LeaderboardComponent } from "@/components/game/Leaderboard";

const Leaderboard = () => {
    const navigate = useNavigate();

    return (
        <LeaderboardComponent
            onBack={() => navigate('/')}
        />
    );
};

export default Leaderboard;