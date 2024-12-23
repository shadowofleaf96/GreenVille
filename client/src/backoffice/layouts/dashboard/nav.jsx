import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { logout, fetchUserProfile } from "../../../redux/backoffice/authSlice";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";

import { useDispatch, useSelector } from "react-redux";

import { usePathname } from "../../../routes/hooks";
import Divider from "@mui/material/Divider";
import { RouterLink } from "../../../routes/components";
import { useTranslation } from "react-i18next";

import { useResponsive } from "../../hooks/use-responsive";

import MiniLogo from "../../components/logo/miniLogo";
import Scrollbar from "../../components/scrollbar";

import { NAV } from "../dashboard/config-layout";
import TranslatedNavConfig from "../dashboard/config-navigation";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { admin } = useSelector((state) => state.adminAuth);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!admin) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderAccount = (
    <Stack
      sx={{
        mx: 2.5,
        py: 1,
        px: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Avatar
        src={`${admin?.user_image}`}
        alt="photoURL"
        sx={{ width: 120, height: 120, my: 0.5 }}
      />

      <Typography sx={{ my: 0.5 }}>
        <strong>{t("yourAccount")}</strong>
      </Typography>

      <Typography variant="body2" sx={{ my: 0.5 }}>
        {admin?.first_name + " " + admin?.last_name}
      </Typography>

      <Typography className="capitalize" variant="body2" sx={{ my: 0.5 }}>
        {admin?.role}
      </Typography>
    </Stack>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {TranslatedNavConfig().map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ mt: 1 }} alignSelf="center">
        <MiniLogo />
      </Box>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2, mb: 0.5 }}>
        {item.icon}
      </Box>

      <Box className="rtl:mr-3" component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
