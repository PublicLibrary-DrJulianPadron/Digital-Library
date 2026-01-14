import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const ReturnButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 w-max"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
        </Button>
    );
};