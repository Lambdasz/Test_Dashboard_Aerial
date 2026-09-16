import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { PROJECTS } from "@/data/mock";

const store = {
  dark: true,
  projectId: PROJECTS[0].id,
  toasts: [],
};
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return store;
}
function getServerSnapshot() {
  return store;
}

let toastSeq = 0;

export function useApp() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleDark = useCallback(() => {
    store.dark = !store.dark;
    store.toasts = store.toasts.slice();
    emit();
  }, []);

  const setProjectId = useCallback((id) => {
    store.projectId = id;
    emit();
  }, []);

  const toast = useCallback((message, intent = "primary") => {
    toastSeq += 1;
    const id = `t-${toastSeq}`;
    store.toasts = [...store.toasts, { id, message, intent }];
    emit();
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        store.toasts = store.toasts.filter((t) => t.id !== id);
        emit();
      }, 4000);
    }
  }, []);

  const dismiss = useCallback((id) => {
    store.toasts = store.toasts.filter((t) => t.id !== id);
    emit();
  }, []);

  const project = useMemo(
    () => PROJECTS.find((p) => p.id === state.projectId) ?? PROJECTS[0],
    [state.projectId],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("aap-dark", state.dark);
    document.body.classList.toggle("aap-light", !state.dark);
  }, [state.dark]);

  return {
    dark: state.dark,
    toggleDark,
    project,
    projects: PROJECTS,
    setProjectId,
    toasts: state.toasts,
    toast,
    dismiss,
  };
}
