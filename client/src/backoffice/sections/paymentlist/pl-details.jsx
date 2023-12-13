import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Label from "../../components/label";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { fDateTime } from "../../../utils/format-time";


const UserDetailsPopup = ({ product, open, onClose }) => {

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: "16px", // Circular edge
          p: 4,
          width: 400,
          textAlign: "center",
        }}
      >
        <Stack direction="column" alignItems="center" spacing={2}>
          <Avatar
            src={`http://localhost:3000/${product?.product_image}`}
            sx={{ width: 100, height: 100 }}
          />

          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#3f51b5" }} // Different color for the title
          >
            Customer Details
          </Typography>

          <Typography variant="body1">
            <strong>SKU:</strong> {product?.sku}
          </Typography>

          <Typography variant="body1">
            <strong>Product Name:</strong> {product?.product_name}
          </Typography>

          <Typography variant="body1">
            <strong>Short Description:</strong> {product?.short_description}
          </Typography>

          <Typography variant="body1">
            <strong>Price:</strong> {product?.price}
          </Typography>

          <Typography variant="body1">
            <strong>Discount Price:</strong> {product?.discount_price}
          </Typography>


          <Typography variant="body1">
            <strong>Options:</strong> {product?.option}
          </Typography>

          <Typography variant="body1">
            <strong>Creation Date:</strong> {fDateTime(product?.creation_date)}
          </Typography>

          <Typography variant="body1">
            <Label color={(product?.active === true && "success") || "error"}>
              {product?.active ? "active" : "inactive"}
            </Label>{" "}
          </Typography>

          <Typography variant="body1">
            <strong>Last Update:</strong> {fDateTime(product?.last_update)}
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserDetailsPopup;
