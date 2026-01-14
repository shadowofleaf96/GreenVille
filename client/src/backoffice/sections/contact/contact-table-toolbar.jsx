import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { deleteContact } from "../../../redux/backoffice/contactSlice";
import createAxiosInstance from "../../../utils/axiosConfig";
import Iconify from "../../../components/iconify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ContactTableToolbar({
  numSelected,
  selected,
  setSelected,
  filterName,
  onFilterName,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      const axiosInstance = createAxiosInstance("admin");
      const deletedContactIds = [];

      for (const contactId of selected) {
        await axiosInstance.delete(`/contact/${contactId}`);
        deletedContactIds.push(contactId);
      }

      dispatch(deleteContact(deletedContactIds));
      setSelected([]);
      setIsDeleteDialogOpen(false);

      const snackbarMessage =
        selected.length === 1
          ? t("Contact item deleted successfully")
          : t("Selected Contact items are deleted", { count: selected.length });

      toast.success(snackbarMessage);
    } catch (error) {
      console.error("Error deleting Contact items:", error);
      toast.error(t("Error deleting Contact items"));
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex items-center justify-between h-24 px-4 bg-white">
      <div className="flex items-center gap-4 flex-1">
        {numSelected > 0 ? (
          <h6 className="text-sm font-bold text-primary px-2">
            {numSelected} {t("selected")}
          </h6>
        ) : (
          <div className="relative w-full max-w-sm">
            <Iconify
              icon="material-symbols-light:search-rounded"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width={24}
            />
            <Input
              value={filterName}
              onChange={onFilterName}
              placeholder={t("Search for Contact...")}
              className="pl-12 h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {numSelected > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-12 h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Iconify
                    icon="material-symbols-light:delete-sweep-outline-rounded"
                    width={28}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("Delete")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
              <Iconify
                icon="material-symbols:warning-outline-rounded"
                width={32}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("Delete Confirmation")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-base leading-relaxed">
              {t("Are you sure you want to delete")} {numSelected}{" "}
              {t("selected elements ? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              variant="destructive"
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

ContactTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
