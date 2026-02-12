import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";
import { Input } from "@/components/ui/input";

export default function LocalizationTableToolbar({
  numSelected,
  filterName,
  onFilterName,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center justify-between p-5 transition-colors ${
        numSelected > 0 ? "bg-primary/5" : "bg-white"
      }`}
    >
      {numSelected > 0 ? (
        <div className="text-primary font-bold text-sm">
          {numSelected} {t("selected")}
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          <Iconify
            icon="material-symbols:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width={20}
          />
          <Input
            value={filterName}
            onChange={onFilterName}
            placeholder={t("Search translations...")}
            className="pl-10 h-10 rounded-xl border-gray-200 focus-visible:ring-primary/20 bg-gray-50/50"
          />
        </div>
      )}
    </div>
  );
}

LocalizationTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

