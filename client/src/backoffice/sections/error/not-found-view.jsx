import { useTranslation } from "react-i18next";
import LazyImage from "../../../components/lazyimage/LazyImage";
import { RouterLink } from "../../../routes/components";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/50">
      <div className="max-w-[520px] w-full text-center space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] scale-150 group-hover:bg-primary/20 transition-all duration-700" />
          <LazyImage
            src="../../../../assets/illustrations/illustration_404.png"
            className="w-full max-w-sm mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 relative z-10"
          />
        </div>

        <div className="space-y-4 relative z-10">
          <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("Sorry, page not found!")}
          </h3>
          <p className="text-gray-500 text-lg font-medium max-w-sm mx-auto leading-relaxed">
            {t(
              "Wait, it seems you've wandered into uncharted territory. Let's get you back home.",
            )}
          </p>
        </div>

        <div className="relative z-10 pt-4">
          <Button
            asChild
            size="lg"
            className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
          >
            <RouterLink to="/">{t("Go to Home")}</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
