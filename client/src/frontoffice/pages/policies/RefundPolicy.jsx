import React from 'react';
import MetaData from "../../components/MetaData";
import { useTranslation } from 'react-i18next';

const RefundPolicy = () => {
  const { t } = useTranslation();

  return (
    <div>
      <MetaData title={t('refund_policy.title')} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('refund_policy.title')}</h1>

        <p className="mb-4">
          {t('refund_policy.intro')}
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.eligibility_title')}</h2>
        <p className="mb-4">
          {t('refund_policy.eligibility_description')}
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>{t('refund_policy.criteria_1')}</li>
          <li>{t('refund_policy.criteria_2')}</li>
          <li>{t('refund_policy.criteria_3')}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.non_refundable_title')}</h2>
        <p className="mb-4">{t('refund_policy.non_refundable_description')}</p>
        <ul className="list-disc ml-6 mb-4">
          <li>{t('refund_policy.non_refundable_1')}</li>
          <li>{t('refund_policy.non_refundable_2')}</li>
          <li>{t('refund_policy.non_refundable_3')}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.request_refund_title')}</h2>
        <p className="mb-4">{t('refund_policy.request_refund_description', { email: 'support@greenville.com' })}</p>
        <ul className="list-disc ml-6 mb-4">
          <li>{t('refund_policy.request_info_1')}</li>
          <li>{t('refund_policy.request_info_2')}</li>
          <li>{t('refund_policy.request_info_3')}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.processing_refunds_title')}</h2>
        <p className="mb-4">{t('refund_policy.processing_refunds_description')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.shipping_costs_title')}</h2>
        <p className="mb-4">{t('refund_policy.shipping_costs_description')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">{t('refund_policy.contact_us_title')}</h2>
        <p className="mb-4">{t('refund_policy.contact_us_description')}</p>

        <p className="text-center mt-10">{t('refund_policy.thank_you')}</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
