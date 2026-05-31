import React from "react";

export interface ShieldItem {
  id: string;
  type: "score" | "counter" | "link";
  label: string;
  icon: string;
  defaultData: string;
}

export const AVAILABLE_SHIELDS: ShieldItem[] = [
  { id: "sh-score", type: "score", label: "Оценка", icon: "⭐", defaultData: "8.5" },
  { id: "sh-counter", type: "counter", label: "Счетчик", icon: "🔢", defaultData: "0" },
  { id: "sh-link", type: "link", label: "Ссылка", icon: "🔗", defaultData: "google.com" }
];
