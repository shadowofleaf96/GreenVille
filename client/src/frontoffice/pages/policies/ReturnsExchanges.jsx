import React from "react";
import { useTranslation } from "react-i18next";
import MetaData from "../../components/MetaData";

const ReturnsAndExchanges = () => {
    const { t } = useTranslation();

    return (
        <>
            <MetaData title="Returns & Exchanges - GreenVille" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-4 text-center">{t('returnsAndExchanges.title')}</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{t('returnsAndExchanges.returnPolicy')}</h2>
                    <p className="text-gray-700 mb-2">{t('returnsAndExchanges.returnPolicyDetails')}</p>
                    <p className="text-gray-700 mb-2">{t('returnsAndExchanges.returnEligibility')}</p>
                    <p className="text-gray-700">{t('returnsAndExchanges.nonReturnableItems')}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{t('returnsAndExchanges.howToReturn')}</h2>
                    <ol className="list-decimal ml-5">
                        <li>{t('returnsAndExchanges.returnSteps.step1')}</li>
                        <li>{t('returnsAndExchanges.returnSteps.step2')}</li>
                        <li>{t('returnsAndExchanges.returnSteps.step3')}</li>
                        <li>{t('returnsAndExchanges.returnSteps.step4')}</li>
                        <li>{t('returnsAndExchanges.returnSteps.step5')}</li>
                    </ol>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{t('returnsAndExchanges.exchanges')}</h2>
                    <p className="text-gray-700 mb-2">{t('returnsAndExchanges.exchangeDetails')}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{t('returnsAndExchanges.faq')}</h2>
                    <div className="mb-4">
                        <h3 className="font-semibold">{t('returnsAndExchanges.faq1.question')}</h3>
                        <p>{t('returnsAndExchanges.faq1.answer')}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold">{t('returnsAndExchanges.faq2.question')}</h3>
                        <p>{t('returnsAndExchanges.faq2.answer')}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold">{t('returnsAndExchanges.faq3.question')}</h3>
                        <p>{t('returnsAndExchanges.faq3.answer')}</p>
                    </div>
                </div>

                <p className="text-center font-semibold">{t('returnsAndExchanges.thankYou')}</p>
            </div>
        </>
    );
};

export default ReturnsAndExchanges;
