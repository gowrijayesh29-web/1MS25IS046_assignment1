import React, { useState } from 'react';
import { Paper, KeyAuthor } from '../types/research';
import { BookOpen, ExternalLink, Copy, Check, Users, Sparkles, Search, GraduationCap, Award, ArrowUpRight } from 'lucide-react';

interface StepPapersAuthorsProps {
  papers: Paper[];
  authors: KeyAuthor[];
  selectedSubQuestionId?: string | null;
  onClearSubQuestionFilter?: () => void;
  onDeepDive: (title: string, type: 'paper', details: string) => void;
}

export const StepPapersAuthors: React.FC<StepPapersAuthorsProps> = ({
  papers,
  authors,
  selectedSubQuestionId,
  onClearSubQuestionFilter,
  onDeepDive,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'papers' | 'authors'>('papers');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedBibId, setCopiedBibId] = useState<string | null>(null);

  const handleCopyBibtex = (paper: Paper) => {
    const bib = paper.bibtex || `@article{${paper.title.replace(/\s+/g, '_')},\n  title={${paper.title}},\n  author={${paper.authors.join(' and ')}},\n  year={${paper.year}},\n  journal={${paper.venue}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopiedBibId(paper.id);
    setTimeout(() => setCopiedBibId(null), 2000);
  };

  const filteredPapers = papers.filter(p => {
    if (selectedSubQuestionId && p.primarySubQuestionId && p.primarySubQuestionId !== selectedSubQuestionId) {
      return false;
    }
    if (filterType !== 'all' && p.paperType !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = p.title.toLowerCase().includes(q);
      const inAuthors = p.authors.some(a => a.toLowerCase().includes(q));
      const inVenue = p.venue.toLowerCase().includes(q);
      const inSummary = p.abstractSummary.toLowerCase().includes(q);
      return inTitle || inAuthors || inVenue || inSummary;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
            <span>Step 2 of 4: Literature & Author Landscape</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Key Papers & Seminal Authors</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Landmark papers, algorithmic breakthroughs, foundational surveys, and principal investigators pioneering the field.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('papers')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeSubTab === 'papers'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Landmark Papers ({papers.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('authors')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeSubTab === 'authors'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Seminal Authors ({authors.length})</span>
          </button>
        </div>
      </div>

      {/* Selected Sub-Question filter alert */}
      {selectedSubQuestionId && onClearSubQuestionFilter && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-800">
          <span>Filtering papers linked to Sub-Question {selectedSubQuestionId}</span>
          <button
            onClick={onClearSubQuestionFilter}
            className="font-semibold underline hover:text-blue-900"
          >
            Show All Papers
          </button>
        </div>
      )}

      {activeSubTab === 'papers' ? (
        <div className="space-y-4">
          {/* Paper Search & Type Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search paper titles, authors, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
              {['all', 'Seminal / Foundational', 'Breakthrough Algorithm', 'Comprehensive Survey'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Papers Cards Grid */}
          <div className="space-y-4">
            {filteredPapers.map((paper, idx) => (
              <div
                key={paper.id || idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
              >
                {/* Meta Row: Paper Type, Year, Venue, Citations */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {paper.paperType}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {paper.year}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {paper.venue}
                    </span>
                  </div>

                  {paper.citationsEstimate && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      ~{paper.citationsEstimate} citations
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {paper.title}
                </h3>

                {/* Authors */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{paper.authors.join(', ')}</span>
                </div>

                {/* Abstract Summary */}
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                  {paper.abstractSummary}
                </div>

                {/* Key Innovation Callout */}
                <div className="flex items-start space-x-2 text-xs bg-amber-50/70 text-amber-900 p-3 rounded-xl border border-amber-200/80">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Landmark Innovation: </span>
                    <span>{paper.keyInnovation}</span>
                  </div>
                </div>

                {/* Actions & Links Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* arXiv link */}
                    {paper.arxivId && (
                      <a
                        href={`https://arxiv.org/abs/${paper.arxivId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <span>arXiv:{paper.arxivId}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}

                    {/* DOI link */}
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <span>DOI</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {/* Google Scholar search */}
                    <a
                      href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <GraduationCap className="h-3 w-3 text-slate-500" />
                      <span>Google Scholar</span>
                    </a>

                    {/* Code link if available */}
                    {paper.codeUrl && (
                      <a
                        href={paper.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <span>Official Code</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCopyBibtex(paper)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
                    >
                      {copiedBibId === paper.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>BibTeX</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeepDive(paper.title, 'paper', paper.keyInnovation)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Deep Dive</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Seminal Authors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.map((author, aIdx) => (
            <div
              key={aIdx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {author.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{author.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{author.affiliation}</p>
                    </div>
                  </div>
                  <Award className="h-5 w-5 text-amber-500 shrink-0" />
                </div>

                <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-600 block mb-1">Landmark Contribution:</span>
                  <p className="text-slate-800 leading-relaxed">{author.landmarkContribution}</p>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Notable Works:
                  </span>
                  <ul className="space-y-1">
                    {author.notablePapers.map((paperTitle, pIdx) => (
                      <li key={pIdx} className="text-slate-700 flex items-start space-x-1.5 text-xs">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span className="line-clamp-1">{paperTitle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <a
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(author.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Google Scholar Profile</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
