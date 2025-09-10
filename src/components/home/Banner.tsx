/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import BannerCard from "./BannerCard";
import { useRouter } from "next/navigation";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import { categories } from "./Keywords";

// Component to fetch tasker count for a specific category
const TaskerCountDisplay = ({ categoryName, categoryId }: { categoryName: string; categoryId: string }) => {
  console.log(categoryName, categoryId);
  const { data, isLoading } = useGetTaskersQuery({
    category: categoryName, // Use the passed categoryName
    page: 1,
    limit: 100, // Increase limit to fetch all taskers (adjust based on API capabilities)
  });

  console.log(data);

  const count = data?.taskers?.length || 0;
  if (isLoading) {
    return <div className="w-4 h-4 border-2 border-[#8560F1] border-t-transparent rounded-full animate-spin"></div>;
  }

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${count === 0 ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
        }`}
    >
      {count === 0 ? "No taskers" : count === 1 ? "1 tasker" : `${count} taskers`}
    </span>
  );
};

const Banner = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<{ _id: string; name: string; matchedKeywords: string[] }[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setMatches([]);
        return;
      }

      const searchWords = search.toLowerCase().trim().split(/\s+/).filter(word => word.length > 1); // Ignore words shorter than 2 characters
      const fullQuery = search.toLowerCase().trim(); // Use full query for category name matching

      const found = categories
        .map(cat => {
          // Match keywords
          const matchedKeywords = cat.keywords.filter(kw =>
            searchWords.some(word => kw.toLowerCase().includes(word))
          );
          // Match category name with full query
          const nameMatchScore = cat.name.toLowerCase().includes(fullQuery) ? 100 : 0; // High score for direct name match
          return {
            _id: cat._id,
            name: cat.name,
            matchedKeywords,
            score: nameMatchScore + matchedKeywords.length, // Combine name match and keyword match
          };
        })
        .filter(cat => cat.score > 0) // Only include categories with matches
        .sort((a, b) => b.score - a.score); // Sort by relevance (name match first, then keyword count)

      setMatches(found);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // Highlight matched keywords in the suggestion
  const highlightMatch = (text: string, query: string) => {
    const words = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 1); // Ignore words shorter than 2 characters
    const fullQuery = query.toLowerCase().trim(); // Full query for exact matches

    let highlighted = text;

    // Prioritize full query match in category name
    if (fullQuery.length > 1 && text.toLowerCase().includes(fullQuery)) {
      const regex = new RegExp(`(${fullQuery})`, 'gi');
      highlighted = highlighted.replace(regex, "<span class='bg-[#E7B6FE]/30 px-1 rounded'>$1</span>");
      return highlighted;
    }

    // Highlight individual words if no full query match
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match whole words only
      highlighted = highlighted.replace(regex, "<span class='bg-[#E7B6FE]/30 px-1 rounded'>$1</span>");
    });

    return highlighted;
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#16161A] via-[#1A1A2E] to-[#16161A] relative overflow-visible py-12 sm:py-16 lg:py-20" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-10% left-10% w-72 h-72 bg-[#8560F1] rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-10% right-10% w-96 h-96 bg-[#E7B6FE] rounded-full filter blur-3xl opacity-5 animate-pulse-slower"></div>
      </div>

      <div className="relative z-20 flex justify-center w-full">
        <div className="flex flex-col items-center max-w-4xl mx-auto gap-10 px-4">
          {/* Text Content */}
          <div className="text-white text-center space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#c589e0]">
              Help is just a click away
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light">
              Your trusted local service network
            </p>
            <div className="inline-flex items-center px-4 py-2 text-sm rounded-full backdrop-blur-md bg-white/5 border border-white/10 font-medium gap-2">
              <span className="text-xl">🍁</span>
              <span>Proudly Canadian</span>
            </div>
          </div>

          {/* Search Bar - Enhanced with better styling */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-[#8560F1]/50 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#8560F1]/30 hover:scale-[1.02] focus-within:scale-[1.02] focus-within:shadow-2xl focus-within:shadow-[#8560F1]/40 focus-within:border-[#8560F1]">
                <span className="pl-5 text-gray-300 text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="What service do you need? (e.g., dog walking, plumbing, cleaning...)"
                  className="w-full pl-4 pr-6 py-5 text-lg bg-transparent border-none text-white focus:outline-none placeholder-gray-400 font-light"
                />
              </div>

              {/* Dropdown Suggestions - Enhanced styling */}
              {(search || isFocused) && (
                <div className="absolute mt-3 w-full rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-[999] bg-gradient-to-b from-[#1E1E2A] to-[#252538] backdrop-blur-xl border border-[#8560F1]/30 animate-fade-in">
                  {/* Popular searches when empty */}
                  {!search && isFocused && (
                    <div className="p-5 border-b border-[#8560F1]/20">
                      <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <span>🌟</span> Popular Services
                      </h3>
                      <div className="space-y-2">
                        {['Handyman, Renovation & Moving Help', 'Pet Services', 'Complete Cleaning', ].map((service) => {
                          const category = categories.find(c => c.name === service);

                          return (
                            <div
                              key={service}
                              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-[#8560F1]/10 to-[#E7B6FE]/10 cursor-pointer hover:from-[#8560F1]/20 hover:to-[#E7B6FE]/20 transition-all duration-200 border border-[#8560F1]/20 group"
                              onClick={() => {
                                if (category) {
                                  router.push(`/services/${category._id}?category=${encodeURIComponent(service)}`);
                                }
                              }}
                            >
                              <span className="text-white font-medium">{service}</span>
                              <div className="flex items-center gap-2">
                                {category && <TaskerCountDisplay categoryName={service} categoryId={category._id} />}
                                <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Always show "Post Urgent Task" option */}
                  <div
                    className="px-6 py-4 cursor-pointer flex items-center gap-4 text-white hover:bg-gradient-to-r hover:from-[#FF6B6B]/20 hover:to-[#FF8787]/20 rounded-lg transition-all duration-200 group border-b border-[#8560F1]/10"
                    onClick={() => {
                      const searchQuery = search.trim() || "general service";
                      router.push(`/urgent-task?search=${encodeURIComponent(searchQuery)}`);
                    }}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
                    <div className="flex-1">
                      <div className="font-medium text-base flex items-center gap-2">
                        Post Urgent Task
                        <span className="text-xs bg-gradient-to-r from-[#FF6B6B] to-[#FF8787] text-white px-2 py-0.5 rounded-full">
                          Quick
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Get multiple quotes instantly</div>
                    </div>
                    <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
                  </div>

                  {/* Loading state for search */}
                  {matches.length === 0 && search && (
                    <div className="px-6 py-4 text-gray-400 italic flex items-center gap-3">
                      <span className="animate-pulse">🔍</span> Searching for services...
                    </div>
                  )}

                  {/* Matched services with tasker counts */}
                  {matches.length > 0 &&
                    matches.map((m) => {
                      return (
                        <div
                          key={m._id}
                          className="px-6 py-4 cursor-pointer flex items-center gap-4 text-white hover:bg-gradient-to-r hover:from-[#8560F1]/20 hover:to-[#E7B6FE]/20 rounded-lg transition-all duration-200 border-b border-[#8560F1]/10 last:border-b-0 group"
                          onClick={() => {
                            setSearch(m.name);
                            setMatches([]);
                            router.push(`/services/${m._id}?category=${encodeURIComponent(m.name)}`);
                          }}
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="font-medium text-base"
                                dangerouslySetInnerHTML={{ __html: highlightMatch(m.name, search) }}
                              />
                              <TaskerCountDisplay categoryName={m.name} categoryId={m._id} />
                            </div>
                            <div className="text-sm text-gray-400">
                              Matches: {m.matchedKeywords.slice(0, 3).join(", ")}
                              {m.matchedKeywords.length > 3 ? "..." : ""}
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Search tips */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400 font-light">
                Try searching for "plumbing", "cleaning", "pet sitting", or any service you need
              </p>
            </div>
          </div>

          {/* Stats/Callout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 w-full max-w-3xl">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10 hover:border-[#8560F1]/30 transition-all duration-300">
              <div className="text-2xl font-bold text-white bg-clip-text  bg-gradient-to-r from-white to-[#E7B6FE]">500+</div>
              <div className="text-sm text-gray-300 mt-1">Trusted Taskers</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10 hover:border-[#8560F1]/30 transition-all duration-300">
              <div className="text-2xl font-bold text-white bg-clip-text  bg-gradient-to-r from-white to-[#E7B6FE]">24/7</div>
              <div className="text-sm text-gray-300 mt-1">Service Availability</div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/10 hover:border-[#8560F1]/30 transition-all duration-300">
              <div className="text-2xl font-bold text-white bg-clip-text  bg-gradient-to-r from-white to-[#E7B6FE]">100%</div>
              <div className="text-sm text-gray-300 mt-1">Satisfaction Guarantee</div>
            </div>
          </div>

          {/* Right Card */}
          <div className="w-full max-w-md mt-8">
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;