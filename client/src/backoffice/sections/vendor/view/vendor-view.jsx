import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import createAxiosInstance from "../../../../utils/axiosConfig";

import Loader from "../../../../frontoffice/components/loader/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VendorTableToolbar from "../vendor-table-toolbar";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function VendorView() {
  const { t } = useTranslation();

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [userSearchOpen, setUserSearchOpen] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (value) => {
    setPage(0);
    setStatusFilter(value);
  };

  const dataFiltered = vendors.filter((item) => {
    if (filterName) {
      const query = filterName.toLowerCase();
      const matchName = item.store_name?.toLowerCase().indexOf(query) !== -1;
      const matchUser =
        item.user?.user_name?.toLowerCase().indexOf(query) !== -1 ||
        item.user?.email?.toLowerCase().indexOf(query) !== -1;
      if (!matchName && !matchUser) return false;
    }
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const axiosInstance = createAxiosInstance("admin");

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    reset: resetCreate,
    setValue: setValueCreate, // eslint-disable-line no-unused-vars
    watch: watchCreate,
    formState: { errors: errorsCreate },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
    setValue: setValueEdit, // eslint-disable-line no-unused-vars
    formState: { errors: errorsEdit },
  } = useForm();

  const selectedUser = watchCreate("user"); // eslint-disable-line no-unused-vars

  // Fetch Vendors
  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/vendors");
      setVendors(response.data.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(t("Error fetching vendors"));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Users for Create Vendor
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const allUsers = response.data.data;
      const availableUsers = allUsers.filter((u) => u.role !== "vendor");
      setUsers(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(vendors.length / rowsPerPage); // eslint-disable-line no-unused-vars

  // --- Actions ---

  const handleConfirmAction = async () => {
    if (!selectedVendor || !confirmAction) return;

    setActionLoading(true);
    try {
      if (confirmAction === "delete") {
        await axiosInstance.delete(`/vendors/${selectedVendor._id}`);
        toast.success(t("Vendor deleted successfully"));
      } else {
        await axiosInstance.patch(`/vendors/status/${selectedVendor._id}`, {
          status: confirmAction,
        });
        toast.success(t(`Vendor ${confirmAction} successfully`));
      }
      fetchVendors();
      fetchUsers();
    } catch (error) {
      console.error(`Error during ${confirmAction}:`, error);
      toast.error(t(`Error during action`));
    } finally {
      setActionLoading(false);
      setOpenConfirm(false);
      setConfirmAction(null);
      setSelectedVendor(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const openConfirmation = (action, vendor) => {
    setSelectedVendor(vendor);
    setConfirmAction(action);
    setOpenConfirm(true);
  };

  // --- Create ---

  const onOpenCreate = () => {
    resetCreate();
    setSelectedLogo(null);
    setLogoPreview(null);
    setOpenCreate(true);
  };

  const onCreateVendor = async (data) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", data.user._id);
      formData.append("store_name", data.store_name);
      formData.append("store_description", data.store_description || "");
      formData.append("phone_number", formatPhone(data.phone_number));
      formData.append("vendor_type", data.vendor_type);
      formData.append("rc_number", data.rc_number);
      formData.append("ice_number", data.ice_number);
      if (selectedLogo) {
        formData.append("store_logo", selectedLogo);
      }

      await axiosInstance.post("/vendors/register", formData);
      toast.success(t("Vendor created successfully"));
      fetchVendors();
      fetchUsers();
      setOpenCreate(false);
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error(error.response?.data?.message || t("Error creating vendor"));
    } finally {
      setActionLoading(false);
    }
  };

  // --- Edit ---
  const onOpenEdit = (vendor) => {
    setSelectedVendor(vendor);
    resetEdit({
      store_name: vendor.store_name,
      store_description: vendor.store_description,
      phone_number: vendor.phone_number,
      vendor_type: vendor.vendor_type,
      rc_number: vendor.rc_number,
      ice_number: vendor.ice_number,
    });
    setSelectedLogo(null);
    setLogoPreview(null);
    setOpenEdit(true);
  };

  const onEditVendor = async (data) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("store_name", data.store_name);
      formData.append("store_description", data.store_description || "");
      formData.append("phone_number", formatPhone(data.phone_number));
      formData.append("vendor_type", data.vendor_type);
      formData.append("rc_number", data.rc_number);
      formData.append("ice_number", data.ice_number);
      if (selectedLogo) {
        formData.append("store_logo", selectedLogo);
      }

      await axiosInstance.put(
        `/vendors/profile/${selectedVendor.user?._id}`,
        formData,
      );

      toast.success(t("Vendor updated successfully"));
      fetchVendors();
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error(error.response?.data?.message || t("Error updating vendor"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading && vendors.length === 0) return <Loader />;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Vendors")}
        </h4>
        <Button
          onClick={onOpenCreate}
          className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Iconify icon="eva:plus-fill" className="mr-2" width={24} />
          {t("New Vendor")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <VendorTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusFilter={statusFilter}
          onStatusFilter={handleFilterStatus}
        />
        <CardContent className="p-0">
          <Scrollbar>
            <Table>
              <TableHeader className="bg-gray-50/50 border-y border-gray-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("Store Name")}
                  </TableHead>
                  <TableHead className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("User")}
                  </TableHead>
                  <TableHead className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("Phone")}
                  </TableHead>
                  <TableHead className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("Type")}
                  </TableHead>
                  <TableHead className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("Status")}
                  </TableHead>
                  <TableHead className="py-4 font-bold text-gray-600 uppercase tracking-wider text-xs">
                    {t("Joined At")}
                  </TableHead>
                  <TableHead className="pr-6 py-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-24">
                      <div className="flex justify-center items-center h-full">
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          width={40}
                          className="text-primary"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((row) => (
                        <TableRow
                          key={row._id}
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 rounded-xl border border-gray-100 shadow-sm">
                                <AvatarImage
                                  src={row.store_logo}
                                  alt={row.store_name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                                  {row.store_name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-gray-900 line-clamp-1">
                                {row.store_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm font-medium text-gray-600">
                              {row.user?.user_name ||
                                row.user?.email ||
                                t("N/A")}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {row.phone_number || t("N/A")}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-xs font-medium text-gray-600 uppercase">
                            {t(row.vendor_type) || t("N/A")}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={getStatusVariant(row.status)}
                              className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider"
                            >
                              {t(row.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {new Date(row.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="pr-6 py-4 text-right">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-lg text-gray-400 hover:text-primary transition-all"
                                >
                                  <Iconify
                                    icon="eva:more-vertical-fill"
                                    width={20}
                                  />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-2 rounded-2xl shadow-xl border-none">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-gray-600 hover:text-primary hover:bg-primary/5 px-3 py-2"
                                    onClick={() => onOpenEdit(row)}
                                  >
                                    <Iconify icon="eva:edit-fill" width={18} />
                                    {t("Edit")}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-success hover:bg-success/5 px-3 py-2"
                                    onClick={() =>
                                      openConfirmation("approved", row)
                                    }
                                  >
                                    <Iconify
                                      icon="eva:checkmark-circle-2-fill"
                                      width={18}
                                    />
                                    {t("Approve")}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 px-3 py-2"
                                    onClick={() =>
                                      openConfirmation("rejected", row)
                                    }
                                  >
                                    <Iconify
                                      icon="eva:close-circle-fill"
                                      width={18}
                                    />
                                    {t("Reject")}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 px-3 py-2"
                                    onClick={() =>
                                      openConfirmation("delete", row)
                                    }
                                  >
                                    <Iconify
                                      icon="eva:trash-2-outline"
                                      width={18}
                                    />
                                    {t("Delete")}
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}

                    {vendors.length === 0 && (
                      <TableNoDataFilter colSpan={5} resourceName="Vendors" />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>

          <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-500">
              {t("Total")}:{" "}
              <span className="text-gray-900 font-bold">{vendors.length}</span>{" "}
              {t("vendors")}
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                  {t("Rows per page")}:
                </span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(v) => handleRowsPerPageChange(parseInt(v))}
                >
                  <SelectTrigger className="w-[70px] bg-transparent border-none text-sm font-bold shadow-none focus:ring-0 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25].map((v) => (
                      <SelectItem key={v} value={v.toString()}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
                >
                  <Iconify icon="material-symbols:chevron-left" width={20} />
                </Button>
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-primary min-w-[36px] text-center">
                  {page + 1}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={(page + 1) * rowsPerPage >= vendors.length}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
                >
                  <Iconify icon="material-symbols:chevron-right" width={20} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl border-none">
          <DialogHeader>
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                confirmAction === "delete" || confirmAction === "rejected"
                  ? "bg-red-50 text-red-500"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Iconify
                icon={
                  confirmAction === "delete"
                    ? "material-symbols:warning-outline-rounded"
                    : "material-symbols:help-outline-rounded"
                }
                width={32}
                height={32}
              />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 uppercase">
              {t("Confirm Action")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-base leading-relaxed">
              {t("Are you sure you want to")}{" "}
              <strong>{t(confirmAction)}</strong> {t("this vendor?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              disabled={actionLoading}
              onClick={handleConfirmAction}
              className={cn(
                "w-full h-12 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95",
                confirmAction === "delete" || confirmAction === "rejected"
                  ? "bg-red-500 shadow-red-200 hover:bg-red-600"
                  : "bg-primary shadow-primary/20 hover:bg-primary/90",
              )}
            >
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Processing...")}
                </div>
              ) : (
                t("Confirm")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenConfirm(false)}
              className="w-full h-12 bg-gray-50 text-gray-600 font-bold border-none rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              {t("Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Vendor Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
            <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
              {t("New Vendor")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate(onCreateVendor)}>
            <ScrollArea className="max-h-[70vh] p-8 pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Select User")}
                  </Label>
                  <Controller
                    name="user"
                    control={controlCreate}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Popover
                        open={userSearchOpen}
                        onOpenChange={setUserSearchOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full h-12 justify-between rounded-xl bg-gray-50/50 border-gray-100 font-medium",
                              !field.value && "text-gray-400 font-normal",
                            )}
                          >
                            {field.value
                              ? `${field.value.user_name} (${field.value.email})`
                              : t("Select User")}
                            <Iconify
                              icon="lucide:chevrons-up-down"
                              className="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[536px] p-0 rounded-2xl shadow-2xl border-none overflow-hidden">
                          <Command>
                            <CommandInput placeholder={t("Search users...")} />
                            <CommandList>
                              <CommandEmpty>{t("No user found.")}</CommandEmpty>
                              <CommandGroup>
                                {users.map((user) => (
                                  <CommandItem
                                    key={user._id}
                                    onSelect={() => {
                                      field.onChange(user);
                                      setUserSearchOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-3 cursor-pointer"
                                  >
                                    <Avatar className="w-8 h-8 rounded-lg">
                                      <AvatarImage src={user.user_image} />
                                      <AvatarFallback>
                                        {user.user_name?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-sm text-gray-900">
                                        {user.user_name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {user.email}
                                      </span>
                                    </div>
                                    <Iconify
                                      icon="lucide:check"
                                      className={cn(
                                        "ml-auto h-4 w-4 text-primary",
                                        field.value?._id === user._id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errorsCreate.user && (
                    <p className="text-xs font-bold text-red-500 ml-1">
                      {t("User is required")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Name")}
                  </Label>
                  <Input
                    {...registerCreate("store_name", { required: true })}
                    placeholder={t("Enter store name")}
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all"
                  />
                  {errorsCreate.store_name && (
                    <p className="text-xs font-bold text-red-500 ml-1">
                      {t("Store name is required")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Description")}
                  </Label>
                  <textarea
                    {...registerCreate("store_description")}
                    placeholder={t("Enter store description")}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-gray-50/50 border border-gray-100 focus:ring-primary/20 transition-all text-sm outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("Phone Number")}
                    </Label>
                    <Input
                      {...registerCreate("phone_number", {
                        required: true,
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        },
                      })}
                      placeholder={t("Enter phone number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("Legal Status")}
                    </Label>
                    <Controller
                      name="vendor_type"
                      control={controlCreate}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100">
                            <SelectValue placeholder={t("Select status")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entrepreneur">
                              {t("Entrepreneur")}
                            </SelectItem>
                            <SelectItem value="societe">
                              {t("Société")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("RC Number")}
                    </Label>
                    <Input
                      {...registerCreate("rc_number", { required: true })}
                      placeholder={t("Enter RC number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("ICE Number")}
                    </Label>
                    <Input
                      {...registerCreate("ice_number", { required: true })}
                      placeholder={t("Enter ICE number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Logo")}
                  </Label>
                  <div className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 group hover:border-primary/50 transition-all">
                    <div className="relative group/avatar">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Iconify
                            icon="solar:shop-bold-duotone"
                            className="w-10 h-10 text-gray-300"
                          />
                        )}
                      </div>
                      <label
                        htmlFor="create-vendor-logo"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
                      >
                        <Iconify icon="solar:camera-add-bold" width={18} />
                        <input
                          id="create-vendor-logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-gray-900">
                        {selectedLogo ? selectedLogo.name : t("Upload Logo")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("Best format: 500x500px (WebP, PNG, JPG)")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenCreate(false)}
                className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {actionLoading ? (
                  <div className="flex items-center gap-2">
                    <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                    {t("Processing...")}
                  </div>
                ) : (
                  t("Create")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
            <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
              {t("Edit Vendor")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditVendor)}>
            <ScrollArea className="max-h-[70vh] p-8 pt-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Name")}
                  </Label>
                  <Input
                    {...registerEdit("store_name", { required: true })}
                    placeholder={t("Enter store name")}
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                  />
                  {errorsEdit.store_name && (
                    <p className="text-xs font-bold text-red-500 ml-1">
                      {t("Store name is required")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Description")}
                  </Label>
                  <textarea
                    {...registerEdit("store_description")}
                    placeholder={t("Enter store description")}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-gray-50/50 border border-gray-100 focus:ring-primary/20 transition-all text-sm outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("Phone Number")}
                    </Label>
                    <Input
                      {...registerEdit("phone_number", {
                        required: true,
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "");
                        },
                      })}
                      placeholder={t("Enter phone number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("Legal Status")}
                    </Label>
                    <Controller
                      name="vendor_type"
                      control={controlEdit}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100">
                            <SelectValue placeholder={t("Select status")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entrepreneur">
                              {t("Entrepreneur")}
                            </SelectItem>
                            <SelectItem value="societe">
                              {t("Société")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("RC Number")}
                    </Label>
                    <Input
                      {...registerEdit("rc_number", { required: true })}
                      placeholder={t("Enter RC number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("ICE Number")}
                    </Label>
                    <Input
                      {...registerEdit("ice_number", { required: true })}
                      placeholder={t("Enter ICE number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Store Logo")}
                  </Label>
                  <div className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 group hover:border-primary/50 transition-all">
                    <div className="relative group/avatar">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : selectedVendor?.store_logo ? (
                          <img
                            src={selectedVendor.store_logo}
                            alt="Current Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Iconify
                            icon="solar:shop-bold-duotone"
                            className="w-10 h-10 text-gray-300"
                          />
                        )}
                      </div>
                      <label
                        htmlFor="edit-vendor-logo"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
                      >
                        <Iconify icon="solar:camera-add-bold" width={18} />
                        <input
                          id="edit-vendor-logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-gray-900">
                        {selectedLogo ? selectedLogo.name : t("Update Logo")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedLogo
                          ? t("Best format: 500x500px (WebP, PNG, JPG)")
                          : t("Keep current or select new")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenEdit(false)}
                className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {actionLoading ? (
                  <div className="flex items-center gap-2">
                    <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                    {t("Saving...")}
                  </div>
                ) : (
                  t("Save Changes")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
