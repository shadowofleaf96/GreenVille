import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing settings form state with dirty tracking
 */
export const useSettingsForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [initialState, setInitialState] = useState(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update initial state when initialValues change
  useEffect(() => {
    setValues(initialValues);
    setInitialState(initialValues);
    setIsDirty(false);
  }, [initialValues]);

  // Check if form is dirty
  useEffect(() => {
    const dirty = JSON.stringify(values) !== JSON.stringify(initialState);
    setIsDirty(dirty);
  }, [values, initialState]);

  const handleSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        setInitialState(data);
        setIsDirty(false);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialState);
    setIsDirty(false);
  }, [initialState]);

  const resetToDefaults = useCallback((defaults) => {
    setValues(defaults);
    setInitialState(defaults);
    setIsDirty(true);
  }, []);

  return {
    values,
    setValues,
    isDirty,
    isSubmitting,
    handleSubmit,
    reset,
    resetToDefaults,
  };
};

/**
 * Hook for unsaved changes warning
 */
export const useUnsavedChangesWarning = (isDirty) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
};
