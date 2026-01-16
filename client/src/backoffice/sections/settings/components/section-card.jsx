import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Iconify from "../../../components/iconify/iconify";
import { useTranslation } from "react-i18next";

const SectionCard = ({
  title,
  description,
  isActive,
  onToggle,
  isCollapsible = true,
  isOpen,
  onToggleCollapse,
  badge,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      <div
        className={`flex items-center justify-between p-5 ${
          isCollapsible ? "cursor-pointer" : ""
        } hover:bg-gray-50/50 transition-colors ${
          isOpen ? "border-b border-gray-100" : ""
        }`}
        onClick={isCollapsible ? onToggleCollapse : undefined}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h6 className="text-lg font-bold text-gray-800 tracking-tight">
              {title}
            </h6>
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {onToggle && (
            <div
              className="flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Switch checked={isActive} onCheckedChange={onToggle} />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {isActive ? t("Enabled") : t("Disabled")}
              </span>
            </div>
          )}
          {isCollapsible && (
            <Iconify
              icon="ic:baseline-expand-more"
              className={`w-6 h-6 transform transition-transform duration-300 text-gray-400 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default SectionCard;
