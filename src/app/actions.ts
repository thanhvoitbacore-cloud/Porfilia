'use server';

import { parseDocumentWithGemini, generateVibesWithGemini, refinePortfolioWithGemini } from '@/lib/gemini';
import { PortfolioData, VibeProposal, AgentMode } from '@/types/portfolio';

export async function parseDocumentAction(
  rawText: string,
  industryInput?: string,
  customApiKey?: string
): Promise<{ data: PortfolioData; detectedIndustry: string }> {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    throw new Error('Vui lòng cung cấp văn bản hồ sơ hoặc nội dung file.');
  }
  return await parseDocumentWithGemini(rawText, industryInput, customApiKey);
}

export async function generateVibesAction(
  industry: string,
  targetRole: string,
  referenceImageBase64?: string,
  customApiKey?: string
): Promise<VibeProposal[]> {
  if (!industry) {
    throw new Error('Vui lòng cung cấp ngành nghề chuyên môn.');
  }
  return await generateVibesWithGemini(
    industry,
    targetRole || 'Professional',
    referenceImageBase64,
    customApiKey
  );
}

export async function refinePortfolioAction(
  currentData: PortfolioData,
  userInstruction: string,
  mode: AgentMode,
  customApiKey?: string
): Promise<{ updatedData: PortfolioData; replyMessage: string }> {
  if (!currentData || !userInstruction) {
    throw new Error('Thiếu dữ liệu portfolio hoặc câu lệnh tinh chỉnh.');
  }
  return await refinePortfolioWithGemini(
    currentData,
    userInstruction,
    mode || 'guided',
    customApiKey
  );
}
