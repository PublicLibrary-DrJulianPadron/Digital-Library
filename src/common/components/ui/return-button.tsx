import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ReturnButton = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-md font-mono tracking-tighter text-muted-foreground hover:text-primary transition-colors"
        >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
            {t('common.return')}
        </button>
    );
};