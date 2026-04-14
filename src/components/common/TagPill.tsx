type TagPillTone = "default" | "muted" | "accent" | "success" | "warning";

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
        : tone === "accent"
          ? "tag-pill tag-pill--accent"
          : tone === "success"
            ? "tag-pill tag-pill--success"
            : "tag-pill tag-pill--warning";

  return <span className={className}>{label}</span>;
}
