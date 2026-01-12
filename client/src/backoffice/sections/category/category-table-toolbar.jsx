import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Iconify from "../../../components/iconify";
import { deleteCategory } from "../../../redux/backoffice/categorySlice";
import createAxiosInstance from "../../../utils/axiosConfig";

export default function CategoryTableToolbar({
  numSelected,
  selected,
  setSelected,
  filterName,
  onFilterName,
  showFilters,
  setShowFilters,
  statusFilter,
  onStatusFilter,
}) {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);

      let response;
      const deletedCategoriesIds = [];
      for (const categoryId of selected) {
        const axiosInstance = createAxiosInstance("admin");
        response = await axiosInstance.delete(`/categories/${categoryId}`);
        deletedCategoriesIds.push(categoryId);
      }

      dispatch(deleteCategory(deletedCategoriesIds));

      setPopoverOpen(false);
      setSelected([]);
      const snackbarMessage =
        selected.length === 1
          ? response.data.message
          : t(`Selected ${selected.length} categories are deleted`);

      toast.success(snackbarMessage);
    } catch (error) {
      setPopoverOpen(false);
      toast.error(t("Error deleting categories:") + " " + error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 px-6 py-4 transition-all duration-300 ${
        numSelected > 0 ? "bg-primary/5" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {numSelected > 0 ? (
          <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-primary">
              {numSelected} {t("selected")}
            </p>
          </div>
        ) : (
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
                placeholder={t("Search for Category...")}
                className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          {numSelected > 0 ? (
            <TooltipProvider>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Iconify
                          icon="material-symbols-light:delete-sweep-outline-rounded"
                          width={24}
                          height={24}
                        />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("Delete")}</p>
                  </TooltipContent>
                </Tooltip>

                <PopoverContent className="w-64 p-4">
                  <p className="text-sm font-medium mb-4">
                    {t("Are you sure you want to delete")} {numSelected}{" "}
                    {t("selected elements?")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDelete}
                      disabled={loadingDelete}
                      className="flex-1"
                    >
                      {loadingDelete && (
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          className="mr-2"
                          width={16}
                          height={16}
                        />
                      )}
                      {t("Yes")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPopoverOpen(false)}
                      className="flex-1"
                    >
                      {t("No")}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipProvider>
          ) : (
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
          )}
        </div>
      </div>

      {showFilters && !numSelected && (
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
                <SelectItem value="active">{t("Active")}</SelectItem>
                <SelectItem value="disabled">{t("Disabled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

CategoryTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
};
