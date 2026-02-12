import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "@/store/slices/admin/userSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import createAxiosInstance from "@/utils/axiosConfig";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Iconify from "@/components/shared/iconify";

export default function UserTableToolbar({
  numSelected,
  selected,
  setSelected,
  filterName,
  onFilterName,
  emailFilter,
  onEmailFilter,
  showFilters,
  setShowFilters,
  roleFilter,
  onRoleFilter,
  statusFilter,
  onStatusFilter,
}) {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const user = useSelector((state) => state.adminAuth.adminUser);
  const axiosInstance = createAxiosInstance("admin");
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);

      let response;
      const deletedUserIds = [];
      for (const userId of selected) {
        response = await axiosInstance.delete(`/users/${userId}`);
        deletedUserIds.push(userId);
      }

      dispatch(deleteUser(deletedUserIds));

      setPopoverOpen(false);
      setSelected([]);
      const snackbarMessage =
        selected.length === 1
          ? response.data.message
          : t(`Selected ${selected.length} users are deleted`);

      toast.success(snackbarMessage);
    } catch (error) {
      setPopoverOpen(false);
      toast.error(t("Error deleting users:") + " " + error);
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
                placeholder={t("Search for User...")}
                className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 ml-4">
          {numSelected > 0 && user.role !== "manager" ? (
            <TooltipProvider>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-xl shadow-lg shadow-red-200 hover:scale-105 transition-all"
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
                    {t("selected elements ?")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDelete}
                      disabled={loadingDelete}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      {loadingDelete ? (
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          className="mr-2"
                          width={16}
                          height={16}
                        />
                      ) : null}
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
              {t("Filter by Email")}
            </span>
            <div className="relative">
              <Iconify
                icon="material-symbols-light:mail-outline"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width={18}
              />
              <Input
                value={emailFilter}
                onChange={onEmailFilter}
                placeholder={t("Email...")}
                className="pl-9 h-10 bg-white border-gray-100 rounded-lg text-sm focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              {t("Filter by Role")}
            </span>
            <Select
              value={roleFilter}
              onValueChange={(value) => onRoleFilter(value)}
            >
              <SelectTrigger className="h-10 bg-white border-gray-100 rounded-lg text-sm">
                <SelectValue placeholder={t("All")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="admin">{t("Admin")}</SelectItem>
                <SelectItem value="manager">{t("Manager")}</SelectItem>
                <SelectItem value="client">{t("Client")}</SelectItem>
                <SelectItem value="vendor">{t("Vendor")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="banned">{t("Banned")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  emailFilter: PropTypes.string,
  onEmailFilter: PropTypes.func,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
  showFilters: PropTypes.bool,
  setShowFilters: PropTypes.func,
};

