import { GoogleGenAI } from '@google/genai';
import { PortfolioData, VibeProposal, AgentMode } from '@/types/portfolio';

function getApiKey(customKey?: string): string {
  if (customKey && customKey.trim() !== '') {
    return customKey.trim();
  }
  return process.env.GEMINI_API_KEY || '';
}

function getAIClient(customKey?: string) {
  const key = getApiKey(customKey);
  if (!key) {
    throw new Error('Chưa tìm thấy Gemini API Key. Vui lòng mở "Settings" trên góc phải web và dán API Key của bạn hoặc cài đặt biến môi trường GEMINI_API_KEY trên Vercel.');
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function parseDocumentWithGemini(
  rawText: string,
  industryInput?: string,
  customApiKey?: string
): Promise<{ data: PortfolioData; detectedIndustry: string }> {
  const ai = getAIClient(customApiKey);

  const prompt = `You are a Senior Executive Recruiter & Portfolio Architect. Analyze this resume/raw document text and extract structured portfolio data.

Target Industry Preference (if any): "${industryInput || 'Auto-detect'}"

RAW DOCUMENT:
"""
${rawText}
"""

Return ONLY a valid, strictly formatted JSON object with no markdown formatting or triple backticks around the json if possible. The JSON structure MUST match this exact schema:
{
  "personalInfo": {
    "fullName": "Name",
    "professionalTitle": "Senior Title",
    "tagline": "Punchy 1-sentence value proposition",
    "bio": "Compelling 2-3 sentence executive bio with key achievements",
    "email": "email@example.com",
    "phone": "Phone or empty",
    "location": "City, Country",
    "website": "URL or empty",
    "github": "URL or empty",
    "linkedin": "URL or empty",
    "twitter": "URL or empty"
  },
  "heroMetrics": [
    { "id": "m1", "label": "Key Accomplishment 1", "value": "$2.5M", "change": "+40% YoY" },
    { "id": "m2", "label": "Key Accomplishment 2", "value": "15+", "change": "Projects Shipped" },
    { "id": "m3", "label": "Key Accomplishment 3", "value": "100k+", "change": "Active Users" }
  ],
  "experience": [
    {
      "id": "e1",
      "company": "Company Name",
      "role": "Role Title",
      "period": "2022 - Present",
      "location": "Location",
      "description": "Summary of responsibilities and scope",
      "achievements": [
        "Quantifiable achievement metric 1",
        "Quantifiable achievement metric 2"
      ],
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "projects": [
    {
      "id": "p1",
      "title": "Project Name",
      "description": "Highlighting problem solved and outcome",
      "impactMetric": "10x performance boost",
      "tags": ["Tag1", "Tag2"],
      "liveUrl": "",
      "githubUrl": "",
      "featured": true
    }
  ],
  "skills": [
    {
      "id": "s1",
      "category": "Core Engineering / Leadership",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  "education": [
    {
      "id": "ed1",
      "institution": "University Name",
      "degree": "B.S. Computer Science",
      "period": "2018 - 2022",
      "details": "Honors / Key focus"
    }
  ],
  "awards": [
    {
      "id": "a1",
      "title": "Award Title",
      "issuer": "Issuing Body",
      "year": "2024"
    }
  ],
  "industry": "Inferred Industry",
  "targetRole": "Inferred Target Role"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const parsedJSON = cleanAndParseJSON(response.text || '');

  return {
    data: parsedJSON,
    detectedIndustry: parsedJSON.industry || industryInput || 'Software Engineering',
  };
}

export async function generateVibesWithGemini(
  industry: string,
  targetRole: string,
  referenceImageBase64?: string,
  customApiKey?: string
): Promise<VibeProposal[]> {
  const ai = getAIClient(customApiKey);

  let imagePromptPart = '';
  if (referenceImageBase64) {
    imagePromptPart = `The user provided a visual reference image (screenshot of a portfolio/design template they love). Parse its Visual DNA into proposal 1!`;
  }

  const prompt = `You are a World-Class Art Director & Pinterest/Dribbble Design Curator.
Create 3 DISTINCT, HIGH-END portfolio style proposals tailored for a candidate in "${industry}" aiming for "${targetRole}".
${imagePromptPart}

Return ONLY a JSON array containing exactly 3 objects:
[
  {
    "id": "vibe-1",
    "name": "Bento Box Tech",
    "tagline": "Modular, High-Density & Metrics-First",
    "description": "Inspired by modern Apple & Linear UI trends. Uses structured glassmorphic cards with vivid accent highlights.",
    "preset": "bento",
    "visualDnaExplanation": "Deep charcoal background (#0B0F19), cyan glow (#06B6D4), Inter font, rounded 16px cards.",
    "recommendedFor": "Software Engineers, Product Managers, & Tech Founders",
    "designToken": {
      "preset": "bento",
      "primary": "#06B6D4",
      "secondary": "#3B82F6",
      "background": "#0F172A",
      "surface": "#1E293B",
      "surfaceHover": "#334155",
      "text": "#F8FAFC",
      "textMuted": "#94A3B8",
      "accent": "#22D3EE",
      "border": "#334155",
      "fontTitle": "Inter, sans-serif",
      "fontBody": "Inter, sans-serif",
      "borderRadius": "16px",
      "gridCols": "repeat(12, minmax(0, 1fr))"
    }
  },
  {
    "id": "vibe-2",
    "name": "Editorial Signature",
    "tagline": "Elegant Serif, Wide Margins & High Contrast",
    "description": "High-fashion & design magazine aesthetic. Perfect for storytelling, leadership branding, and creative directors.",
    "preset": "editorial",
    "visualDnaExplanation": "Cream/pure white background (#FAF9F6), dark slate text (#0F172A), Playfair Display serif headings.",
    "recommendedFor": "Executives, UX Lead Designers, & Content Strategists",
    "designToken": {
      "preset": "editorial",
      "primary": "#0F172A",
      "secondary": "#475569",
      "background": "#FAF9F6",
      "surface": "#FFFFFF",
      "surfaceHover": "#F1F5F9",
      "text": "#0F172A",
      "textMuted": "#64748B",
      "accent": "#B45309",
      "border": "#E2E8F0",
      "fontTitle": "Playfair Display, serif",
      "fontBody": "Plus Jakarta Sans, sans-serif",
      "borderRadius": "4px",
      "gridCols": "1fr"
    }
  },
  {
    "id": "vibe-3",
    "name": "Dark Cyber Matrix",
    "tagline": "Deep OLED Black, Neon Gradient & Monospace Accents",
    "description": "Ultra-modern dark aesthetic with luminous gradient accents, monospace metadata, and terminal-inspired metrics.",
    "preset": "cyber",
    "visualDnaExplanation": "Pure black background (#030712), emerald green neon accent (#10B981), Fira Code font.",
    "recommendedFor": "AI Researchers, Security Experts, Full-Stack Devs",
    "designToken": {
      "preset": "cyber",
      "primary": "#10B981",
      "secondary": "#059669",
      "background": "#030712",
      "surface": "#111827",
      "surfaceHover": "#1F2937",
      "text": "#F9FAFB",
      "textMuted": "#9CA3AF",
      "accent": "#34D399",
      "border": "#1F2937",
      "fontTitle": "Outfit, sans-serif",
      "fontBody": "Inter, sans-serif",
      "borderRadius": "8px",
      "gridCols": "repeat(12, minmax(0, 1fr))"
    }
  }
]`;

  const contents: any[] = [prompt];
  if (referenceImageBase64) {
    const mimeMatch = referenceImageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');

    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  });

  const parsedVibes = cleanAndParseJSON(response.text || '');
  if (Array.isArray(parsedVibes) && parsedVibes.length > 0) {
    return parsedVibes;
  }
  throw new Error('Failed to generate valid style proposals');
}

export async function refinePortfolioWithGemini(
  currentData: PortfolioData,
  userInstruction: string,
  mode: AgentMode,
  customApiKey?: string
): Promise<{ updatedData: PortfolioData; replyMessage: string }> {
  const ai = getAIClient(customApiKey);

  const prompt = `You are an AI Portfolio Refinement Specialist operating in "${mode.toUpperCase()}" mode.
The user wants to update their portfolio data.

CURRENT PORTFOLIO DATA (JSON):
${JSON.stringify(currentData, null, 2)}

USER REQUEST / INSTRUCTION:
"${userInstruction}"

Output ONLY valid JSON matching this format:
{
  "replyMessage": "Tôi đã cập nhật nội dung theo yêu cầu của bạn!",
  "updatedData": { ... }
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });

  const result = cleanAndParseJSON(response.text || '');
  return {
    updatedData: result.updatedData || currentData,
    replyMessage: result.replyMessage || 'Tôi đã cập nhật nội dung theo yêu cầu của bạn.',
  };
}

function cleanAndParseJSON(rawText: string): any {
  try {
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('Failed to parse JSON:', rawText);
    throw new Error('Received invalid JSON format from AI model. Please try again.');
  }
}
