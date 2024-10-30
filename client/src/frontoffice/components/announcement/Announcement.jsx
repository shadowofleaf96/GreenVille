import React from "react";
import { useTranslation } from 'react-i18next';

const Announcement = () => {
    const { t } = useTranslation();

    return (
        <div className="flex bg-gradient-to-r from-[#8DC63F] to-yellow-400 justify-center p-3">
            <span className="font-semibold text-center">
                {t("announcement")} 
            </span>
        </div>
    );
};

export default Announcement;
