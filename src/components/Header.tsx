'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, Download, Upload, Settings, CheckCircle2, 
  Key, Bot, FileCode2, Layers, ShieldCheck 
} from 'lucide-react';
import { ProviderConfig, AgentMode } from '@/types/portfolio';

interface HeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  customConfig: ProviderConfig;
  agentMode: AgentMode;
  onUpdateConfig: (config: ProviderConfig, mode: AgentMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepClick,
  onExportJSON,
  onImportJSON,
  customConfig,
  agentMode,
  onUpdateConfig,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<ProviderConfig>(customConfig);
  const [tempMode, setTempMode] = useState<AgentMode>(agentMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { num: 1, label: 'Nạp Hồ sơ' },
    { num: 2, label: 'Xác nhận Dữ liệu' },
    { num: 3, label: 'Chọn Phong cách Vibe' },
    { num: 4, label: 'Tinh chỉnh AI' },
    { num: 5, label: 'Xuất PDF & JSON' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJSON(e.target.files[0]);
    }
  };

  const handleSaveSettings = () => {
    onUpdateConfig(tempConfig, tempMode);
    setIsSettingsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onStepClick(1)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              Porfilia AI
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Stateless & Privacy-First</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800/80 overflow-x-auto max-w-full">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <button
                key={step.num}
                onClick={() => onStepClick(step.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : isCompleted
                    ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-slate-950 text-cyan-400' : isCompleted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3 h-3 text-cyan-400" /> : step.num}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 rounded-lg transition-all"
            title="Cài đặt API Key & Agent Mode"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
            {customConfig.apiKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Load JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-lg shadow-md shadow-cyan-500/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save JSON</span>
          </button>
        </div>
      </div>

      {isSettingsOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Cài đặt Agent & API Key</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Provider:</span>
              </label>
              <select
                value={tempConfig.provider}
                onChange={(e) => setTempConfig({ ...tempConfig, provider: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="gemini">Google Gemini API (Default Server Key / Custom)</option>
                <option value="openai">OpenAI API (Custom Key)</option>
                <option value="anthropic">Anthropic Claude API (Custom Key)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Custom API Key (Tùy chọn):</span>
              </label>
              <input
                type="password"
                placeholder="Dán API Key cá nhân của bạn vào đây..."
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="text-[10px] text-slate-400">
                * Nếu để trống, hệ thống sẽ mặc định dùng Gemini API Key sẵn có của server web.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chế độ Hoạt động của AI Agent:</span>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setTempMode('guided')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tempMode === 'guided'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Guided Mode</span>
                  </div>
                  <div className="text-[10px] opacity-80">
                    Làm việc từng bước theo quy tắc chuẩn của website.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTempMode('freeform')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tempMode === 'freeform'
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1 mb-1">
                    <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Freeform Mode</span>
                  </div>
                  <div className="text-[10px] opacity-80">
                    Trò chuyện tự do, yêu cầu Agent tùy biến mọi cấu trúc.
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-xs font-bold bg-cyan-500 text-slate-950 rounded-lg shadow-md hover:bg-cyan-400"
              >
                Lưu Thay đổi
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
