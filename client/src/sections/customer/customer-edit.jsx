// EditCustomerForm.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

function EditCustomerForm({ customer, onSave, onCancel, open, onClose }) {
  const [editedCustomer, setEditedCustomer] = useState({ ...customer });
  console.log('editedCustomer',editedCustomer);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };
  

  const handleSave = () => {
    onSave(editedCustomer);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute',
       top: '50%', left: '50%',
       transform: 'translate(-50%, -50%)',
       bgcolor: 'background.paper', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
       p: 4, width: 400 }}>
        <TextField label="Name" name="name" value={editedCustomer.name} onChange={handleFieldChange} fullWidth sx={{ marginBottom: 2 }}/>
        
        <TextField label="Email" name="email" value={editedCustomer.email} onChange={handleFieldChange} fullWidth sx={{ marginBottom: 2 }}/>
        
        <TextField label="Status" name="status" value={editedCustomer.status} onChange={handleFieldChange} fullWidth sx={{ marginBottom: 2 }}/>
        {/* Add more fields for other customer properties */}
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
        <Button onClick={onCancel} variant="outlined" sx={{ mt: 2, ml: 1 }}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default EditCustomerForm;
