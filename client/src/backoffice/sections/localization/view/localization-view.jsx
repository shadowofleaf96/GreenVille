import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import TableNoDataFilter from "../../../components/table/TableNoData";
import TableEmptyRows from "../../../components/table/TableEmptyRows";
import LocalizationTableHead from "../localization-table-head";
import LocalizationTableRow from "../localization-table-row";
import LocalizationTableToolbar from "../localization-table-toolbar";
import LocalizationEditForm from "../localization-edit-form";
import Loader from "../../../../frontoffice/components/loader/Loader";

import {
  fetchLocalizations,
  upsertLocalization,
  deleteLocalization,
} from "../../../../redux/backoffice/localizationSlice";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Simple filter/sort utilities (local to this view as they are simple)
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const query = filterName.toLowerCase();
    inputData = inputData.filter((item) => {
      const searchFields = [
        item.key,
        typeof item.en === "string" ? item.en : JSON.stringify(item.en),
        typeof item.fr === "string" ? item.fr : JSON.stringify(item.fr),
        typeof item.ar === "string" ? item.ar : JSON.stringify(item.ar),
      ];

      return searchFields.some(
        (field) => field && field.toLowerCase().indexOf(query) !== -1,
      );
    });
  }
  return inputData;
}

export default function LocalizationView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { data, loading, error } = useSelector(
    (state) => state.adminLocalization,
  );

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("key");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEdit, setOpenEdit] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchLocalizations());
  }, [dispatch]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataFiltered.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0)
      newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1)
      newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    setSelected(newSelected);
  };

  const handleOpenCreate = () => {
    setCurrentEditItem(null);
    setOpenEdit(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentEditItem(item);
    setOpenEdit(true);
  };

  const handleSave = (formData) => {
    dispatch(upsertLocalization(formData)).then((res) => {
      if (!res.error) setOpenEdit(false);
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteLocalization(deleteId));
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: data || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !loading;

  if (loading && !data.length) return <Loader />;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Localization")}
        </h4>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-200"
        >
          <Iconify icon="material-symbols:add" className="mr-2" />
          {t("New Translation")}
        </Button>
      </div>

      <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <LocalizationTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={(e) => setFilterName(e.target.value)}
          />

          <Scrollbar>
            <Table>
              <LocalizationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "key", label: t("Key") },
                  { id: "en", label: "English" },
                  { id: "fr", label: "Français" },
                  { id: "ar", label: "العربية" },
                  { id: "updatedAt", label: t("Last Update") },
                  { id: "" },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
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
                        <LocalizationTableRow
                          key={row._id}
                          rowKey={row.key}
                          en={row.en}
                          fr={row.fr}
                          ar={row.ar}
                          updatedAt={row.updatedAt}
                          selected={selected.indexOf(row._id) !== -1}
                          handleClick={() => handleClick(row._id)}
                          onEdit={() => handleOpenEdit(row)}
                          onDelete={() => {
                            setDeleteId(row._id);
                            setOpenDelete(true);
                          }}
                        />
                      ))}

                    {!notFound && (
                      <TableEmptyRows
                        height={77}
                        emptyRows={Math.max(
                          0,
                          (1 + page) * rowsPerPage - dataFiltered.length,
                        )}
                      />
                    )}

                    {notFound && (
                      <TableNoDataFilter
                        query={filterName}
                        colSpan={6}
                        resourceName="Translations"
                      />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>

          {/* Standard Pagination */}
          <div className="flex items-center justify-between px-6 py-5 bg-gray-50/50 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-500">
              {t("Total")}:{" "}
              <span className="text-gray-900 font-bold">
                {dataFiltered.length}
              </span>{" "}
              {t("translations")}
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
                    {[10, 25, 50].map((v) => (
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
                  disabled={(page + 1) * rowsPerPage >= dataFiltered.length}
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

      <LocalizationEditForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleSave}
        currentItem={currentEditItem}
      />

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-md rounded-3xl p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {t("Confirm Deletion")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-2 text-base">
              {t("Are you sure you want to delete this translation?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              onClick={handleDelete}
              className="w-full h-12 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600"
            >
              {t("Delete")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              className="w-full h-12 rounded-2xl"
            >
              {t("Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
