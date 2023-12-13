import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from"@mui/material/Stack";
import Iconify from "../../components/iconify";
import { useTranslation } from "react-i18next";

function CustomFileInput({ onChange }) {
  const [file, setFile] = useState(null);
  const { t } = useTranslation();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <Stack
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        startIcon={
          <Iconify
            icon="material-symbols-light:upload-rounded"
            height={28}
            width={28}
          />
        }
        onClick={handleButtonClick}
        sx={{ margin: 1, padding: 1 }}
      >
        {t("Choose a File")}
      </Button>
      {file && <p>{t("Selected file:")} {file.name}</p>}
    </Stack>
  );
}

export default CustomFileInput;
