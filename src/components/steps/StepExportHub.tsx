'use client';

import React, { useState } from 'react';
import { 
  FileDown, Download, Upload, Printer, FileJson, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { PortfolioData, VibeProposal, PortfolioState } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';

interface StepExportHubProps {
  portfolioData: PortfolioData;
  selectedVibe: VibeProposal;
  portfolioState: PortfolioState;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onBackToWorkspace: () => void;
}

export const StepExportHub: React.FC<StepExportHubProps> = ({
  portfolioData,
  selectedVibe,
  portfolioState,
  onExportJSON,
  onImportJSON,
  onBackToWorkspace,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('portfolio-printable-area');
      if (!element) {
        throw new Error('Element portfolio print không tìm thấy.');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: selectedVibe.designToken.background,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const filename = `${portfolioData.personalInfo.fullName.replaceAll(' ', '_')}_Portfolio_${selectedVibe.preset.toUpperCase()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('Lỗi khi xuất PDF client-side:', err);
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJSON(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <FileDown className="w-3.5 h-3.5" />
          <span>Bước 5: Xuất File & Quản lý Phiên bản Local</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Xuất Portfolio & Lưu Trạng thái
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Hoàn thành portfolio cá nhân của bạn! Xuất bản file PDF chất lượng cao hoặc lưu cấu hình <span className="text-cyan-300 font-semibold font-mono">.json</span> để cập nhật trong tương lai mà không cần tài khoản máy chủ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Printer className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">1. Xuất bản File PDF chuẩn In ấn</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tạo bản in PDF có độ phân giải cao, tối ưu hóa ngắt trang không bị cắt chữ hay hỏng bố cục giao diện.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div>Định dạng: <span className="text-cyan-300 font-bold">PDF Vector High-Res (A4)</span></div>
              <div>Phong cách: <span className="text-white font-bold">{selectedVibe.name}</span></div>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isExportingPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang khởi tạo PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>Tải File PDF Ngay</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileJson className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">2. Quản lý Phiên bản Local (.json)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lưu toàn bộ dữ liệu & token thiết kế vào file cấu hình cá nhân. Khi cần cập nhật sau này, bạn chỉ cần nạp lại file <span className="text-emerald-400 font-semibold font-mono">.json</span> này!
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div>Phiên bản: <span className="text-emerald-400 font-bold">{portfolioState.version}</span></div>
              <div>Cập nhật lúc: <span className="text-white">{portfolioState.updatedAt}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onExportJSON}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Tải file .JSON</span>
            </button>

            <label className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer text-center">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Nạp file .JSON</span>
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToWorkspace}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Workspace Tinh chỉnh</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">XEM TRƯỚC FINAL PORTFOLIO PREVIEW:</span>
        </div>

        <div className="bg-slate-950 p-6 border border-slate-800 rounded-2xl shadow-2xl">
          <PortfolioRenderer
            data={portfolioData}
            designToken={selectedVibe.designToken}
            isPrintMode={true}
          />
        </div>
      </div>

    </div>
  );
};
