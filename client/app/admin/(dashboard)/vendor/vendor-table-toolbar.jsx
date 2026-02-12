import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Iconify from "@/components/shared/iconify";

export default function VendorTableToolbar({
  filterName,
  onFilterName,
  showFilters,
  setShowFilters,
  statusFilter,
  onStatusFilter,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col gap-4 px-6 py-4 transition-all duration-300 bg-white border-b border-gray-100`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative w-full">
            <Iconify
              icon="material-symbols-light:search-rounded"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width={20}
            />
            <Input
              value={filterName}
              onChange={onFilterName}
              placeholder={t("Search for Vendor...")}
              className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded-xl transition-all ${
                    showFilters
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Iconify
                    icon="material-symbols-light:filter-list-rounded"
                    width={24}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("Filters")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              {t("Filter by Status")}
            </span>
            <Select
              value={statusFilter}
              onValueChange={(value) => onStatusFilter(value)}
            >
              <SelectTrigger className="h-10 bg-white border-gray-100 rounded-lg text-sm">
                <SelectValue placeholder={t("All")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="approved">{t("Approved")}</SelectItem>
                <SelectItem value="pending">{t("Pending")}</SelectItem>
                <SelectItem value="rejected">{t("Rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

VendorTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  showFilters: PropTypes.bool,
  setShowFilters: PropTypes.func,
  statusFilter: PropTypes.string,
  onStatusFilter: PropTypes.func,
};

