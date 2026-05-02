export interface ATSScore {
  overall: number;
  keywordDensity: number;
  formatting: number;
  impactStatements: number;
  sections: number;
  label: string;
  color: string;
}

const ACTION_VERBS = [
  "achieved","built","created","delivered","designed","developed","drove","executed",
  "generated","grew","implemented","improved","increased","launched","led","managed",
  "optimized","owned","reduced","scaled","shipped","streamlined","transformed","architected",
  "automated","collaborated","coordinated","deployed","established","exceeded","founded",
  "mentored","migrated","negotiated","oversaw","partnered","pioneered","produced","spearheaded",
];

const SECTION_HEADERS = [
  "experience","education","skills","summary","objective","projects","certifications",
  "work experience","professional experience","technical skills","awards","publications",
];

const QUANTITY_PATTERN = /\d+[%$+xX]|\$[\d,]+|\d+[\s-]*(million|billion|k\b|percent|users|customers|employees|days|weeks|hours|months|years)/gi;

export function scoreResume(text: string): ATSScore {
  if (!text.trim() || text.length < 50) {
    return { overall: 0, keywordDensity: 0, formatting: 0, impactStatements: 0, sections: 0, label: "No resume", color: "text-muted-foreground" };
  }

  const lower = text.toLowerCase();
  const lines = text.split("\n").filter(l => l.trim());
  const wordCount = text.split(/\s+/).length;

  // 1. Keyword density (action verbs)
  const verbMatches = ACTION_VERBS.filter(v => lower.includes(v)).length;
  const keywordDensity = Math.min(100, Math.round((verbMatches / Math.max(wordCount / 50, 1)) * 40 + verbMatches * 4));

  // 2. Section presence
  const foundSections = SECTION_HEADERS.filter(s => lower.includes(s)).length;
  const sections = Math.min(100, Math.round(foundSections * 20));

  // 3. Quantified impact
  const quantMatches = (text.match(QUANTITY_PATTERN) || []).length;
  const impactStatements = Math.min(100, Math.round(quantMatches * 12 + (quantMatches > 0 ? 20 : 0)));

  // 4. Formatting quality (has bullets, reasonable length)
  const bulletLines = lines.filter(l => /^[\s]*[-•*◦]/.test(l)).length;
  const hasContact = /\b[\w.]+@[\w.]+\.\w+/.test(text) || /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
  const lengthScore = wordCount >= 200 && wordCount <= 700 ? 30 : wordCount >= 100 ? 15 : 0;
  const formatting = Math.min(100, Math.round(bulletLines * 4 + (hasContact ? 20 : 0) + lengthScore));

  // Weighted overall
  const overall = Math.min(99, Math.round(
    keywordDensity * 0.30 +
    sections * 0.25 +
    impactStatements * 0.25 +
    formatting * 0.20
  ));

  let label = "Needs Work";
  let color = "text-red-400";
  if (overall >= 80) { label = "Excellent"; color = "text-green-400"; }
  else if (overall >= 65) { label = "Good"; color = "text-emerald-400"; }
  else if (overall >= 45) { label = "Fair"; color = "text-amber-400"; }

  return {
    overall,
    keywordDensity: Math.min(99, keywordDensity),
    formatting: Math.min(99, formatting),
    impactStatements: Math.min(99, impactStatements),
    sections: Math.min(99, sections),
    label,
    color,
  };
}
