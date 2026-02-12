"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Iconify from "@/components/shared/iconify/iconify";
import { useTranslation } from "react-i18next";

const SettingsSearch = ({ onSearch, sections = [] }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = sections.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchQuery, sections]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Iconify
          icon="solar:magnifer-bold-duotone"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("Search settings... (Ctrl+K)")}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20 h-11 rounded-xl border-gray-200 focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2"
          >
            <Iconify icon="ic:round-close" className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-2 space-y-1">
            {results.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (result.onClick) result.onClick();
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-bold text-sm text-gray-800">
                  {result.title}
                </div>
                {result.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {result.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSearch;
