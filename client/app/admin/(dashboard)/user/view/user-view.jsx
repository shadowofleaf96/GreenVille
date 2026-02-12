"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Iconify from "@/components/shared/iconify";
import Scrollbar from "@/admin/_components/scrollbar";
import UserTableRow from "../user-table-row";
import UserTableHead from "../user-table-head";
import TableEmptyRows from "@/admin/_components/table/TableEmptyRows";
import TableNoDataFilter from "@/admin/_components/table/TableNoData";
import UserTableToolbar from "../user-table-toolbar";
import EditUserForm from "../user-edit";
import NewUserForm from "../new-user-form";
import UserDetailsPopup from "../user-details";

import { emptyRows, applyFilter, getComparator } from "../utils";
import {
  setData,
  setLoading,
  setError,
  setFilterName,
} from "@/store/slices/admin/userSlice";
import Loader from "@/frontoffice/_components/loader/Loader";
import createAxiosInstance from "@/utils/axiosConfig";

export default function UserView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const data = useSelector((state) => state.adminUser.data);
  const error = useSelector((state) => state.adminUser.error);
  const loading = useSelector((state) => state.adminUser.loading);
  const filterName = useSelector((state) => state.adminUser.filterName);
  const { admin } = useSelector((state) => state.adminAuth);

  const [emailFilter, setEmailFilter] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);
  const [isNewUserFormOpen, setNewUserFormOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/users");
      const data = response.data.data;
      dispatch(setData(data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  }

  if (!data && !loading) {
    return <div className="p-4 text-gray-600">No Data found</div>;
  }

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const openDeleteConfirmation = (userId) => {
    setSelectedDeleteUserId(userId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setSelectedDeleteUserId(null);
    setDeleteConfirmationOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    const value = event.target.value;
    dispatch(setFilterName(value));
    setPage(0);
  };

  const handleFilterByEmail = (event) => {
    const value = event.target.value;
    setEmailFilter(value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleSaveEditedUser = async (editedUser, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("first_name", editedUser.first_name);
      formData.append("last_name", editedUser.last_name);
      formData.append("password", editedUser.password);
      formData.append("email", editedUser.email);
      formData.append("user_name", editedUser.user_name);
      formData.append("role", editedUser.role);
      formData.append("status", editedUser.status);

      if (selectedImage) {
        formData.append("user_image", selectedImage);
      }

      const response = await axiosInstance.put(
        `/users/${editedUser._id}`,
        formData,
      );

      const index = data.findIndex((user) => user._id === editedUser._id);

      if (index !== -1) {
        const updatedUsers = [...data];
        const userData = response.data.data;
        updatedUsers[index] = {
          ...updatedUsers[index],
          user_image: userData.user_image,
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          password: editedUser.password,
          email: editedUser.email,
          user_name: editedUser.user_name,
          role: editedUser.role,
          status: editedUser.status,
        };

        dispatch(setData(updatedUsers));
        toast.success(response.data.message);
        setEditingUser(null);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error editing user:" + error);
      toast.error("Error: " + error.response.data.message);
      throw error;
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    setLoadingDelete(true);
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      const updatedUsers = data.filter((user) => user._id !== userId);
      dispatch(setData(updatedUsers));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error: " + error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleOpenDetailsPopup = (user) => {
    setSelectedUser(user);
    setDetailsPopupOpen(true);
  };

  const handleCloseDetailsPopup = () => {
    setDetailsPopupOpen(false);
  };

  const handleOpenNewUserForm = () => {
    setNewUserFormOpen(true);
  };

  const handleCloseNewUserForm = () => {
    setNewUserFormOpen(false);
  };

  const handleSaveNewUser = async (newUser, selectedImage) => {
    setLoadingDelete(true);

    try {
      const formData = new FormData();
      formData.append("first_name", newUser.first_name);
      formData.append("last_name", newUser.last_name);
      formData.append("password", newUser.password);
      formData.append("email", newUser.email);
      formData.append("user_name", newUser.user_name);
      formData.append("role", newUser.role);
      formData.append("status", newUser.status);

      if (selectedImage) {
        formData.append("user_image", selectedImage);
        newUser.user_image = "images/" + selectedImage.name;
      } else {
        newUser.user_image = "images/image_placeholder.webp";
      }

      const response = await axiosInstance.post("/users", formData);
      const userdata = response.data.data;
      const AddedUsers = {
        key: userdata._id,
        _id: userdata._id,
        user_image: userdata.user_image,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        password: newUser.password,
        email: newUser.email,
        user_name: newUser.user_name,
        role: newUser.role,
        status: newUser.status,
        creation_date: userdata.creation_date,
      };

      dispatch(setData([...data, AddedUsers]));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error creating new user:", error);
      toast.error("Error: " + error.response.data.message);
      throw error;
    } finally {
      handleCloseNewUserForm();
      setLoadingDelete(false);
    }
  };

  const handleFilterRole = (value) => {
    setRoleFilter(value);
    setPage(0);
  };

  const handleFilterStatus = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(order, orderBy),
    filterName,
    emailFilter,
  }).filter((item) => {
    if (roleFilter !== "all" && item.role !== roleFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const notFound = !dataFiltered.length && !loading;

  const totalPages = Math.ceil(dataFiltered.length / rowsPerPage);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Users")}
        </h4>
        {admin?.role !== "manager" && (
          <Button
            onClick={handleOpenNewUserForm}
            className="h-12 px-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Iconify
              icon="material-symbols-light:add"
              className="mr-2"
              width={24}
              height={24}
            />
            {t("Add User")}
          </Button>
        )}
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          emailFilter={emailFilter}
          onEmailFilter={handleFilterByEmail}
          selected={selected}
          setSelected={setSelected}
          fetchData={fetchData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          roleFilter={roleFilter}
          onRoleFilter={handleFilterRole}
          statusFilter={statusFilter}
          onStatusFilter={handleFilterStatus}
        />

        <Scrollbar>
          <Table>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: "user_image", label: t("Image") },
                { id: "first_name", label: t("First Name") },
                { id: "last_name", label: t("Last Name") },
                { id: "role", label: t("Role") },
                { id: "user_name", label: t("User Name") },
                { id: "creation_date", label: t("Creation Date") },
                { id: "status", label: t("Status") },
                { id: " " },
              ]}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24">
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        user_image={`${row.user_image}`}
                        first_name={row.first_name}
                        last_name={row.last_name}
                        role={row.role}
                        user_name={row.user_name}
                        creation_date={row.creation_date}
                        status={row.status}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        onEdit={() => handleEditUser(row)}
                        onDelete={(event) =>
                          openDeleteConfirmation(row._id, event)
                        }
                        onDetails={() => handleOpenDetailsPopup(row)}
                      />
                    ))}
                  {!notFound && (
                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, data.length)}
                    />
                  )}
                  {notFound && (
                    <TableNoDataFilter
                      query={filterName}
                      colSpan={9}
                      resourceName="Users"
                    />
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>

        {/* Custom Pagination */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
          <div className="text-sm font-semibold text-gray-500">
            {t("Total")}:{" "}
            <span className="text-gray-900 font-bold">
              {dataFiltered.length}
            </span>{" "}
            {t("users")}
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
                <SelectTrigger className="w-17.5 bg-transparent border-none text-sm font-bold shadow-none focus:ring-0">
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
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-primary min-w-9 text-center">
                {page + 1}
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
                className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all h-9 w-9"
              >
                <Iconify icon="material-symbols:chevron-right" width={20} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <NewUserForm
        open={isNewUserFormOpen}
        onSave={handleSaveNewUser}
        onCancel={handleCloseNewUserForm}
        onClose={handleCloseNewUserForm}
      />

      <UserDetailsPopup
        user={selectedUser}
        open={isDetailsPopupOpen}
        onClose={handleCloseDetailsPopup}
      />

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSave={handleSaveEditedUser}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Delete Confirmation Popover */}
      <Popover
        open={isDeleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <PopoverTrigger />
        <PopoverContent className="w-64 p-4">
          <p className="text-sm font-medium mb-4">
            {t("Are you sure you want to delete this element ?")}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleDeleteUser(selectedDeleteUserId);
                closeDeleteConfirmation();
              }}
              disabled={loadingDelete}
              className="flex-1"
            >
              {loadingDelete ? (
                <Iconify
                  icon="svg-spinners:180-ring-with-bg"
                  className="mr-2"
                  width={16}
                  height={16}
                />
              ) : null}
              {t("Confirm")}
            </Button>
            <Button
              variant="outline"
              onClick={closeDeleteConfirmation}
              className="flex-1"
            >
              {t("Cancel")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
