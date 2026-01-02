/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import { categories } from "./Keywords";
import Navbar from "@/shared/Navbar";
import mapleLeaf from "../../../public/Images/mapleLeaf.png"
import Image from "next/image";
// Component to fetch tasker count for a specific category
const TaskerCountDisplay = ({ categoryName, categoryId }: { categoryName: string; categoryId: string }) => {
  console.log('TaskerCountDisplay - Name:', categoryName, 'ID:', categoryId);
  const { data, isLoading, error } = useGetTaskersQuery({
    category: categoryName,
    page: 1,
    limit: 100,
  });

  // console.log('Full API response:', JSON.stringify(data, null, 2));
  // if (data?.pagination) {
  //   console.log('Total taskers from API:', data.pagination.totalTaskers);
  // }
  // console.log(data, error);

  const count = data?.pagination?.totalTaskers || data?.taskers?.length || 0;
  if (isLoading) {
    return <div className="w-4 h-4 border-2 border-[#8560F1] border-t-transparent rounded-full animate-spin"></div>;
  }

  if (error) {
    // console.error('Tasker count fetch error:', error);
    return <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600">Loading...</span>;
  }

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${count === 0 ? "bg-red-500/20 text-red-600" : "bg-green-500/20 text-green-600"
        }`}
    >
      {count === 0 ? "No taskers yet – Post your task to attract pros!" : count === 1 ? "1 tasker" : `${count} taskers`}
    </span>
  );
};

// Typewriter Hook
const useTypewriter = (phrases: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (isTyping) {
      if (displayText.length < currentPhrase.length) {
        const typingTimer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(typingTimer);
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
      }
    } else {
      if (displayText.length > 0) {
        const deletingTimer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(deletingTimer);
      } else {
        // Finished deleting, move to next phrase
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
  }, [displayText, phraseIndex, isTyping, isPaused, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
};

const Banner = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<{ _id: string; name: string; matchedKeywords: string[] }[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Typewriter phrases
  const placeholderPhrases = [
    "I need a plumber to fix my sink...",
    "Looking for help with moving...",
    "Need house cleaning service...",
    "Dog walking near me...",
    "Handyman for furniture assembly...",
  ];

  const typewriterText = useTypewriter(placeholderPhrases, 80, 40, 2500);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setMatches([]);
        return;
      }

      const searchWords = search.toLowerCase().trim().split(/\s+/).filter(word => word.length > 1);
      const fullQuery = search.toLowerCase().trim();

      const found = categories
        .map(cat => {
          const matchedKeywords = cat.keywords.filter(kw =>
            searchWords.some(word => kw.toLowerCase().includes(word))
          );
          const nameMatchScore = cat.name.toLowerCase().includes(fullQuery) ? 100 : 0;
          return {
            _id: cat._id,
            name: cat.name,
            matchedKeywords,
            score: nameMatchScore + matchedKeywords.length,
          };
        })
        .filter(cat => cat.score > 0)
        .sort((a, b) => b.score - a.score);

      setMatches(found);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const highlightMatch = (text: string, query: string) => {
    const words = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 1);
    const fullQuery = query.toLowerCase().trim();

    let highlighted = text;

    if (fullQuery.length > 1 && text.toLowerCase().includes(fullQuery)) {
      const regex = new RegExp(`(${fullQuery})`, 'gi');
      highlighted = highlighted.replace(regex, "<span class='bg-[#E7B6FE]/30 px-1 rounded'>$1</span>");
      return highlighted;
    }

    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlighted = highlighted.replace(regex, "<span class='bg-[#E7B6FE]/30 px-1 rounded'>$1</span>");
    });

    return highlighted;
  };

  return (
    <div className="w-full relative overflow-hidden color1 pb-12 lg:pb-20 lg:pt-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline & Subtext */}
        <div className="lg:space-y-6 space-y-6 mb-6 lg:mb-12">
          <h1 className="text-2xl sm:text-5xl lg:text-5xl font-bold text-white font-nunito leading-tight ">
            Canada's Most Reliable Task & Service Marketplace<br />
          </h1>
          <p className="text-md sm:text-2xl text3 max-w-3xl mx-auto font-medium">
            Post a task, request quotes, or choose ready-to-book services. <br /> Simple, transparent, and made for Canadians.
          </p>
          <div className="flex items-center justify-center">
            <Image src="/Images/mapleLeaf.png" alt="Maple Leaf" width={24} height={24} className="inline-block" />          
            <span className="text3">Proudly Canadian</span>
          </div>
        </div>

        {/* Main Search Bar – Ultra-Prominent */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-1 transition-all duration-300 hover:shadow-3xl hover:border-emerald-300 focus-within:border-emerald-400 focus-within:shadow-3xl focus-within:shadow-emerald-200/50">
              <div className="flex items-center rounded-3xl bg-gradient-to-r from-emerald-50 to-blue-50 p-3 sm:p-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const searchQuery = search.trim() || "general service";
                        router.push(`/urgent-task?search=${encodeURIComponent(searchQuery)}`);
                      }
                    }}
                    placeholder=""
                    className="w-full text-base sm:text-xl font-medium text-gray-900 bg-transparent border-none outline-none py-3 sm:py-4"
                  />

                  {/* Custom Typewriter Placeholder */}
                  {!search && !isFocused && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <span className="text-base sm:text-xl font-medium text1">
                        {typewriterText}
                        <span className="animate-pulse text1">|</span>
                      </span>
                    </div>
                  )}

                  {/* Static placeholder when focused but empty */}
                  {!search && isFocused && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <span className="text-base sm:text-xl font-medium text1 opacity-60">
                        Tell us your task...
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const searchQuery = search.trim() || "general service";
                    router.push(`/urgent-task?search=${encodeURIComponent(searchQuery)}`);
                  }}
                  className="ml-2 sm:ml-4 px-4 sm:px-8 py-2 sm:py-4 color1 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
                >
                  Post a Task
                </button>
              </div>
            </div>
          </div>

          {/* Search Tips */}
          <p className="mt-4 text-lg text3 font-light text-center">
            Or start with a category below
          </p>
        </div>

        {/* Category Chips – Like GetNinjas/TaskRabbit */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4">
            {[
              { name: 'Handyman & Home Repairs', icon: '🔨', slug: 'Handyman & Home Repairs' },
              { name: 'Pet Services', icon: '🐶', slug: 'Pet Services' },
              { name: 'Cleaning Services', icon: '🧹', slug: 'Cleaning Services' },
              { name: 'Plumbing, Electrical & HVAC (PEH)', icon: '🚿', slug: 'Plumbing, Electrical & HVAC (PEH)' },
              { name: 'Automotive Services', icon: '🚚', slug: 'Automotive Services' },
              { name: 'All Other Specialized Services', icon: '🏠', slug: 'All Other Specialized Services' },
            ].map((cat) => {
              const category = categories.find(c =>
                c.name.toLowerCase().includes(cat.slug.toLowerCase()) ||
                cat.slug.toLowerCase().includes(c.name.toLowerCase())
              );
              // console.log(`Category match for ${cat.name}:`, category);
              return (
                <button
                  key={cat.name}
                  className="group flex flex-col items-center p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => {
                    setSearch(`${cat.name} near me`);
                    if (category) {
                      router.push(`/services/${category._id}?category=${encodeURIComponent(cat.name)}`);
                    } else {
                      router.push(`/search?query=${encodeURIComponent(`${cat.name} near me`)}`);
                    }
                  }}
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 mb-1">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;