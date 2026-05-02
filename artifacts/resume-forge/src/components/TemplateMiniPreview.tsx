import type { ResumeTemplate } from "@/data/templates";

interface Props {
  template: ResumeTemplate;
  selected?: boolean;
}

export default function TemplateMiniPreview({ template, selected }: Props) {
  const accent = template.accentColor;
  const header = template.headerBg;

  const Preview = () => {
    if (template.layout === "sidebar") return <SidebarLayout accent={accent} header={header} />;
    if (template.layout === "two-col") return <TwoColLayout accent={accent} header={header} />;
    return <SingleColLayout accent={accent} header={header} />;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg border transition-all duration-200 ${
        selected
          ? "border-violet-500 shadow-lg shadow-violet-500/20"
          : "border-white/10 hover:border-white/25"
      }`}
      style={{ width: "100%", paddingBottom: "133%", background: "#f8fafc" }}
    >
      <div className="absolute inset-0">
        <Preview />
      </div>
    </div>
  );
}

/* ── Single Column ── */
function SingleColLayout({ accent, header }: { accent: string; header: string }) {
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Page bg */}
      <rect width="120" height="160" fill="#f9fafb" />
      {/* Header band */}
      <rect width="120" height="28" fill={header} />
      {/* Name line */}
      <rect x="8" y="8" width="60" height="5" rx="2" fill="white" opacity="0.95" />
      {/* Role / contact */}
      <rect x="8" y="16" width="42" height="3" rx="1.5" fill="white" opacity="0.6" />
      <rect x="8" y="22" width="70" height="2" rx="1" fill="white" opacity="0.4" />
      {/* Section divider */}
      <rect x="8" y="35" width="30" height="2.5" rx="1.2" fill={accent} />
      <rect x="8" y="40" width="104" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {/* Bullets */}
      {[46, 53, 60].map((y) => (
        <g key={y}>
          <circle cx="11" cy={y} r="1.2" fill={accent} opacity="0.7" />
          <rect x="15" y={y - 1.5} width={45 + Math.random() * 0} height="3" rx="1.2" fill="#9ca3af" />
          <rect x="15" y={y + 3} width="35" height="2.5" rx="1" fill="#d1d5db" />
        </g>
      ))}
      {/* Section 2 */}
      <rect x="8" y="73" width="30" height="2.5" rx="1.2" fill={accent} />
      <rect x="8" y="78" width="104" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {[84, 91, 98].map((y) => (
        <g key={y}>
          <circle cx="11" cy={y} r="1.2" fill={accent} opacity="0.7" />
          <rect x="15" y={y - 1.5} width="40" height="3" rx="1.2" fill="#9ca3af" />
          <rect x="15" y={y + 3} width="50" height="2.5" rx="1" fill="#d1d5db" />
        </g>
      ))}
      {/* Education */}
      <rect x="8" y="111" width="30" height="2.5" rx="1.2" fill={accent} />
      <rect x="8" y="116" width="104" height="1" rx="0.5" fill={accent} opacity="0.3" />
      <rect x="8" y="121" width="55" height="3" rx="1.2" fill="#9ca3af" />
      <rect x="8" y="127" width="40" height="2.5" rx="1" fill="#d1d5db" />
      {/* Skills */}
      <rect x="8" y="137" width="20" height="2.5" rx="1.2" fill={accent} />
      <rect x="8" y="142" width="104" height="1" rx="0.5" fill={accent} opacity="0.3" />
      <rect x="8" y="147" width="100" height="2.5" rx="1" fill="#d1d5db" />
      <rect x="8" y="152" width="80" height="2.5" rx="1" fill="#d1d5db" />
    </svg>
  );
}

/* ── Sidebar ── */
function SidebarLayout({ accent, header }: { accent: string; header: string }) {
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="#f9fafb" />
      {/* Sidebar bg */}
      <rect width="35" height="160" fill={header} opacity="0.9" />
      {/* Header row */}
      <rect x="40" y="8" width="68" height="5" rx="2" fill={header} opacity="0.85" />
      <rect x="40" y="16" width="48" height="3" rx="1.5" fill="#6b7280" />
      {/* Divider */}
      <rect x="40" y="23" width="72" height="0.8" rx="0.4" fill={accent} opacity="0.4" />
      {/* Sidebar content */}
      <rect x="4" y="14" width="26" height="3" rx="1.2" fill="white" opacity="0.7" />
      <rect x="4" y="20" width="20" height="2" rx="1" fill="white" opacity="0.45" />
      <rect x="4" y="25" width="24" height="2" rx="1" fill="white" opacity="0.45" />
      <rect x="4" y="32" width="18" height="2.5" rx="1.2" fill="white" opacity="0.6" />
      {[38, 43, 48, 53].map(y => (
        <rect key={y} x="4" y={y} width={16 + (y % 3) * 3} height="2" rx="1" fill="white" opacity="0.35" />
      ))}
      <rect x="4" y="62" width="18" height="2.5" rx="1.2" fill="white" opacity="0.6" />
      {[68, 73, 78].map(y => (
        <rect key={y} x="4" y={y} width={14 + (y % 3) * 2} height="2" rx="1" fill="white" opacity="0.35" />
      ))}
      {/* Main content */}
      <rect x="40" y="28" width="28" height="2.5" rx="1.2" fill={accent} />
      {[34, 40, 46].map(y => (
        <g key={y}>
          <circle cx="43" cy={y + 1} r="1" fill={accent} opacity="0.7" />
          <rect x="46" y={y} width="42" height="2.5" rx="1" fill="#9ca3af" />
          <rect x="46" y={y + 4} width="32" height="2" rx="1" fill="#d1d5db" />
        </g>
      ))}
      <rect x="40" y="60" width="28" height="2.5" rx="1.2" fill={accent} />
      {[66, 72, 78].map(y => (
        <g key={y}>
          <circle cx="43" cy={y + 1} r="1" fill={accent} opacity="0.7" />
          <rect x="46" y={y} width="38" height="2.5" rx="1" fill="#9ca3af" />
          <rect x="46" y={y + 4} width="28" height="2" rx="1" fill="#d1d5db" />
        </g>
      ))}
      <rect x="40" y="92" width="28" height="2.5" rx="1.2" fill={accent} />
      <rect x="40" y="98" width="68" height="2.5" rx="1" fill="#9ca3af" />
      <rect x="40" y="104" width="50" height="2" rx="1" fill="#d1d5db" />
    </svg>
  );
}

/* ── Two Column ── */
function TwoColLayout({ accent, header }: { accent: string; header: string }) {
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="160" fill="#f9fafb" />
      {/* Full-width header */}
      <rect width="120" height="22" fill={header} />
      <rect x="8" y="6" width="52" height="5" rx="2" fill="white" opacity="0.95" />
      <rect x="8" y="15" width="36" height="2.5" rx="1.2" fill="white" opacity="0.55" />
      {/* Column divider */}
      <rect x="60" y="25" width="0.8" height="130" fill={accent} opacity="0.2" />
      {/* Left column */}
      <rect x="5" y="28" width="24" height="2.5" rx="1.2" fill={accent} />
      <rect x="5" y="33" width="50" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {[38, 44, 50, 56].map(y => (
        <g key={y}>
          <circle cx="8" cy={y + 1} r="1" fill={accent} opacity="0.7" />
          <rect x="11" y={y} width="36" height="2.5" rx="1" fill="#9ca3af" />
          <rect x="11" y={y + 4} width="28" height="2" rx="1" fill="#d1d5db" />
        </g>
      ))}
      <rect x="5" y="70" width="24" height="2.5" rx="1.2" fill={accent} />
      <rect x="5" y="75" width="50" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {[80, 86, 92].map(y => (
        <g key={y}>
          <circle cx="8" cy={y + 1} r="1" fill={accent} opacity="0.7" />
          <rect x="11" y={y} width="32" height="2.5" rx="1" fill="#9ca3af" />
        </g>
      ))}
      {/* Right column */}
      <rect x="65" y="28" width="24" height="2.5" rx="1.2" fill={accent} />
      <rect x="65" y="33" width="48" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {[38, 44, 50, 56, 62, 68].map(y => (
        <rect key={y} x="65" y={y} width={30 + (y % 4) * 3} height="2.5" rx="1" fill="#d1d5db" />
      ))}
      <rect x="65" y="76" width="24" height="2.5" rx="1.2" fill={accent} />
      <rect x="65" y="81" width="48" height="1" rx="0.5" fill={accent} opacity="0.3" />
      {[86, 91, 96, 101].map(y => (
        <rect key={y} x="65" y={y} width={22 + (y % 3) * 4} height="2.5" rx="1" fill="#d1d5db" />
      ))}
    </svg>
  );
}
