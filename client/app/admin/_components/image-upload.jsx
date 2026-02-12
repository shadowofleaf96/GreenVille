"use client";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import IconifyComponent from "@/components/shared/iconify/iconify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ImageUpload({
  label,
  value,
  onChange,
  helperText,
  sx,
  className,
  style,
  disabled = false,
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof value === "string") {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Pass the File object to parent
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(""); // Clear the value
  };

  return (
    <div
      className={`
        w-full p-6 rounded-xl border-2 border-dashed border-gray-200 
        bg-gray-50/50 flex flex-col items-center justify-center
        transition-all duration-200
        ${
          disabled
            ? "opacity-50 pointer-events-none"
            : "hover:border-primary/50 hover:bg-primary/2"
        }
        ${className || ""}
      `}
      style={{ ...style, ...sx }}
    >
      <Label className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </Label>

      {helperText && (
        <p className="mb-4 text-xs text-gray-400 text-center">{helperText}</p>
      )}

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 shadow-sm group">
          <LazyImage
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Button
            size="icon"
            variant="destructive"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <IconifyComponent icon="material-symbols:close" width={18} />
          </Button>
        </div>
      ) : (
        <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-100/50 rounded-lg mb-4">
          <IconifyComponent
            icon="material-symbols:image-outline"
            width={48}
            className="text-gray-300 mb-2"
          />
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            No image selected
          </span>
        </div>
      )}

      <Button
        asChild
        variant="outline"
        disabled={disabled}
        className="cursor-pointer font-bold"
      >
        <label className="flex items-center gap-2">
          <IconifyComponent icon="material-symbols:upload" width={20} />
          {preview ? "Change Image" : "Choose File"}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      </Button>
    </div>
  );
}

ImageUpload.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // String URL or File object
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  sx: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};
