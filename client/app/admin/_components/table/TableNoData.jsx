"use client";

import PropTypes from "prop-types";
import { TableRow, TableCell } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";

// ----------------------------------------------------------------------

export default function TableNoData({
  query,
  colSpan = 9,
  resourceName = "elements",
}) {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell align="center" colSpan={colSpan} className="py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl transform scale-150 animate-pulse" />
            <div className="relative bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <Iconify
                icon="hugeicons:search-not-found-01"
                className="text-primary"
                width={64}
                height={64}
              />
            </div>
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h6 className="text-2xl font-black text-gray-900 tracking-tight">
              {t("Not found")}
            </h6>

            {query ? (
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                {t("No results found for")} &nbsp;
                <span className="text-primary font-bold px-1.5 py-0.5 bg-primary/5 rounded-lg inline-block my-1 italic">
                  &quot;{query}&quot;
                </span>
                .
                <br />
                <span className="opacity-75">
                  {t("Try checking for typos or using complete words.")}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500">
                {t("No {{resource}} found", { resource: t(resourceName) })}
              </p>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
  colSpan: PropTypes.number,
  resourceName: PropTypes.string,
};
