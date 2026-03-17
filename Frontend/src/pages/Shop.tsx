import { useNavigate } from "react-router-dom";
import { CharacterShop } from "@/components/game/CharacterShop";
import { useAuth } from "@/components/auth/AuthContext";

const Shop = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-emerald-950 to-slate-950">
            <CharacterShop
                userId={authUser?.id ?? null}
                isLoggedIn={!!authUser}
                onClose={() => navigate('/')}
                onSignInClick={() => navigate('/')}
            />
        </div>
    );
};

export default Shop;