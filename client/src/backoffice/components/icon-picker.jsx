import { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Iconify from "../components/iconify/iconify";

// Curated list of popular icons for e-commerce
const ICON_LIST = [
  // Shipping & Delivery
  "mdi:truck-delivery-outline",
  "mdi:truck-fast-outline",
  "carbon:delivery",
  "la:shipping-fast",
  "fluent:vehicle-truck-bag-24-regular",

  // Support & Service
  "bx:support",
  "mdi:face-agent",
  "ph:headset-bold",
  "ri:customer-service-2-line",
  "ant-design:customer-service-outlined",

  // Payment & Security
  "mdi:shield-check-outline",
  "mdi:lock-outline",
  "ic:outline-payments",
  "ph:credit-card",
  "mdi:cash-multiple",
  "fluent:payment-24-regular",

  // Quality & Features
  "mdi:star-outline",
  "mdi:certificate-outline",
  "mdi:leaf",
  "ph:plant",
  "lucide:organic",
  "mdi:check-decagram-outline",
  "mdi:trophy-outline",
  "mdi:tag-outline",
  "mdi:percent-outline",
  "mdi:gift-outline",

  // General
  "mdi:information-outline",
  "mdi:help-circle-outline",
  "mdi:home-outline",
  "mdi:map-marker-outline",
  "mdi:phone-outline",
  "mdi:email-outline",
  "mdi:calendar-clock",
  "mdi:package-variant-closed",
];

export default function IconPicker({
  value,
  onChange,
  label,
  className,
  style,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelectFn = (icon) => {
    onChange(icon);
    setOpen(false);
  };

  const filteredIcons = ICON_LIST.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`w-full ${className || ""}`} style={style}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer group">
            <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wider">
              {label || "Select Icon"}
            </label>
            <div className="flex items-center w-full h-10 px-3 rounded-md border border-input bg-background text-sm transition-colors group-hover:border-primary/50">
              {value ? (
                <div className="flex items-center gap-2">
                  <Iconify icon={value} width={24} />
                  <span className="text-gray-700 font-medium">{value}</span>
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  No icon selected
                </span>
              )}
              <div className="ml-auto">
                <Iconify
                  icon="eva:arrow-ios-downward-fill"
                  className="text-gray-400"
                />
              </div>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4" align="start">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm leading-none">Select an Icon</h4>

            <div className="relative">
              <Iconify
                icon="eva:search-fill"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width={18}
              />
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="max-h-60 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-2">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    title={icon}
                    onClick={() => handleSelectFn(icon)}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-lg border transition-all
                      ${
                        value === icon
                          ? "border-primary bg-primary/5 text-primary scale-110 shadow-sm"
                          : "border-gray-100 hover:border-primary/30 hover:bg-gray-50 text-gray-500"
                      }
                    `}
                  >
                    <Iconify icon={icon} width={24} />
                  </button>
                ))}
              </div>

              {filteredIcons.length === 0 && (
                <div className="py-8 text-center">
                  <span className="text-xs text-muted-foreground font-medium">
                    No icons found
                  </span>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

IconPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};
