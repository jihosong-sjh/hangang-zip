type TagPillTone = "default" | "muted" | "accent";

type TagPillProps = {
  label: string;
  tone?: TagPillTone;
};

export function TagPill({ label, tone = "default" }: TagPillProps) {
  const className =
    tone === "default"
      ? "tag-pill"
      : tone === "muted"
        ? "tag-pill tag-pill--muted"
        : "tag-pill tag-pill--accent";

  return <span className={className}>{label}</span>;
}
