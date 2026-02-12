import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook for settings search functionality
 */
export const useSettingsSearch = (sections = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  // Create searchable index
  const searchIndex = useMemo(() => {
    return sections.flatMap((section) => {
      const items = [];

      // Add section itself
      items.push({
        id: section.id,
        title: section.title,
        description: section.description,
        type: "section",
        keywords: section.keywords || [],
      });

      // Add subsections if any
      if (section.subsections) {
        section.subsections.forEach((sub) => {
          items.push({
            id: `${section.id}.${sub.id}`,
            title: sub.title,
            description: sub.description,
            type: "subsection",
            parentId: section.id,
            keywords: sub.keywords || [],
          });
        });
      }

      return items;
    });
  }, [sections]);

  // Fuzzy search function
  const fuzzyMatch = useCallback((text, query) => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Exact match
    if (lowerText.includes(lowerQuery)) return true;

    // Fuzzy match - check if all query characters appear in order
    let queryIndex = 0;
    for (
      let i = 0;
      i < lowerText.length && queryIndex < lowerQuery.length;
      i++
    ) {
      if (lowerText[i] === lowerQuery[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === lowerQuery.length;
  }, []);

  // Search results
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return searchIndex.filter((item) => {
      // Search in title
      if (fuzzyMatch(item.title, searchQuery)) return true;

      // Search in description
      if (item.description && fuzzyMatch(item.description, searchQuery))
        return true;

      // Search in keywords
      if (item.keywords.some((keyword) => fuzzyMatch(keyword, searchQuery)))
        return true;

      return false;
    });
  }, [searchQuery, searchIndex, fuzzyMatch]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSection(null);
  }, []);

  const navigateToResult = useCallback(
    (resultId) => {
      const result = searchIndex.find((item) => item.id === resultId);
      if (result) {
        const sectionId =
          result.type === "section" ? result.id : result.parentId;
        setActiveSection(sectionId);
      }
    },
    [searchIndex]
  );

  return {
    searchQuery,
    results,
    activeSection,
    handleSearch,
    clearSearch,
    navigateToResult,
  };
};
