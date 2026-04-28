"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Film, Image, Package, Loader2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  text: string;
  type: "content" | "photo" | "pack";
}

interface SearchResult {
  _id: string;
  title: string;
  description?: string;
  resultType: "content" | "photo" | "pack";
  type?: string;
  governorate?: string;
  region?: string;
  previewUrl?: string;
}

interface SearchBarProps {
  isHeroPage?: boolean;
  isScrolled?: boolean;
  isDashboard?: boolean;
  isMobile?: boolean;
}

export function SearchBar({ isHeroPage, isScrolled, isDashboard, isMobile }: SearchBarProps) {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const [suggestRes, searchRes] = await Promise.all([
        api.get(`/search/suggest?q=${encodeURIComponent(q)}`),
        api.get(`/search?q=${encodeURIComponent(q)}&limit=6`),
      ]);

      if (suggestRes.data?.status === "success") {
        setSuggestions(suggestRes.data.data.suggestions || []);
      }

      if (searchRes.data?.status === "success") {
        const data = searchRes.data.data;
        const combined: SearchResult[] = [
          ...(data.contents || []).map((c: any) => ({ ...c, resultType: "content" as const })),
          ...(data.photos || []).map((p: any) => ({ ...p, resultType: "photo" as const })),
          ...(data.packs || []).map((p: any) => ({ ...p, resultType: "pack" as const })),
        ].slice(0, 6);
        setResults(combined);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => performSearch(query), 300);
    } else {
      setSuggestions([]);
      setResults([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigateToResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    if (result.resultType === "content") {
      router.push(`/impact`);
    } else if (result.resultType === "photo") {
      const gov = result.governorate;
      router.push(gov ? `/tounesna?gov=${encodeURIComponent(gov)}` : "/tounesna");
    } else if (result.resultType === "pack") {
      router.push("/packs");
    }
  };

  const navigateToSuggestion = (suggestion: Suggestion) => {
    setIsOpen(false);
    setQuery("");
    if (suggestion.type === "content") {
      router.push(`/impact`);
    } else if (suggestion.type === "photo") {
      router.push(`/tounesna?search=${encodeURIComponent(suggestion.text)}`);
    } else {
      router.push(`/packs`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    // Navigate to the most relevant page with search query
    router.push(`/tounesna?search=${encodeURIComponent(query)}`);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      if (selectedIndex < suggestions.length) {
        navigateToSuggestion(suggestions[selectedIndex]);
      } else {
        navigateToResult(results[selectedIndex - suggestions.length]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "content": return <Film className="w-3.5 h-3.5" />;
      case "photo": return <Image className="w-3.5 h-3.5" />;
      case "pack": return <Package className="w-3.5 h-3.5" />;
      default: return <Search className="w-3.5 h-3.5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "content": return "Impact";
      case "photo": return "Tounesna";
      case "pack": return "Pack";
      default: return type;
    }
  };

  const hasContent = suggestions.length > 0 || results.length > 0;
  const showDropdown = isOpen && (hasContent || isLoading || query.trim().length >= 2);

  return (
    <div className={cn("relative", isMobile ? "w-full" : "w-64")} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative w-full group">
        <Search
          className={cn(
            "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 pointer-events-none",
            isMobile
              ? "text-muted-foreground"
              : isScrolled || isDashboard
                ? "text-muted-foreground group-focus-within:text-[#ffcc1a] group-focus-within:scale-110"
                : "text-white/60 group-focus-within:text-white group-focus-within:scale-110"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("search")}
          className={cn(
            "w-full py-2 pl-10 pr-9 text-sm transition-all duration-500 outline-none border",
            isMobile
              ? "rounded-2xl py-4 pl-14 pr-6 text-lg bg-muted/30 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5"
              : "rounded-xl",
            !isMobile && (isScrolled || isDashboard)
              ? "bg-muted/30 border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-[#ffcc1a]/50 focus:ring-4 focus:ring-[#ffcc1a]/5"
              : !isMobile
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 backdrop-blur-sm"
                : ""
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 transition-colors",
              isMobile ? "text-muted-foreground" :
                (isScrolled || isDashboard) ? "text-muted-foreground" : "text-white/60"
            )}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Search Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden z-[100]",
              isMobile ? "left-0" : "left-0 min-w-[360px]"
            )}
          >
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-[#ffcc1a]" />
                <span>Searching...</span>
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div className="px-2 pt-2 pb-1">
                <p className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  Suggestions
                </p>
                {suggestions.map((s, i) => (
                  <button
                    key={`sug-${i}`}
                    onClick={() => navigateToSuggestion(s)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors duration-150 group",
                      selectedIndex === i
                        ? "bg-[#ffcc1a]/10 text-[#1f3a5f]"
                        : "text-[#1f3a5f]/80 hover:bg-[#fff9e6]"
                    )}
                  >
                    <Search className="w-3.5 h-3.5 text-[#1f3a5f]/30 shrink-0" />
                    <span className="flex-1 truncate font-medium">{s.text}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1f3a5f]/5 text-[#1f3a5f]/40">
                      {getTypeLabel(s.type)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Divider */}
            {suggestions.length > 0 && results.length > 0 && (
              <div className="mx-4 h-px bg-black/5" />
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div className="px-2 pt-1 pb-2">
                <p className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  Results
                </p>
                {results.map((r, i) => {
                  const idx = suggestions.length + i;
                  return (
                    <button
                      key={`res-${r._id}`}
                      onClick={() => navigateToResult(r)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors duration-150 group",
                        selectedIndex === idx
                          ? "bg-[#ffcc1a]/10 text-[#1f3a5f]"
                          : "text-[#1f3a5f]/80 hover:bg-[#fff9e6]"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1f3a5f]/5 flex items-center justify-center text-[#1f3a5f]/40 shrink-0">
                        {getTypeIcon(r.resultType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-[#1f3a5f]">{r.title}</p>
                        <p className="text-xs text-[#1f3a5f]/40 truncate">
                          {r.governorate || r.region || getTypeLabel(r.resultType)}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1f3a5f]/20 group-hover:text-[#ffcc1a] transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* No results */}
            {!isLoading && !hasContent && query.trim().length >= 2 && (
              <div className="px-5 py-8 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <p className="text-sm font-medium text-[#1f3a5f]/60">No results found</p>
                <p className="text-xs text-[#1f3a5f]/40 mt-1">Try a different search term</p>
              </div>
            )}

            {/* Footer */}
            {hasContent && (
              <div className="px-2 pb-2">
                <button
                  onClick={handleSubmit as any}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fff9e6] text-[#1f3a5f] text-xs font-bold hover:bg-[#ffcc1a]/20 transition-colors"
                >
                  <span>View all results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
