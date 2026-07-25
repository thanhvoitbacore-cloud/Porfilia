'use client';

import React, { useState } from 'react';
import { 
  Send, Sparkles, Monitor, Tablet, Smartphone, 
  Bot, User, Edit3, ArrowRight, RefreshCw 
} from 'lucide-react';
import { PortfolioData, VibeProposal, AgentMode, ChatMessage } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';

interface StepInteractiveWorkspaceProps {
  portfolioData: PortfolioData;
  selectedVibe: VibeProposal;
  agentMode: AgentMode;
  onUpdateData: (newData: PortfolioData) => void;
  onNextStep: () => void;
  customApiKey?: string;
}

export const StepInteractiveWorkspace: React.FC<StepInteractiveWorkspaceProps> = ({
  portfolioData,
  selectedVibe,
  agentMode,
  onUpdateData,
  onNextStep,
  customApiKey,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [chatInput, setChatInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'edit'>('chat');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: `Xin chào ${portfolioData.personalInfo.fullName}! Tôi là AI Refinement Specialist. Bạn muốn tinh chỉnh yếu tố nào trên portfolio của mình?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: agentMode,
    },
  ]);

  const guidedQuickPrompts = [
    'Làm đoạn tóm tắt chuyên môn sắc bén và ấn tượng hơn',
    'Thêm kỹ năng Next.js, AI Agent và TypeScript vào danh sách',
    'Đẩy dự án có chỉ số tác động cao nhất lên đầu tiên',
    'Tối ưu hóa các dòng kinh nghiệm làm việc theo chuẩn STAR',
  ];

  const handleSendChat = async (promptText?: string) => {
    const textToSend = promptText || chatInput;
    if (!textToSend || textToSend.trim() === '' || isRefining) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: agentMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsRefining(true);

    try {
      const { refinePortfolioAction } = await import('@/app/actions');
      const result = await refinePortfolioAction(
        portfolioData,
        textToSend,
        agentMode,
        customApiKey
      );

      if (result.data) {
        onUpdateData(result.data.updatedData);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data?.replyMessage || result.error || 'Tôi đã cập nhật nội dung theo yêu cầu của bạn.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: agentMode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ ${err.message || 'Xảy ra lỗi kết nối AI.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: agentMode,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="max-w-[1650px] mx-auto space-y-4 animate-fadeIn">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Không gian Tinh chỉnh Trực quan</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                {selectedVibe.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đang ở chế độ <span className="text-cyan-300 font-semibold">{agentMode === 'guided' ? 'Guided (Chuẩn)' : 'Freeform Chat (Tự do)'}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                device === 'desktop' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                device === 'tablet' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                device === 'mobile' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={onNextStep}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <span>Tiến sang Bước Xuất File PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col h-[750px]">
          
          <div className="flex border-b border-slate-800 pb-3 gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Trợ lý AI Chat Refinement</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'edit'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa Form Trực tiếp</span>
            </button>
          </div>

          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden space-y-4">
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                      <div>{m.content}</div>
                      <div className="text-[9px] opacity-40 mt-1 text-right">{m.timestamp}</div>
                    </div>
                  </div>
                ))}
                {isRefining && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang cập nhật portfolio...</span>
                  </div>
                )}
              </div>

              {agentMode === 'guided' && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gợi ý lệnh nhanh:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {guidedQuickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChat(p)}
                        className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 px-2.5 py-1 rounded-lg transition-all text-left"
                      >
                        ⚡ {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder={
                    agentMode === 'guided'
                      ? 'Nhập yêu cầu tinh chỉnh (ví dụ: "Sửa bio thành...")...'
                      : 'Trò chuyện tự do với Agent để yêu cầu thiết kế tùy biến...'
                  }
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={isRefining || !chatInput.trim()}
                  className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-300">Họ và Tên:</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.fullName}
                  onChange={(e) => onUpdateData({
                    ...portfolioData,
                    personalInfo: { ...portfolioData.personalInfo, fullName: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300">Chức danh Chuyên môn:</label>
                <input
                  type="text"
                  value={portfolioData.personalInfo.professionalTitle}
                  onChange={(e) => onUpdateData({
                    ...portfolioData,
                    personalInfo: { ...portfolioData.personalInfo, professionalTitle: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300">Tóm tắt Năng lực (Bio):</label>
                <textarea
                  rows={4}
                  value={portfolioData.personalInfo.bio}
                  onChange={(e) => onUpdateData({
                    ...portfolioData,
                    personalInfo: { ...portfolioData.personalInfo, bio: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 resize-none"
                />
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-300">
                💡 Bạn có thể sửa trực tiếp bất kỳ ô văn bản nào hoặc dùng tab AI Chat để yêu cầu AI tự động tối ưu hóa!
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-start min-h-[750px] overflow-hidden">
          <div className={`transition-all duration-300 ${
            device === 'desktop' ? 'w-full max-w-4xl' : device === 'tablet' ? 'w-[680px]' : 'w-[375px]'
          }`}>
            <PortfolioRenderer
              data={portfolioData}
              designToken={selectedVibe.designToken}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
