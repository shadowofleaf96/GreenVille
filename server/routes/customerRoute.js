const express = require("express");
const route = express.Router();

const {login, createCustomer, getCustomerById ,getCustomerProfile, getAllCustomers, validateCustomer,updateCustomer,deleteCustomer,logout} = require("../controllers/customerController");

route.post('/customers/login', login);
route.post('/customers/', createCustomer);
route.get('/customers/profile', getCustomerProfile);
route.get('/customers/', getAllCustomers);
route.get('/customers/:id', getCustomerById);
route.put('/customers/validate/:id', validateCustomer);
route.put('/customers/:id', updateCustomer);
route.delete('/customers/:id/delete', deleteCustomer);
route.post('/customers/logout', logout);

module.exports = route;
