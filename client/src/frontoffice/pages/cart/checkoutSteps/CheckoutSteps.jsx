import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Iconify from "../../../../components/iconify";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      label: t("Shipping"),
      active: shipping,
      link: "/shipping?edit=true",
      icon: "solar:delivery-bold-duotone",
    },
    {
      id: 2,
      label: t("Confirm Order"),
      active: confirmOrder,
      link: "/confirm",
      icon: "solar:clipboard-check-bold-duotone",
    },
    {
      id: 3,
      label: t("Payment"),
      active: payment,
      link: "/payment",
      icon: "solar:card-2-bold-duotone",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-in-out"
            style={{ width: payment ? "100%" : confirmOrder ? "50%" : "0%" }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted =
            (index === 0 && (confirmOrder || payment)) ||
            (index === 1 && payment);
          const isCurrent = step.active && !isCompleted;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group"
            >
              {step.active || isCompleted ? (
                <Link to={step.link} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                      isCompleted
                        ? "bg-primary text-white scale-110 shadow-primary/30"
                        : isCurrent
                          ? "bg-primary text-white scale-110 sm:scale-125 shadow-primary/40 ring-4 ring-primary/10"
                          : "bg-white text-gray-400 border-2 border-gray-100 group-hover:border-primary/30 group-hover:text-primary"
                    }`}
                  >
                    <Iconify
                      icon={isCompleted ? "solar:check-circle-bold" : step.icon}
                      width={20}
                      className="sm:w-7"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        step.active || isCompleted
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      {t("Step")} {step.id}
                    </p>
                    <p
                      className={`text-sm font-black transition-colors ${
                        step.active || isCompleted
                          ? "text-gray-900"
                          : "text-gray-400 group-hover:text-primary"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-300 shadow-sm transition-all grayscale opacity-60">
                    <Iconify icon={step.icon} width={28} />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                      {t("Step")} {step.id}
                    </p>
                    <p className="text-sm font-black text-gray-300">
                      {step.label}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
