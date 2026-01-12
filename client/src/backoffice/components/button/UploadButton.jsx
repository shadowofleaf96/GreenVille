import React, { useState, useRef } from "react";
import Iconify from "../../../components/iconify";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

function UploadButton({ onChange }) {
  const [file, setFile] = useState(null);
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="text-primary hover:text-primary-foreground flex items-center gap-2 h-12 px-6 rounded-2xl"
      >
        <Iconify
          icon="material-symbols-light:upload-rounded"
          height={24}
          width={24}
        />
        {t("Choose a File")}
      </Button>
      {file && (
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {t("Selected file:")} {file.name}
        </p>
      )}
    </div>
  );
}

export default UploadButton;
