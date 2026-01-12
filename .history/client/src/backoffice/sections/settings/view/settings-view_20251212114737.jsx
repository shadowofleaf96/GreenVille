import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Card,
  Stack,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Iconify from "../../../components/iconify/iconify";
import {
  fetchSettings,
  updateSettings,
} from "../../../../redux/backoffice/settingsSlice";
import createAxiosInstance from "../../../../utils/axiosConfig";

export default function SettingsView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: settingsData, loading } = useSelector(
    (state) => state.adminSettings
  );
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      website_title: { en: "", fr: "", ar: "" },
      home_categories: [],
    },
  });

  useEffect(() => {
    dispatch(fetchSettings());
    const fetchCategories = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (settingsData) {
      setValue("website_title.en", settingsData.website_title?.en || "");
      setValue("website_title.fr", settingsData.website_title?.fr || "");
      setValue("website_title.ar", settingsData.website_title?.ar || "");

      const categoryIds =
        settingsData.home_categories?.map((cat) =>
          typeof cat === "object" ? cat._id : cat
        ) || [];
      setValue("home_categories", categoryIds);

      if (settingsData.logo_url) {
        setLogoPreview(settingsData.logo_url);
      }
    }
  }, [settingsData, setValue]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      e.target.value = null;
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("website_title", JSON.stringify(data.website_title));
    formData.append("home_categories", JSON.stringify(data.home_categories));

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    dispatch(updateSettings(formData));
  };

  return (
    <Container maxWidth="lg">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">{t("Site Settings")}</Typography>
      </Stack>

      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Logo Section */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("Logo")}
              </Typography>
              <Stack alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    border: "1px dashed grey",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {logoPreview ? (
                    <>
                      <img
                        src={
                          logoPreview.startsWith("blob")
                            ? logoPreview
                            : `${logoPreview}`
                        }
                        alt="Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                      <Iconify
                        icon="material-symbols-light:close"
                        width={24}
                        height={24}
                        onClick={handleRemoveLogo}
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          cursor: "pointer",
                          color: "red",
                          background: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </>
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      {t("No Logo Uploaded")}
                    </Typography>
                  )}
                </Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoChange}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={
                      <Iconify icon="material-symbols-light:upload-rounded" />
                    }
                  >
                    {t("Upload Logo")}
                  </Button>
                </label>
              </Stack>
            </Grid>

            {/* Form Fields Section */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Typography variant="h6">{t("General Information")}</Typography>

                <TextField
                  fullWidth
                  label={t("Website Title (EN)")}
                  {...register("website_title.en")}
                />
                <TextField
                  fullWidth
                  label={t("Website Title (FR)")}
                  {...register("website_title.fr")}
                />
                <TextField
                  fullWidth
                  label={t("Website Title (AR)")}
                  {...register("website_title.ar")}
                />

                <Typography variant="h6" sx={{ mt: 2 }}>
                  {t("Home Page Configuration")}
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>{t("Dynamic Categories")}</InputLabel>
                  <Controller
                    name="home_categories"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        multiple
                        input={
                          <OutlinedInput label={t("Dynamic Categories")} />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => {
                              const category = categories.find(
                                (c) => c._id === value
                              );
                              return (
                                <Chip
                                  key={value}
                                  label={category?.category_name?.en || value}
                                />
                              );
                            })}
                          </Box>
                        )}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.category_name?.en}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                    size="large"
                  >
                    {t("Save Changes")}
                  </LoadingButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
}
