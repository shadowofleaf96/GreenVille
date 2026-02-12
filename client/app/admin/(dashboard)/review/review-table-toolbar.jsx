import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deleteReview } from "@/store/slices/admin/reviewSlice";
import { useTranslation } from "react-i18next";
import createAxiosInstance from "@/utils/axiosConfig";
import { toast } from "react-toastify";
import Iconify from "@/components/shared/iconify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewTableToolbar({
  numSelected,
  selected,
  setSelected,
  filterName,
  onFilterName,
  showFilters,
  setShowFilters,
  statusFilter,
  onStatusFilter,
  ratingFilter,
  onRatingFilter,
}) {
  const { t } = useTranslation();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);

      let response;
      const deletedReviewIds = [];
      const axiosInstance = createAxiosInstance("admin");

      for (const reviewId of selected) {
        response = await axiosInstance.delete(`/reviews/${reviewId}`);
        deletedReviewIds.push(reviewId);
      }

      dispatch(deleteReview(deletedReviewIds));

      setIsDeleteDialogOpen(false);
      setSelected([]);
      const snackbarMessage =
        selected.length === 1
          ? response.data.message
          : `${t("Selected")} ${selected.length} ${t("reviews are deleted")}`;

      toast.success(snackbarMessage);
    } catch (error) {
      console.error("Error deleting reviews:", error);
      toast.error(t("Error deleting reviews"));
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
                placeholder={t("Search for Review...")}
                className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          {numSelected > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="rounded-xl shadow-lg shadow-red-200 hover:scale-105 transition-all"
                  >
                    <Iconify
                      icon="material-symbols-light:delete-sweep-outline-rounded"
                      width={24}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("Delete")}</TooltipContent>
              </Tooltip>
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
                <SelectItem value="approved">{t("Approved")}</SelectItem>
                <SelectItem value="pending">{t("Pending")}</SelectItem>
                <SelectItem value="rejected">{t("Rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              {t("Filter by Rating")}
            </span>
            <Select
              value={ratingFilter}
              onValueChange={(value) => onRatingFilter(value)}
            >
              <SelectTrigger className="h-10 bg-white border-gray-100 rounded-lg text-sm">
                <SelectValue placeholder={t("All")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="5">5 {t("Stars")}</SelectItem>
                <SelectItem value="4">4 {t("Stars")}</SelectItem>
                <SelectItem value="3">3 {t("Stars")}</SelectItem>
                <SelectItem value="2">2 {t("Stars")}</SelectItem>
                <SelectItem value="1">1 {t("Star")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none">
          <DialogHeader>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Iconify
                icon="material-symbols:warning-outline-rounded"
                width={32}
                height={32}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("Confirm Deletion")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-base leading-relaxed">
              {t("Are you sure you want to delete")} {numSelected}{" "}
              {t("selected elements ?")} {t("This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              disabled={loadingDelete}
              onClick={handleDelete}
              className="w-full h-12 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
            >
              {loadingDelete ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Deleting...")}
                </div>
              ) : (
                t("Yes, Delete")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full h-12 bg-gray-50 text-gray-600 font-bold border-none rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              {t("Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

ReviewTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

