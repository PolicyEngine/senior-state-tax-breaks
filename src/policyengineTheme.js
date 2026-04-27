import { colors, spacing, typography } from "@policyengine/design-system/tokens";

export { colors, spacing, typography };

const themeVariables = {
  "--pe-color-primary-50": colors.primary[50],
  "--pe-color-primary-100": colors.primary[100],
  "--pe-color-primary-200": colors.primary[200],
  "--pe-color-primary-300": colors.primary[300],
  "--pe-color-primary-500": colors.primary[500],
  "--pe-color-primary-600": colors.primary[600],
  "--pe-color-primary-700": colors.primary[700],
  "--pe-color-secondary-50": colors.secondary[50],
  "--pe-color-secondary-100": colors.secondary[100],
  "--pe-color-secondary-200": colors.secondary[200],
  "--pe-color-secondary-300": colors.secondary[300],
  "--pe-color-secondary-500": colors.secondary[500],
  "--pe-color-secondary-700": colors.secondary[700],
  "--pe-color-gray-50": colors.gray[50],
  "--pe-color-gray-100": colors.gray[100],
  "--pe-color-gray-200": colors.gray[200],
  "--pe-color-gray-300": colors.gray[300],
  "--pe-color-gray-400": colors.gray[400],
  "--pe-color-gray-500": colors.gray[500],
  "--pe-color-gray-600": colors.gray[600],
  "--pe-color-gray-700": colors.gray[700],
  "--pe-color-bg-primary": colors.background.primary,
  "--pe-color-bg-secondary": colors.background.secondary,
  "--pe-color-bg-tertiary": colors.background.tertiary,
  "--pe-color-text-primary": colors.text.primary,
  "--pe-color-text-secondary": colors.text.secondary,
  "--pe-color-text-tertiary": colors.text.tertiary,
  "--pe-color-border-light": colors.border.light,
  "--pe-color-border-medium": colors.border.medium,
  "--pe-color-border-dark": colors.border.dark,
  "--pe-color-shadow-light": colors.shadow.light,
  "--pe-color-shadow-medium": colors.shadow.medium,
  "--pe-color-white": colors.white,
  "--pe-color-black": colors.black,
  "--pe-space-xs": spacing.xs,
  "--pe-space-sm": spacing.sm,
  "--pe-space-md": spacing.md,
  "--pe-space-lg": spacing.lg,
  "--pe-space-xl": spacing.xl,
  "--pe-space-2xl": spacing["2xl"],
  "--pe-space-3xl": spacing["3xl"],
  "--pe-space-4xl": spacing["4xl"],
  "--pe-radius-chip": spacing.radius.chip,
  "--pe-radius-element": spacing.radius.element,
  "--pe-radius-container": spacing.radius.container,
  "--pe-radius-feature": spacing.radius.feature,
  "--pe-font-primary": typography.fontFamily.primary,
  "--pe-font-mono": typography.fontFamily.mono,
  "--pe-font-size-sm": typography.fontSize.sm,
  "--pe-font-size-base": typography.fontSize.base,
  "--pe-font-size-lg": typography.fontSize.lg,
  "--pe-font-size-xl": typography.fontSize.xl,
  "--pe-font-size-2xl": typography.fontSize["2xl"],
  "--pe-font-size-3xl": typography.fontSize["3xl"],
  "--pe-font-size-4xl": typography.fontSize["4xl"],
  "--pe-line-height-normal": typography.lineHeight.normal,
  "--pe-line-height-relaxed": typography.lineHeight.relaxed,
};

export function applyThemeVariables() {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  Object.entries(themeVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
