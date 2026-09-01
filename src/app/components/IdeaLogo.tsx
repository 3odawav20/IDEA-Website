type IdeaLogoProps = {
  compact?: boolean;
};

/**
 * The supplied official IDEA Business Administration lock-up. The source file
 * includes generous white space, so this component frames just the artwork
 * without resampling or redrawing the logo.
 */
export function IdeaLogo({ compact = false }: IdeaLogoProps) {
  return (
    <span
      className={`idea-official-logo ${compact ? "idea-official-logo--compact" : ""}`}
      aria-label="IDEA Business Administration"
      role="img"
    >
      <img src="/branding/idea-business-administration.jpg" alt="IDEA Business Administration" />
    </span>
  );
}
