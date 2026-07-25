'use server';

import { parseDocumentWithGemini, generateVibesWithGemini, refinePortfolioWithGemini } from '@/lib/gemini';
import { PortfolioData, VibeProposal, AgentMode } from '@/types/portfolio';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function parseDocumentAction(
  rawText: string,
  industryInput?: string,
  customApiKey?: string
): Promise<ActionResult<{ data: PortfolioData; detectedIndustry: string }>> {
  try {
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return { success: false, error: 'Vui lòng cung cấp văn bản hồ sơ hoặc nạp file.' };
    }
    const result = await parseDocumentWithGemini(rawText, industryInput, customApiKey);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in parseDocumentAction:', error);
    return { 
      success: false, 
      error: error.message || 'Không thể kết nối AI Server. Vui lòng dán API Key của bạn vào phần Settings.' 
    };
  }
}

export async function generateVibesAction(
  industry: string,
  targetRole: string,
  referenceImageBase64?: string,
  customApiKey?: string
): Promise<ActionResult<VibeProposal[]>> {
  try {
    if (!industry) {
      return { success: false, error: 'Vui lòng chọn ngành nghề chuyên môn.' };
    }
    const result = await generateVibesWithGemini(
      industry,
      targetRole || 'Professional',
      referenceImageBase64,
      customApiKey
    );
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in generateVibesAction:', error);
    return { 
      success: false, 
      error: error.message || 'Không thể tạo đề xuất Vibe.' 
    };
  }
}

export async function refinePortfolioAction(
  currentData: PortfolioData,
  userInstruction: string,
  mode: AgentMode,
  customApiKey?: string
): Promise<ActionResult<{ updatedData: PortfolioData; replyMessage: string }>> {
  try {
    if (!currentData || !userInstruction) {
      return { success: false, error: 'Thiếu dữ liệu portfolio hoặc câu lệnh tinh chỉnh.' };
    }
    const result = await refinePortfolioWithGemini(
      currentData,
      userInstruction,
      mode || 'guided',
      customApiKey
    );
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in refinePortfolioAction:', error);
    return { 
      success: false, 
      error: error.message || 'Không thể tinh chỉnh portfolio với AI.' 
    };
  }
}
