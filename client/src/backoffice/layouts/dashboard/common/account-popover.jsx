import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "../../../../routes/hooks";
import { logout } from "../../../../redux/backoffice/authSlice";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import IconButton from "@mui/material/IconButton";

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { admin } = useSelector((state) => state.adminAuth);

  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logOut = async () => {
    try {
      localStorage.removeItem("user_access_token");
      localStorage.removeItem("user_refresh_token");
      dispatch(logout({}));
      router.push("/admin/login");
    } catch (error) {
      toast.error(t("Logout Error") + ": " + error.response.data.message);
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
          src={admin ? `http://127.0.0.1:3000/${admin.user_image}` : ""}
          alt={admin ? admin.user_name : "Admin"}
          sx={{
            width: 48,
            height: 48,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {admin ? admin?.user_name.charAt(0).toUpperCase() : "A"}
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
