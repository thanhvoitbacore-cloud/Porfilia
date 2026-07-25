'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Palette, Check, ArrowRight, Loader2
} from 'lucide-react';
import { VibeProposal, PortfolioData } from '@/types/portfolio';

interface StepVibeSelectorProps {
  portfolioData: PortfolioData;
  industry: string;
  referenceImage?: string;
  onVibeSelected: (vibe: VibeProposal) => void;
  customApiKey?: string;
}

export const StepVibeSelector: React.FC<StepVibeSelectorProps> = ({
  portfolioData,
  industry,
  referenceImage,
  onVibeSelected,
  customApiKey,
}) => {
  const [vibes, setVibes] = useState<VibeProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVibeId, setSelectedVibeId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchVibes();
  }, [industry]);

  const fetchVibes = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { generateVibesAction } = await import('@/app/actions');
      const vibesData = await generateVibesAction(
        industry,
        portfolioData.targetRole || portfolioData.personalInfo.professionalTitle,
        referenceImage,
        customApiKey
      );

      setVibes(vibesData);
      if (vibesData && vibesData.length > 0) {
        setSelectedVibeId(vibesData[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Xảy ra lỗi khi kết nối AI Art Director.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmVibe = () => {
    const chosen = vibes.find((v) => v.id === selectedVibeId);
    if (chosen) {
      onVibeSelected(chosen);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white">AI Art Director đang làm việc...</h2>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Truy vấn xu hướng thiết kế Pinterest & Dribbble tốt nhất cho ngành <span className="text-cyan-400 font-semibold">{industry}</span>...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="text-red-400 font-bold text-lg">Không thể tải đề xuất Vibe</div>
        <p className="text-xs text-slate-400">{errorMsg}</p>
        <button
          onClick={fetchVibes}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>Bước 2: AI Art Director (Pinterest Inspired)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Chọn Phong cách Thiết kế (Vibe)
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          AI Art Director đã thiết lập 3 phong cách thiết kế độc bản phù hợp nhất với vị trí <span className="text-white font-semibold">{portfolioData.personalInfo.professionalTitle}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vibes.map((vibe) => {
          const isSelected = selectedVibeId === vibe.id;
          const token = vibe.designToken;

          return (
            <div
              key={vibe.id}
              onClick={() => setSelectedVibeId(vibe.id)}
              className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-6 ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    {vibe.preset}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{vibe.name}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {vibe.description}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400">Color DNA & Swatches:</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: token.background }} title="Background" />
                  <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: token.surface }} title="Surface" />
                  <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: token.primary }} title="Primary Accent" />
                  <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: token.accent }} title="Secondary Highlight" />
                </div>

                <div className="text-[10px] text-slate-400 font-mono space-y-1 pt-1">
                  <div>Fonts: <span className="text-slate-200">{token.fontTitle}</span></div>
                  <div>Layout: <span className="text-slate-200">{vibe.visualDnaExplanation}</span></div>
                </div>
              </div>

              <div className="text-[11px] text-cyan-400/90 font-medium bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-900/40">
                💡 Phù hợp nhất: {vibe.recommendedFor}
              </div>

            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleConfirmVibe}
          disabled={!selectedVibeId}
          className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <span>Xác nhận Phong cách & Khai phá Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
