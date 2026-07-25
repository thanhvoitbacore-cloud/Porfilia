'use client';

import React from 'react';
import { PortfolioData, DesignToken } from '@/types/portfolio';
import { 
  Mail, Phone, MapPin, Github, Linkedin, 
  ExternalLink, Award, Briefcase, GraduationCap, Code, 
  Sparkles, CheckCircle2, TrendingUp, Cpu
} from 'lucide-react';

interface PortfolioRendererProps {
  data: PortfolioData;
  designToken: DesignToken;
  isPrintMode?: boolean;
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  data,
  designToken,
  isPrintMode = false,
}) => {
  const { personalInfo, heroMetrics, experience, projects, skills, education, awards } = data;
  const isEditorial = designToken.preset === 'editorial';
  const isCyber = designToken.preset === 'cyber';

  return (
    <div
      id="portfolio-printable-area"
      className="w-full transition-all duration-300 shadow-2xl overflow-hidden print:shadow-none print:m-0 print:w-full"
      style={{
        backgroundColor: designToken.background,
        color: designToken.text,
        fontFamily: designToken.fontBody,
        minHeight: isPrintMode ? 'auto' : '100%',
        borderRadius: isPrintMode ? '0px' : designToken.borderRadius,
      }}
    >
      <header 
        className="relative p-8 md:p-12 border-b"
        style={{ 
          borderColor: designToken.border,
          backgroundColor: isEditorial ? 'transparent' : designToken.surface 
        }}
      >
        {isCyber && (
          <div 
            className="absolute top-0 right-0 p-4 font-mono text-xs opacity-40 uppercase tracking-widest pointer-events-none"
            style={{ color: designToken.accent }}
          >
            SYS//ONLINE // STATLESS-PORTFOLIO-V2
          </div>
        )}

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border"
                 style={{ 
                   borderColor: designToken.primary, 
                   color: designToken.primary,
                   backgroundColor: `${designToken.primary}15`
                 }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.targetRole || personalInfo.professionalTitle}</span>
            </div>

            <h1 
              className="text-3xl md:text-5xl font-extrabold tracking-tight"
              style={{ 
                fontFamily: designToken.fontTitle,
                color: designToken.text 
              }}
            >
              {personalInfo.fullName || 'Tên ứng viên'}
            </h1>

            <p 
              className="text-lg font-medium max-w-2xl"
              style={{ color: designToken.textMuted }}
            >
              {personalInfo.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2" style={{ color: designToken.textMuted }}>
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <Mail className="w-3.5 h-3.5" style={{ color: designToken.primary }} />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={{ color: designToken.primary }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: designToken.primary }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:opacity-80">
                  <Linkedin className="w-3.5 h-3.5" style={{ color: designToken.primary }} />
                  <span>LinkedIn</span>
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:opacity-80">
                  <Github className="w-3.5 h-3.5" style={{ color: designToken.primary }} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 md:p-12 max-w-5xl mx-auto space-y-10">

        {heroMetrics && heroMetrics.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider opacity-60" style={{ color: designToken.textMuted }}>
              Thành tựu & Chỉ số Nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {heroMetrics.map((metric, idx) => (
                <div
                  key={metric.id || idx}
                  className="p-5 border transition-all duration-200"
                  style={{
                    backgroundColor: designToken.surface,
                    borderColor: designToken.border,
                    borderRadius: designToken.borderRadius,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium" style={{ color: designToken.textMuted }}>
                      {metric.label}
                    </span>
                    <TrendingUp className="w-4 h-4 opacity-70" style={{ color: designToken.primary }} />
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold mt-2" style={{ color: designToken.accent }}>
                    {metric.value}
                  </div>
                  {metric.change && (
                    <div className="text-xs font-semibold mt-1" style={{ color: designToken.primary }}>
                      {metric.change}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {personalInfo.bio && (
          <section 
            className="p-6 border"
            style={{
              backgroundColor: designToken.surface,
              borderColor: designToken.border,
              borderRadius: designToken.borderRadius,
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: designToken.primary }}>
              Tóm tắt Năng lực Chuyên môn
            </h3>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: designToken.text }}>
              {personalInfo.bio}
            </p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: designToken.border }}>
              <Briefcase className="w-5 h-5" style={{ color: designToken.primary }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: designToken.fontTitle }}>
                Kinh nghiệm Làm việc
              </h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className="p-6 border relative group"
                  style={{
                    backgroundColor: designToken.surface,
                    borderColor: designToken.border,
                    borderRadius: designToken.borderRadius,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: designToken.text }}>
                        {exp.role}
                      </h3>
                      <div className="text-sm font-semibold" style={{ color: designToken.primary }}>
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </div>
                    </div>
                    <span 
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full border self-start md:self-auto"
                      style={{ 
                        borderColor: designToken.border, 
                        color: designToken.textMuted,
                        backgroundColor: designToken.background
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-sm mb-4 leading-relaxed opacity-90" style={{ color: designToken.text }}>
                    {exp.description}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs md:text-sm">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: designToken.primary }} />
                          <span style={{ color: designToken.text }}>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 text-xs font-mono rounded"
                          style={{
                            backgroundColor: `${designToken.primary}15`,
                            color: designToken.primary,
                            border: `1px solid ${designToken.primary}30`
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: designToken.border }}>
              <Cpu className="w-5 h-5" style={{ color: designToken.primary }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: designToken.fontTitle }}>
                Dự án Tiêu biểu
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-5 border flex flex-col justify-between"
                  style={{
                    backgroundColor: designToken.surface,
                    borderColor: designToken.border,
                    borderRadius: designToken.borderRadius,
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold" style={{ color: designToken.text }}>
                        {proj.title}
                      </h3>
                      {proj.featured && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded" style={{ backgroundColor: designToken.accent, color: '#fff' }}>
                          Nổi bật
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: designToken.textMuted }}>
                      {proj.description}
                    </p>

                    {proj.impactMetric && (
                      <div className="text-xs font-semibold p-2 rounded" style={{ backgroundColor: `${designToken.primary}10`, color: designToken.primary }}>
                        Tác động: {proj.impactMetric}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: designToken.border }}>
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: designToken.border, color: designToken.textMuted }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold inline-flex items-center gap-1 hover:underline" style={{ color: designToken.primary }}>
                        <span>Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: designToken.border }}>
              <Code className="w-5 h-5" style={{ color: designToken.primary }} />
              <h2 className="text-xl font-bold" style={{ fontFamily: designToken.fontTitle }}>
                Kỹ năng & Năng lực Chuyên môn
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="p-4 border"
                  style={{
                    backgroundColor: designToken.surface,
                    borderColor: designToken.border,
                    borderRadius: designToken.borderRadius,
                  }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: designToken.primary }}>
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs rounded font-medium"
                        style={{
                          backgroundColor: designToken.background,
                          color: designToken.text,
                          border: `1px solid ${designToken.border}`,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education && education.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: designToken.border }}>
                <GraduationCap className="w-4 h-4" style={{ color: designToken.primary }} />
                <h3 className="text-base font-bold" style={{ fontFamily: designToken.fontTitle }}>
                  Học vấn & Bằng cấp
                </h3>
              </div>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="p-4 border" style={{ backgroundColor: designToken.surface, borderColor: designToken.border, borderRadius: designToken.borderRadius }}>
                    <div className="text-sm font-bold" style={{ color: designToken.text }}>{edu.degree}</div>
                    <div className="text-xs font-medium" style={{ color: designToken.primary }}>{edu.institution} • {edu.period}</div>
                    {edu.details && <div className="text-xs mt-1" style={{ color: designToken.textMuted }}>{edu.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {awards && awards.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: designToken.border }}>
                <Award className="w-4 h-4" style={{ color: designToken.primary }} />
                <h3 className="text-base font-bold" style={{ fontFamily: designToken.fontTitle }}>
                  Giải thưởng & Chứng nhận
                </h3>
              </div>
              <div className="space-y-3">
                {awards.map((awd, idx) => (
                  <div key={awd.id || idx} className="p-4 border" style={{ backgroundColor: designToken.surface, borderColor: designToken.border, borderRadius: designToken.borderRadius }}>
                    <div className="text-sm font-bold" style={{ color: designToken.text }}>{awd.title}</div>
                    <div className="text-xs font-medium" style={{ color: designToken.primary }}>{awd.issuer} • {awd.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </main>

      <footer className="p-6 border-t text-center text-xs opacity-50" style={{ borderColor: designToken.border, color: designToken.textMuted }}>
        Generated via Agentic AI Portfolio Builder • Privacy-First & Stateless Architecture
      </footer>
    </div>
  );
};
