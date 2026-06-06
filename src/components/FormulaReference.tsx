import React, { useState, useMemo } from "react";
import { Search, Star, Play, ChevronRight, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { Formula } from "../types";
import { formulasData } from "../formulasData";
import { MathTextRenderer } from "./MathTextRenderer";

interface FormulaReferenceProps {
  onSelectFormula: (formula: Formula) => void;
  t: (key: string) => string;
  className?: string;
}

export function FormulaReference({ onSelectFormula, t, className = "" }: FormulaReferenceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<Formula["category"] | "All" | "Bookmarked">("Mathematics");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("math_solver_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const categories: Array<Formula["category"] | "All" | "Bookmarked"> = [
    "Mathematics",
    "Algebra",
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Bookmarked"
  ];

  const categoryTranslations: Record<string, string> = {
    "Mathematics": t("catMathematics"),
    "Algebra": t("catAlgebra"),
    "Higher Mathematics": t("catHigherMath"),
    "Physics": t("catPhysics"),
    "Chemistry": t("catChemistry"),
    "Bookmarked": t("catSaved")
  };

  const handleToggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((bid) => bid !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem("math_solver_bookmarks", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save bookmark state locally:", err);
    }
  };

  // Filter formulas inside useMemo for extreme efficiency
  const filteredFormulas = useMemo(() => {
    return formulasData.filter((item) => {
      // Category filter
      if (activeCategory === "Bookmarked") {
        if (!bookmarkedIds.includes(item.id)) return false;
      } else if (activeCategory !== "All") {
        if (item.category !== activeCategory) return false;
      }

      // Search term filter
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const formulaMatch = item.formula.toLowerCase().includes(query);
        return titleMatch || descMatch || formulaMatch;
      }

      return true;
    });
  }, [searchTerm, activeCategory, bookmarkedIds]);

  return (
    <div className={`flex flex-col h-full bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {/* Search and Header Section */}
      <div className="p-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="p-1 rounded bg-teal-500/10 text-teal-400">
            <BookOpen size={14} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-slate-100 text-xs xl:text-sm flex items-center gap-1">
              {t("formulaRefMenu")}
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono font-normal">
                {formulasData.length}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 leading-tight">{t("searchFormulasDesc")}</p>
          </div>
        </div>

        {/* Search input wrapped cleanly with icon */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2 text-slate-500" size={12} />
          <input
            type="text"
            placeholder={t("formulaSearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-200 placeholder-slate-650 focus:outline-none focus:border-teal-500 transition-colors"
            id="formula-search-input"
          />
        </div>
      </div>

      {/* Categories Toggle Rail (Shrunk button size as requested) */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/30 border-b border-slate-800/50 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const isSpecial = cat === "Bookmarked";
          const displayLabel = categoryTranslations[cat] || cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded-md text-[9px] xl:text-[10px] font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                isSelected
                  ? isSpecial
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold"
                    : "bg-teal-550/20 text-teal-400 border border-teal-500/30 font-semibold"
                  : "bg-transparent text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              {isSpecial ? (
                <span className="flex items-center gap-1">
                  <Star size={8} className={bookmarkedIds.length > 0 ? "fill-amber-400 text-amber-400" : ""} />
                  {displayLabel} ({bookmarkedIds.length})
                </span>
              ) : (
                displayLabel
              )}
            </button>
          );
        })}
      </div>

      {/* Main List Container (Compacted card heights and LaTeX fonts) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-slate-950/10">
        {filteredFormulas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <AlertCircle className="text-slate-700 mb-1.5" size={18} />
            <p className="text-[11px] text-slate-400 font-semibold">{t("noFormulasFound")}</p>
            <p className="text-[9px] text-slate-550 mt-0.5 max-w-[150px] leading-relaxed">
              {t("noFormulasSub")}
            </p>
          </div>
        ) : (
          filteredFormulas.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectFormula(item)}
              className="group relative flex flex-col bg-slate-950/45 border border-slate-900 hover:border-teal-500/30 hover:bg-slate-900/60 p-2 rounded-lg transition-all duration-150 cursor-pointer overflow-hidden shadow-sm space-y-1"
            >
              {/* Formula Card details */}
              <h3 className="font-sans font-medium text-slate-200 group-hover:text-teal-400 transition-colors leading-tight text-[11px]">
                {item.title}
              </h3>

              {/* Shrunk and compressed inner dark LaTeX container */}
              <div className="bg-slate-950/80 py-0.5 px-1 rounded border border-slate-900/50 overflow-x-auto flex items-center justify-center max-h-8 [&_.katex]:!text-[9px] [&_.katex-display]:my-0 select-all">
                <MathTextRenderer 
                  text={item.formula} 
                  className="text-teal-400 font-sans tracking-tight !text-[9px] select-all" 
                />
              </div>

              {/* Compress text layout */}
              <p className="text-slate-400 text-[8.5px] line-clamp-1 leading-relaxed select-none">
                {item.description}
              </p>

              <div className="flex items-center justify-end border-t border-slate-900/40 pt-0.5 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-150 select-none">
                <span className="text-teal-400 font-semibold flex items-center gap-0.5 text-[8px]">
                  <Sparkles size={8} className="animate-pulse" />
                  {t("loadToSolve")}
                  <ChevronRight size={10} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
