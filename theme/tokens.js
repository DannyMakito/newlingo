/** @type {const} */
const colors = {
  lingua: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },
  neutral: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },
};

/** @type {const} */
const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
};

/** @type {const} */
const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 1.2,
    fontFamily: fontFamily.bold,
  },
  h2: {
    fontSize: 24,
    lineHeight: 1.3,
    fontFamily: fontFamily.semibold,
  },
  h3: {
    fontSize: 20,
    lineHeight: 1.3,
    fontFamily: fontFamily.semibold,
  },
  h4: {
    fontSize: 16,
    lineHeight: 1.4,
    fontFamily: fontFamily.medium,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: fontFamily.regular,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: fontFamily.regular,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 1.6,
    fontFamily: fontFamily.regular,
  },
  caption: {
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: fontFamily.regular,
  },
};

const tailwindColors = {
  "lingua-purple": colors.lingua.purple,
  "lingua-deep-purple": colors.lingua.deepPurple,
  "lingua-blue": colors.lingua.blue,
  "lingua-green": colors.lingua.green,
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  streak: colors.semantic.streak,
  error: colors.semantic.error,
  info: colors.semantic.info,
  "text-primary": colors.neutral.textPrimary,
  "text-secondary": colors.neutral.textSecondary,
  border: colors.neutral.border,
  surface: colors.neutral.surface,
  background: colors.neutral.background,
};

const tailwindFontFamily = {
  sans: [fontFamily.regular],
  poppins: [fontFamily.regular],
  "poppins-regular": [fontFamily.regular],
  "poppins-medium": [fontFamily.medium],
  "poppins-semibold": [fontFamily.semibold],
  "poppins-bold": [fontFamily.bold],
};

const tailwindFontSize = {
  h1: [`${typography.h1.fontSize}px`, { lineHeight: typography.h1.lineHeight }],
  h2: [`${typography.h2.fontSize}px`, { lineHeight: typography.h2.lineHeight }],
  h3: [`${typography.h3.fontSize}px`, { lineHeight: typography.h3.lineHeight }],
  h4: [`${typography.h4.fontSize}px`, { lineHeight: typography.h4.lineHeight }],
  "body-lg": [
    `${typography.bodyLarge.fontSize}px`,
    { lineHeight: typography.bodyLarge.lineHeight },
  ],
  "body-md": [
    `${typography.bodyMedium.fontSize}px`,
    { lineHeight: typography.bodyMedium.lineHeight },
  ],
  "body-sm": [
    `${typography.bodySmall.fontSize}px`,
    { lineHeight: typography.bodySmall.lineHeight },
  ],
  caption: [
    `${typography.caption.fontSize}px`,
    { lineHeight: typography.caption.lineHeight },
  ],
};

module.exports = {
  colors,
  fontFamily,
  typography,
  tailwindTheme: {
    extend: {
      colors: tailwindColors,
      fontFamily: tailwindFontFamily,
      fontSize: tailwindFontSize,
    },
  },
};
