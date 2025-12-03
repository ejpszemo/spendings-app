export const themes: Record<string, string> = {
  light: "light",
  dark: "dark",
};

export type Theme = keyof typeof themes;
