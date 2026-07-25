'use client';

import React, { useState } from 'react';
import { 
  FileText, Upload, Sparkles, Image as ImageIcon, 
  ArrowRight, CheckCircle2, AlertCircle, Loader2, FileUp
} from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface StepDocumentIngestionProps {
  onDocumentParsed: (data: PortfolioData, industry: string, referenceImage?: string) => void;
  parsedData: PortfolioData | null;
  onConfirmData: () => void;
  customApiKey?: string;
}

export const StepDocumentIngestion: React.FC<StepDocumentIngestionProps> = ({
  onDocumentParsed,
  parsedData,
  onConfirmData,
  customApiKey,
}) => {
  const [rawText, setRawText] = useState('');
  const [industry, setIndustry] = useState('Software Engineering');
  const [targetRole, setTargetRole] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const sampleCVText = `Nguyen Van A - Senior Full Stack & AI Engineer
Email: nguyenvana@example.com | Phone: 0987654321 | Location: Ho Chi Minh City, Vietnam
LinkedIn: linkedin.com/in/nguyenvana | GitHub: github.com/nguyenvana

TÓM TẮT CHUYÊN MÔN:
Kỹ sư phần mềm với 6+ năm kinh nghiệm phát triển các ứng dụng quy mô lớn. Chuyên sâu về React, Next.js, Node.js và tích hợp các mô hình AI LLM (Gemini, OpenAI). Đã từng tối ưu hóa hiệu năng hệ thống giúp tăng 40% tốc độ tải trang cho 2 triệu người dùng hàng tháng.

THÀNH TỰU NỔI BẬT:
- Xây dựng lại kiến trúc microservices giúp tiết kiệm $150k chi phí hạ tầng cloud hàng năm.
- Dẫn dắt đội ngũ 8 lập trình viên shipped 12+ dự án sản phẩm thành công.
- Tối ưu hóa Database Query giảm latency từ 450ms xuống 35ms.

KINH NGHIỆM LÀM VIỆC:
Tech Lead - TechCorp Global (2022 - Hiện tại)
- Thiết kế hệ thống web app cho hơn 500,000 người dùng hoạt động hàng ngày.
- Quản lý quy trình CI/CD, tự động hóa deployment với Docker & Kubernetes.
- Tích hợp AI chatbot hỗ trợ CSKH tự động giải quyết 65% ticket hỗ trợ.

Senior Developer - InnovateLab (2019 - 2022)
- Phát triển giao diện Dashboard phân tích dữ liệu thời gian thực sử dụng Next.js, TypeScript và Tailwind CSS.

KỸ NĂNG:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux
- Backend: Node.js, Express, Python, PostgreSQL, Redis, GraphQL
- AI & DevOps: Gemini API, OpenAI API, Docker, AWS, Vercel

HỌC VẤN:
Cử nhân Khoa học Máy tính - Đại học Bách Khoa (2015 - 2019) - Tốt nghiệp loại Giỏi`;

  const processFile = async (file: File) => {
    setUploadedFileName(file.name);
    setErrorMsg(null);

    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setRawText(text);
      } else {
        // Fallback for docx/pdf or other files: read as text or text extract
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setRawText(content || `File: ${file.name}\nNội dung hồ sơ cá nhân và dự án...`);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setErrorMsg('Không thể đọc file. Vui lòng dán văn bản trực tiếp.');
    }
  };

  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!rawText || rawText.trim().length === 0) {
      setErrorMsg('Vui lòng nhập, dán hoặc kéo thả file hồ sơ/CV của bạn vào đây.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);

    try {
      const { parseDocumentAction } = await import('@/app/actions');
      const result = await parseDocumentAction(rawText, industry, customApiKey);

      if (targetRole && result.data) {
        result.data.targetRole = targetRole;
      }

      onDocumentParsed(result.data, result.detectedIndustry || industry, referenceImage);
    } catch (err: any) {
      setErrorMsg(err.message || 'Xảy ra lỗi kết nối AI Agent.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bước 1: Trích xuất Dữ liệu Thông minh</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Nạp Hồ sơ & Phân tích Ngành nghề
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Kéo thả file CV/Hồ sơ (PDF, Word, TXT, MD) hoặc dán trực tiếp đoạn văn bản. AI Recruiter sẽ tự động bóc tách thông tin chuyên môn của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Drag & Drop File Zone + Text Area */}
        <div className="md:col-span-2 space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Nội dung CV / Hồ sơ cá nhân:</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 bg-cyan-950/60 border border-cyan-900/60 px-2.5 py-1 rounded-lg transition-all">
                <FileUp className="w-3.5 h-3.5" />
                <span>Kéo thả / Tải file</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleDocumentFileSelect}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  setRawText(sampleCVText);
                  setUploadedFileName('CV_Sample.txt');
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-white underline"
              >
                + CV Mẫu
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl transition-all duration-200 ${
              isDraggingFile
                ? 'border-2 border-dashed border-cyan-400 bg-cyan-950/40 ring-4 ring-cyan-500/20'
                : 'border border-slate-800 bg-slate-950'
            }`}
          >
            {isDraggingFile && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 rounded-xl flex flex-col items-center justify-center p-6 text-center text-cyan-400 space-y-2 border-2 border-dashed border-cyan-400">
                <Upload className="w-10 h-10 animate-bounce text-cyan-400" />
                <div className="font-extrabold text-sm">Thả file CV / Hồ sơ vào đây ngay</div>
                <div className="text-xs text-slate-400">Hỗ trợ các định dạng .pdf, .docx, .txt, .md</div>
              </div>
            )}

            {uploadedFileName && (
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-cyan-300">
                <span className="font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>File đã nạp: <strong>{uploadedFileName}</strong></span>
                </span>
                <button onClick={() => setUploadedFileName(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}

            <textarea
              rows={11}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Kéo & thả file CV/dự án vào đây, hoặc dán trực tiếp đoạn văn bản..."
              className="w-full bg-transparent p-4 text-xs md:text-sm text-slate-200 focus:outline-none font-mono leading-relaxed resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isScanning}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>AI Recruiter đang quét & trích xuất...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Phân tích Hồ sơ với AI Agent</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Thiết lập Định hướng
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Lĩnh vực / Ngành nghề:</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Software Engineering">Công nghệ Thông tin / Lập trình</option>
                <option value="UX/UI Design & Product">UX/UI Design & Product Manager</option>
                <option value="Finance & Banking">Tài chính & Ngân hàng</option>
                <option value="Marketing & Brand Strategy">Marketing & Truyền thông</option>
                <option value="Legal & Advisory">Luật & Tư vấn Doanh nghiệp</option>
                <option value="Healthcare & Medicine">Y tế & Dược phẩm</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Vị trí Mục tiêu (Tùy chọn):</label>
              <input
                type="text"
                placeholder="Ví dụ: Senior AI Architect, VP of Product..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Ảnh Mẫu Truyền Cảm Hứng (Pinterest/Dribbble)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Tải lên ảnh màn hình thiết kế bạn yêu thích. AI Art Director sẽ bóc tách màu sắc & bố cục của ảnh vào đề xuất Vibe!
            </p>

            <label className="block w-full border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer bg-slate-950/50 transition-all">
              {referenceImage ? (
                <div className="space-y-2">
                  <img src={referenceImage} alt="Ref preview" className="max-h-24 mx-auto rounded-lg object-cover" />
                  <span className="text-[10px] text-emerald-400 font-semibold block">✓ Đã nạp ảnh truyền cảm hứng</span>
                </div>
              ) : (
                <div className="space-y-1 py-2">
                  <Upload className="w-5 h-5 mx-auto text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium block">Tải ảnh mẫu (.png, .jpg)</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

        </div>
      </div>

      {parsedData && (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Xác nhận Dữ liệu Trích xuất
                </h3>
                <p className="text-xs text-slate-400">
                  Vui lòng rà soát lại thông tin trước khi chuyển sang bước chọn Art Director Vibe.
                </p>
              </div>
            </div>
            <button
              onClick={onConfirmData}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <span>Xác nhận & Sang Bước 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">Thông tin Cá nhân</span>
              <div className="font-bold text-sm text-white">{parsedData.personalInfo.fullName}</div>
              <div className="text-slate-300">{parsedData.personalInfo.professionalTitle}</div>
              <div className="text-slate-400">{parsedData.personalInfo.bio}</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">Chỉ số Nổi bật (Metrics)</span>
              <div className="space-y-1">
                {parsedData.heroMetrics?.map((m, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{m.label}</span>
                    <span className="font-bold text-cyan-300">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
