import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Iconify from "@/components/shared/iconify/iconify";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const SettingsActions = ({
  onSave,
  onReset,
  onExport,
  onImport,
  loading = false,
  unsavedChanges = false,
}) => {
  const { t } = useTranslation();

  const handleExport = () => {
    if (onExport) {
      onExport();
      toast.success(t("Settings exported successfully"));
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (onImport) {
              onImport(data);
              toast.success(t("Settings imported successfully"));
            }
          } catch (error) {
            toast.error(t("Invalid settings file"));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (
      window.confirm(
        t("Are you sure you want to reset all settings to defaults?")
      )
    ) {
      if (onReset) {
        onReset();
        toast.info(t("Settings reset to defaults"));
      }
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {unsavedChanges && (
        <Badge
          variant="outline"
          className="text-orange-600 border-orange-300 bg-orange-50"
        >
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse" />
          {t("Unsaved changes")}
        </Badge>
      )}

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 px-4 rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <Iconify
              icon="solar:menu-dots-bold-duotone"
              className="w-5 h-5 mr-2"
            />
            {t("More")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleExport}>
            <Iconify
              icon="solar:export-bold-duotone"
              className="w-4 h-4 mr-2"
            />
            {t("Export Settings")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImport}>
            <Iconify
              icon="solar:import-bold-duotone"
              className="w-4 h-4 mr-2"
            />
            {t("Import Settings")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleReset} className="text-red-600">
            <Iconify
              icon="solar:restart-bold-duotone"
              className="w-4 h-4 mr-2"
            />
            {t("Reset to Defaults")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Button */}
      <Button
        onClick={onSave}
        disabled={loading || !unsavedChanges}
        className="h-11 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <Iconify icon="svg-spinners:180-ring-with-bg" className="w-5 h-5" />
        ) : (
          <Iconify icon="solar:diskette-bold-duotone" className="w-5 h-5" />
        )}
        <span>{t("Save Changes")}</span>
      </Button>
    </div>
  );
};

export default SettingsActions;

