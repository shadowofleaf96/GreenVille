import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const CTA2 = () => {
    const { t } = useTranslation();

    return (
        <section aria-labelledby="cta2-heading">
            <div className="overflow-hidden mt-2 lg:mt-8 mb-4 lg:mb-12 pt-4 mx-4 md:pt-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-xl">
                    <div className="relative flex items-center gap-6 py-6 px-6 md:pb-8 md:pt-8">
                        <div className="flex-1">
                            <h2
                                id="cta2-heading"
                                className="text-4xl font-semibold tracking-tight text-[#8DC63F] md:text-5xl"
                            >
                                {t("cta2_heading")}
                            </h2>
                            <p className="mt-6 text-md md:text-lg text-gray-600">
                                <Trans
                                    i18nKey="cta2_paragraph"
                                    values={{ amount: '1500dh' }}
                                    components={{ 1: <span className="font-bold"></span> }}
                                />
                            </p>
                            <div className="mt-6 text-base">
                                <Link
                                    to="/products"
                                    className="font-semibold text-[#8DC63F]"
                                >
                                    {t("cta2_link")}<span aria-hidden="true"> &rarr;</span>
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-6">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-64 w-64 rounded-lg object-contain md:h-72 md:w-72"
                                    src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/0bca71897aa053232e6c77888dbd8b95"
                                    alt="Fresh Vegetables"
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <img
                                    className="h-64 w-64 rounded-lg object-contain md:h-72 md:w-72"
                                    src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/b642bedbad44c86730a61fe43340f1c2"
                                    alt="Fresh Vegetables"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA2;
