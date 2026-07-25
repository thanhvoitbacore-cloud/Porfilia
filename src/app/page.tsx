'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StepDocumentIngestion } from '@/components/steps/StepDocumentIngestion';
import { StepVibeSelector } from '@/components/steps/StepVibeSelector';
import { StepInteractiveWorkspace } from '@/components/steps/StepInteractiveWorkspace';
import { StepExportHub } from '@/components/steps/StepExportHub';
import { PortfolioData, VibeProposal, DesignToken, ProviderConfig, AgentMode, PortfolioState } from '@/types/portfolio';

const initialPortfolioData: PortfolioData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
  },
  heroMetrics: [],
  experience: [],
  projects: [],
  skills: [],
  education: [],
  awards: [],
  industry: 'Software Engineering',
  targetRole: '',
};

const defaultDesignToken: DesignToken = {
  preset: 'bento',
  primary: '#06B6D4',
  secondary: '#3B82F6',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceHover: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  accent: '#22D3EE',
  border: '#334155',
  fontTitle: 'Inter, sans-serif',
  fontBody: 'Inter, sans-serif',
  borderRadius: '16px',
  gridCols: 'repeat(12, minmax(0, 1fr))',
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialPortfolioData);
  const [industry, setIndustry] = useState<string>('Software Engineering');
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);
  const [selectedVibe, setSelectedVibe] = useState<VibeProposal | null>(null);
  
  const [customConfig, setCustomConfig] = useState<ProviderConfig>({
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.5-flash',
  });
  
  const [agentMode, setAgentMode] = useState<AgentMode>('guided');

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('porfilia_provider_config');
      if (savedConfig) {
        setCustomConfig(JSON.parse(savedConfig));
      }
      const savedMode = localStorage.getItem('porfilia_agent_mode');
      if (savedMode) {
        setAgentMode(savedMode as AgentMode);
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, []);

  const handleUpdateConfig = (newConfig: ProviderConfig, newMode: AgentMode) => {
    setCustomConfig(newConfig);
    setAgentMode(newMode);
    try {
      localStorage.setItem('porfilia_provider_config', JSON.stringify(newConfig));
      localStorage.setItem('porfilia_agent_mode', newMode);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const handleDocumentParsed = (parsed: PortfolioData, detectedIndustry: string, refImage?: string) => {
    setPortfolioData(parsed);
    setIndustry(detectedIndustry);
    if (refImage) {
      setReferenceImage(refImage);
    }
  };

  const handleConfirmData = () => {
    setCurrentStep(3);
  };

  const handleVibeSelected = (vibe: VibeProposal) => {
    setSelectedVibe(vibe);
    setCurrentStep(4);
  };

  const handleExportJSON = () => {
    const stateToSave: PortfolioState = {
      version: 'v1.0.0',
      updatedAt: new Date().toLocaleString(),
      data: portfolioData,
      selectedVibe,
      designToken: selectedVibe ? selectedVibe.designToken : defaultDesignToken,
      agentMode,
      customConfig,
      currentStep,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stateToSave, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `porfilia_config_${portfolioData.personalInfo.fullName.replaceAll(' ', '_') || 'state'}_v1.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedState: PortfolioState = JSON.parse(e.target?.result as string);
        if (parsedState.data) setPortfolioData(parsedState.data);
        if (parsedState.selectedVibe) setSelectedVibe(parsedState.selectedVibe);
        if (parsedState.agentMode) setAgentMode(parsedState.agentMode);
        if (parsedState.customConfig) setCustomConfig(parsedState.customConfig);
        if (parsedState.currentStep) setCurrentStep(parsedState.currentStep);
        alert('✓ Đã nạp thành công file cấu hình trạng thái .json!');
      } catch (err) {
        alert('❌ File .json không đúng định dạng Porfilia.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      
      <Header
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        customConfig={customConfig}
        agentMode={agentMode}
        onUpdateConfig={handleUpdateConfig}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {currentStep <= 2 && (
          <StepDocumentIngestion
            onDocumentParsed={handleDocumentParsed}
            parsedData={portfolioData.personalInfo.fullName ? portfolioData : null}
            onConfirmData={handleConfirmData}
            customApiKey={customConfig.apiKey}
          />
        )}

        {currentStep === 3 && (
          <StepVibeSelector
            portfolioData={portfolioData}
            industry={industry}
            referenceImage={referenceImage}
            onVibeSelected={handleVibeSelected}
            customApiKey={customConfig.apiKey}
          />
        )}

        {currentStep === 4 && selectedVibe && (
          <StepInteractiveWorkspace
            portfolioData={portfolioData}
            selectedVibe={selectedVibe}
            agentMode={agentMode}
            onUpdateData={(newData) => setPortfolioData(newData)}
            onNextStep={() => setCurrentStep(5)}
            customApiKey={customConfig.apiKey}
          />
        )}

        {currentStep === 5 && selectedVibe && (
          <StepExportHub
            portfolioData={portfolioData}
            selectedVibe={selectedVibe}
            portfolioState={{
              version: 'v1.0.0',
              updatedAt: new Date().toLocaleString(),
              data: portfolioData,
              selectedVibe,
              designToken: selectedVibe.designToken,
              agentMode,
              customConfig,
              currentStep,
            }}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onBackToWorkspace={() => setCurrentStep(4)}
          />
        )}

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400 font-mono">
        Porfilia AI Agentic Portfolio Builder • Developed with Next.js, Tailwind CSS & Google Gemini API
      </footer>

    </div>
  );
}
