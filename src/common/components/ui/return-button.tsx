import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const ReturnButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-biblioteca-blue text-white rounded hover:bg-biblioteca-blue/80 w-max"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
        </Button>
    );
};