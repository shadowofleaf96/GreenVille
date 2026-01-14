import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );
  const testimonials =
    settings?.testimonials?.length > 0 ? settings.testimonials : [];

  const currentLang = i18n.language;

  if (loading) {
    return (
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 flex justify-center">
        <p className="text-gray-500">Loading...</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative py-24 sm:py-32 bg-gray-50/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl text-center mb-16">
          <h2
            id="testimonial-heading"
            className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl uppercase"
          >
            {t("testimonialsTitle")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 font-medium max-w-xl mx-auto">
            {t(
              "See what our happy customers are saying about our fresh products and delivery.",
            )}
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex-1">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <blockquote className="text-gray-700 font-medium leading-relaxed italic relative z-10">
                  <span className="text-4xl text-primary/20 absolute -top-4 -left-2 font-serif select-none">
                    &ldquo;
                  </span>
                  {testimonial.quote?.[currentLang] ||
                    testimonial.quote?.en ||
                    ""}
                  <span className="text-4xl text-primary/20 absolute -bottom-8 -right-2 font-serif select-none">
                    &rdquo;
                  </span>
                </blockquote>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase text-sm">
                  {(
                    testimonial.attribution?.[currentLang] ||
                    testimonial.attribution?.en ||
                    "?"
                  ).charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.attribution?.[currentLang] ||
                      testimonial.attribution?.en ||
                      ""}
                  </div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">
                    {t("Verified Customer")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
