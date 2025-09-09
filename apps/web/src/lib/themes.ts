export type ThemeId =
  | "night-fishing"
  | "rustic-nature"
  | "ice-fishing"
  | "sunset-adventure"
  | "tech-angler";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      main: string;
      card: string;
      hover: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    shadow: string;
    active: {
      background: string;
      text: string;
      border: string;
      shadow: string;
    };
  };
  gradients: {
    background: string;
    card: string;
    button: string;
    header: string;
  };
  header: {
    background: string;
    text: string;
    logo: string;
  };
}

export const themes: Record<ThemeId, ThemeConfig> = {
  "night-fishing": {
    id: "night-fishing",
    name: "Night Fishing",
    description: "Dark, mysterious atmosphere perfect for nocturnal angling",
    icon: "🌙",
    colors: {
      primary: "#1e40af", // blue-800
      secondary: "#3b82f6", // blue-500
      accent: "#60a5fa", // blue-400
      background: {
        main: "from-slate-900 via-blue-900 to-slate-900",
        card: "bg-slate-800/50",
        hover: "hover:bg-slate-800/70",
      },
      text: {
        primary: "text-white",
        secondary: "text-slate-200",
        muted: "text-slate-400",
      },
      border: "border-slate-700/50",
      shadow: "shadow-blue-500/20",
      active: {
        background: "bg-blue-600/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
        shadow: "shadow-blue-500/20",
      },
    },
    gradients: {
      background: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
      card: "bg-gradient-to-br from-slate-800/50 to-slate-700/30",
      button: "bg-gradient-to-r from-blue-600 to-blue-700",
      header: "bg-gradient-to-r from-slate-800 to-blue-600",
    },
    header: {
      background: "bg-slate-900/95",
      text: "bg-blue-600/50 bg-clip-text text-transparent",
      logo: "#60a5fa",
    },
  },
  "rustic-nature": {
    id: "rustic-nature",
    name: "Rustic Nature",
    description: "Warm, earthy tones inspired by forest and lake settings",
    icon: "🌲",
    colors: {
      primary: "#059669", // emerald-600
      secondary: "#10b981", // emerald-500
      accent: "#34d399", // emerald-400
      background: {
        main: "from-amber-900 via-green-900 to-emerald-900",
        card: "bg-amber-800/40",
        hover: "hover:bg-amber-800/60",
      },
      text: {
        primary: "text-amber-50",
        secondary: "text-amber-200",
        muted: "text-amber-300",
      },
      border: "border-amber-700/50",
      shadow: "shadow-emerald-500/20",
      active: {
        background: "bg-emerald-600/20",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        shadow: "shadow-emerald-500/20",
      },
    },
    gradients: {
      background:
        "bg-gradient-to-br from-amber-900 via-green-900 to-emerald-900",
      card: "bg-gradient-to-br from-amber-800/40 to-green-800/30",
      button: "bg-gradient-to-r from-emerald-600 to-emerald-700",
      header: "bg-gradient-to-r from-amber-800 to-emerald-600",
    },
    header: {
      background: "bg-amber-900/95",
      text: "bg-emerald-600/50 bg-clip-text text-transparent",
      logo: "#34d399",
    },
  },
  "ice-fishing": {
    id: "ice-fishing",
    name: "Ice Fishing",
    description: "Cool, crisp whites and blues for winter fishing adventures",
    icon: "❄️",
    colors: {
      primary: "#0ea5e9", // sky-500
      secondary: "#38bdf8", // sky-400
      accent: "#7dd3fc", // sky-300
      background: {
        main: "from-slate-900 via-blue-900 to-cyan-900",
        card: "bg-slate-800/40",
        hover: "hover:bg-slate-800/60",
      },
      text: {
        primary: "text-slate-50",
        secondary: "text-slate-200",
        muted: "text-slate-300",
      },
      border: "border-slate-700/50",
      shadow: "shadow-cyan-500/20",
      active: {
        background: "bg-cyan-600/20",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        shadow: "shadow-cyan-500/20",
      },
    },
    gradients: {
      background: "bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900",
      card: "bg-gradient-to-br from-slate-800/40 to-blue-800/30",
      button: "bg-gradient-to-r from-sky-500 to-cyan-600",
      header: "bg-gradient-to-r from-slate-800 to-cyan-600",
    },
    header: {
      background: "bg-slate-900/95",
      text: "bg-cyan-600/50 bg-clip-text text-transparent",
      logo: "#7dd3fc",
    },
  },
  "sunset-adventure": {
    id: "sunset-adventure",
    name: "Sunset Adventure",
    description: "Warm oranges and purples capturing the magic of golden hour",
    icon: "🌅",
    colors: {
      primary: "#dc2626", // red-600
      secondary: "#f97316", // orange-500
      accent: "#fb923c", // orange-400
      background: {
        main: "from-orange-900 via-red-900 to-purple-900",
        card: "bg-orange-800/40",
        hover: "hover:bg-orange-800/60",
      },
      text: {
        primary: "text-orange-50",
        secondary: "text-orange-200",
        muted: "text-orange-300",
      },
      border: "border-orange-700/50",
      shadow: "shadow-orange-500/20",
      active: {
        background: "bg-orange-600/20",
        text: "text-orange-400",
        border: "border-orange-500/30",
        shadow: "shadow-orange-500/20",
      },
    },
    gradients: {
      background: "bg-gradient-to-br from-orange-900 via-red-900 to-purple-900",
      card: "bg-gradient-to-br from-orange-800/40 to-red-800/30",
      button: "bg-gradient-to-r from-orange-600 to-red-600",
      header: "bg-gradient-to-r from-orange-800 to-red-600",
    },
    header: {
      background: "bg-orange-900/95",
      text: "bg-orange-600/50 bg-clip-text text-transparent",
      logo: "#fb923c",
    },
  },
  "tech-angler": {
    id: "tech-angler",
    name: "Tech-Driven Angler",
    description:
      "Modern, high-tech aesthetic with neon accents and sleek design",
    icon: "⚡",
    colors: {
      primary: "#7c3aed", // violet-600
      secondary: "#a855f7", // purple-500
      accent: "#c084fc", // purple-400
      background: {
        main: "from-gray-900 via-purple-900 to-indigo-900",
        card: "bg-gray-800/50",
        hover: "hover:bg-gray-800/70",
      },
      text: {
        primary: "text-white",
        secondary: "text-purple-200",
        muted: "text-purple-300",
      },
      border: "border-purple-700/50",
      shadow: "shadow-purple-500/20",
      active: {
        background: "bg-purple-600/20",
        text: "text-purple-400",
        border: "border-purple-500/30",
        shadow: "shadow-purple-500/20",
      },
    },
    gradients: {
      background:
        "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900",
      card: "bg-gradient-to-br from-gray-800/50 to-purple-800/30",
      button: "bg-gradient-to-r from-purple-600 to-violet-600",
      header: "bg-gradient-to-r from-gray-800 to-purple-600",
    },
    header: {
      background: "bg-gray-900/95",
      text: "bg-purple-600/50 bg-clip-text text-transparent",
      logo: "#c084fc",
    },
  },
};

export const getTheme = (themeId: ThemeId): ThemeConfig => {
  return themes[themeId] || themes["night-fishing"];
};

export const getThemeClasses = (themeId: ThemeId) => {
  const theme = getTheme(themeId);
  return {
    background: theme.gradients.background,
    card: theme.colors.background.card,
    cardHover: theme.colors.background.hover,
    textPrimary: theme.colors.text.primary,
    textSecondary: theme.colors.text.secondary,
    textMuted: theme.colors.text.muted,
    border: theme.colors.border,
    shadow: theme.colors.shadow,
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    accent: theme.colors.accent,
  };
};
