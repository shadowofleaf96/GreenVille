import { useState } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useRouter } from "../../../../routes/hooks";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/backoffice/authSlice";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import IconButton from "@mui/material/IconButton";

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { t } = useTranslation();
  const user = useSelector((state) => state.adminAuth.adminUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logOut = async () => {
    try {
      const response = await axios.post("/v1/users/logout");

      if (response.data.message === "Logout successful") {
        dispatch(logout({}));
        router.push("/admin/login");
      } else {
        alert("Login failed\n" + response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Login error\n" + error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 52,
          height: 52,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={`http://127.0.0.1:3000/${user.user_image}`}
          alt={user.user_name}
          sx={{
            width: 48,
            height: 48,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user.user_name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <MenuItem
          key={"profile"}
          component={RouterLink}
          to="/admin/profile"
          onClick={handleClose}
          sx={{ py: 1.5, color: "text.secondary" }}
        >
          <Iconify
            icon="material-symbols-light:contacts-product-outline"
            width={28}
            height={28}
            style={{ marginRight: "8px" }}
          />
          {t("profile")}
        </MenuItem>

        <Divider sx={{ my: 1 }}></Divider>

        <MenuItem
          disableRipple
          component="nav"
          disableTouchRipple
          onClick={logOut}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          <Iconify
            icon="material-symbols-light:exit-to-app-rounded"
            width={28}
            height={28}
            sx={{ color: "error.main", mx: 1 }}
          />
          <strong>{t('logout')}</strong>
        </MenuItem>
      </Popover>
    </>
  );
}
