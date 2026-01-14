import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MetaData from "../../components/MetaData";

const ReturnsAndExchanges = () => {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const returnsPolicy = settings?.policies?.returns;

  if (
    (settings?.policies && settings?.policies.isActive === false) ||
    returnsPolicy?.isActive === false
  ) {
    return null;
  }

  const currentLang = i18n.language;

  return (
    <div>
      <MetaData title={t("returns_exchanges.title")} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("returns_exchanges.title")}
        </h1>

        <div className="prose max-w-none whitespace-pre-wrap">
          {returnsPolicy?.text?.[currentLang] || (
            <>
              <p className="mb-4">{t("returns_exchanges.intro")}</p>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {t("returnsAndExchanges.returnPolicy")}
                </h2>
                <p className="text-gray-700 mb-2">
                  {t("returnsAndExchanges.returnPolicyDetails")}
                </p>
                <p className="text-gray-700 mb-2">
                  {t("returnsAndExchanges.returnEligibility")}
                </p>
                <p className="text-gray-700">
                  {t("returnsAndExchanges.nonReturnableItems")}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {t("returnsAndExchanges.howToReturn")}
                </h2>
                <ol className="list-decimal ml-5">
                  <li>{t("returnsAndExchanges.returnSteps.step1")}</li>
                  <li>{t("returnsAndExchanges.returnSteps.step2")}</li>
                  <li>{t("returnsAndExchanges.returnSteps.step3")}</li>
                  <li>{t("returnsAndExchanges.returnSteps.step4")}</li>
                  <li>{t("returnsAndExchanges.returnSteps.step5")}</li>
                </ol>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {t("returnsAndExchanges.exchanges")}
                </h2>
                <p className="text-gray-700 mb-2">
                  {t("returnsAndExchanges.exchangeDetails")}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {t("returnsAndExchanges.faq")}
                </h2>
                <div className="mb-4">
                  <h3 className="font-semibold">
                    {t("returnsAndExchanges.faq1.question")}
                  </h3>
                  <p>{t("returnsAndExchanges.faq1.answer")}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold">
                    {t("returnsAndExchanges.faq2.question")}
                  </h3>
                  <p>{t("returnsAndExchanges.faq2.answer")}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold">
                    {t("returnsAndExchanges.faq3.question")}
                  </h3>
                  <p>{t("returnsAndExchanges.faq3.answer")}</p>
                </div>
              </div>

              <p className="text-center font-semibold">
                {t("returnsAndExchanges.thankYou")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndExchanges;
