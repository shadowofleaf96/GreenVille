import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import EditCustomerForm from '../customer-edit'; 

import { users } from '../../../_mock/customer';

import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';


import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';



// ----------------------------------------------------------------------

export default function customerPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editingCustomer, setEditingCustomer] = useState(null); //edit

  const [usersTable, setUsersTable] = useState(users); //users usestate

  const [openModal, setOpenModal] = useState(false); //modal
  


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };



  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = usersTable.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  //------------------
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

    const handleSaveEditedCustomer = (editedCustomer) => {
      // Implement the logic to save the edited customer
      // You can make an API call to update the customer's data
      // Once the data is updated, you can close the edit form
      console.log('Saving edited customer:', editedCustomer);
      const index=usersTable.findIndex((user)=>user.id===editedCustomer.id)
      
      if (index !== -1) {
        // Create a copy of the users array to avoid modifying the state directly
        const updatedUsers = [...usersTable];
  
        // Update the name of the user at the found index
        updatedUsers[index].name = editedCustomer.name;
        
        // Update the status of the user at the found index
        updatedUsers[index].status = editedCustomer.status;
        
  
        // Update the state with the modified data
        setUsersTable(updatedUsers);
  
        // Close the edit form
        setEditingCustomer(null);
        setOpenModal(false); 
      }
    
    };

  const handleCancelEdit = () => {
    setEditingCustomer(null); // Close the edit form
  };

  //---------
  const handleDeleteUser = (userId) => {
    // Assuming you have a function to delete a user from your data
    const updatedUsers = usersTable.filter(user => user.id !== userId); //for deleting a customer
    // Assuming setUsers is a function to update the users state
    setUsersTable(updatedUsers);
  };

  //-------

  const dataFiltered = applyFilter({
    inputData: usersTable,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Customers</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Customer
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={usersTable.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'email' },
                  { id: 'last_login', label: 'last_login' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      role={row.role}
                      status={row.status}
                      company={row.company}
                      avatarUrl={row.avatarUrl}
                      isVerified={row.isVerified}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      onEdit={() => handleEditCustomer(row)}
                      onDelete={() => handleDeleteUser(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, usersTable.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={usersTable.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {editingCustomer && (
        <EditCustomerForm
          customer={editingCustomer}
          onSave={handleSaveEditedCustomer}
          onCancel={handleCancelEdit}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}


    </Container>
  );
}
