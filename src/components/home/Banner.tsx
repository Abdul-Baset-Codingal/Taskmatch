/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import { categories } from "./Keywords";
import Navbar from "@/shared/Navbar";

// Component to fetch tasker count for a specific category
const TaskerCountDisplay = ({ categoryName, categoryId }: { categoryName: string; categoryId: string }) => {
  console.log('TaskerCountDisplay - Name:', categoryName, 'ID:', categoryId);
  const { data, isLoading, error } = useGetTaskersQuery({
    category: categoryName, // Changed to use categoryName (string name) instead of categoryId to match DB storage
    page: 1,
    limit: 100, // Increase limit to fetch all taskers (adjust based on API capabilities)
  });

  console.log('Full API response:', JSON.stringify(data, null, 2));
  if (data?.pagination) {
    console.log('Total taskers from API:', data.pagination.totalTaskers);
  }
  console.log(data, error); // Log error for debugging

  const count = data?.pagination?.totalTaskers || data?.taskers?.length || 0;
  if (isLoading) {
    return <div className="w-4 h-4 border-2 border-[#8560F1] border-t-transparent rounded-full animate-spin"></div>;
  }

  // If there's an error (e.g., API mismatch), show a fallback
  if (error) {
    console.error('Tasker count fetch error:', error);
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
    <div className="w-full relative overflow-hidden color1 pb-12 lg:pb-20 lg:pt-8">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline & Subtext */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-nunito leading-tight">
            Why Struggle?<br />
            <span className="text2">When You Can Solve It Instantly!</span>
          </h1>
          <p className="text-xl sm:text-2xl text3 max-w-3xl mx-auto font-medium">
            Need a plumber, cleaner, or handyman in Canada? Post your task, get verified local quotes, and book pros fast. Save time, stress, and money.
          </p>
          {/* <div className="inline-flex items-center px-6 py-3 text-base rounded-full bg-white/80 backdrop-blur-md border-2 border-emerald-200 text-emerald-700 font-semibold gap-2 shadow-lg mx-auto"> */}
          <span className="text-2xl">🍁</span>
          <span className="text3">Proudly Canadian – Pros Near You</span>
          {/* </div> */}
        </div>

        {/* Main Search Bar – Ultra-Prominent */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-1 transition-all duration-300 hover:shadow-3xl hover:border-emerald-300 focus-within:border-emerald-400 focus-within:shadow-3xl focus-within:shadow-emerald-200/50">
              <div className="flex items-center rounded-3xl bg-gradient-to-r from-emerald-50 to-blue-50 p-3 sm:p-6">
                {/* <span className="text-2xl sm:text-3xl text-gray-500 mr-2 sm:mr-4">🔍</span> */}

                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  placeholder="What do you need help with? E.g., 'plumber Toronto' or 'clean house'"
                  className="flex-1 text-base sm:text-xl font-medium text-gray-900 bg-transparent border-none outline-none placeholder-gray-500 py-3 sm:py-4"
                />

                <button
                  onClick={() => {
                    const searchQuery = search.trim() || "general service";
                    router.push(`/urgent-task?search=${encodeURIComponent(searchQuery)}`);
                  }}
                  className="ml-2 sm:ml-4 px-4 sm:px-8 py-2 sm:py-4 color1 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
                >
                  Post Task
                </button>
              </div>
            </div>


            {/* Dropdown – Same as before, but with emerald accents */}
            {/* {(search || isFocused) && (
              <div className="absolute top-full left-0 w-full mt-2 rounded-3xl shadow-2xl max-h-96 overflow-y-auto z-50 bg-white/95 backdrop-blur-xl border border-emerald-200 animate-fade-in"> */}
                {/* Popular when empty */}
                {/* {!search && isFocused && (
                  <div className="p-6 border-b border-emerald-100"> */}
                    {/* <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                      <span>🌟</span> Quick Start
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Handyman', 'Cleaning', 'Plumbing, Electrical & HVAC (PEH)', 'Pet Sitting'].map((service) => {
                        const category = categories.find(c => c.name.toLowerCase().includes(service.toLowerCase()));
                        return (
                          <button
                            key={service}
                            className="flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 transition-all duration-200 border border-emerald-200 group"
                            onClick={() => {
                              setSearch(`${service} near me`);
                              if (category) router.push(`/services/${category._id}?category=${encodeURIComponent(service)}`);
                            }}
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 mb-1">{service}</span>

                          </button>
                        );
                      })}
                    </div> */}
                  {/* </div>
                )} */}



                {/* Urgent Task Option */}
                {/* <button
                  className="w-full px-6 py-5 text-left flex items-center gap-4 text-gray-900 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-b-3xl transition-all duration-200 group border-b border-emerald-100 last:border-b-0"
                  onClick={() => {
                    const searchQuery = search.trim() || "general service";
                    router.push(`/urgent-task?search=${encodeURIComponent(searchQuery)}`);
                  }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg flex items-center gap-2">
                      Post Task
                      <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">Now</span>
                    </div>
                    <div className="text-sm text-gray-500">Get quotes from locals in minutes</div>
                  </div>
                  <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                </button> */}

                {/* Matches/Loading – unchanged */}
                {/* {matches.length === 0 && search && (
                  <div className="px-6 py-5 text-gray-500 italic flex items-center justify-center gap-3">
                    <span className="animate-pulse text-2xl">🔍</span> Finding local pros...
                  </div>
                )}
                {matches.length > 0 && matches.map((m) => (
                  <button
                    key={m._id}
                    className="w-full px-6 py-5 text-left flex items-center gap-4 text-gray-900 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-b-3xl transition-all duration-200 group border-b border-emerald-100 last:border-b-0"
                    onClick={() => {
                      setSearch(m.name);
                      setMatches([]);
                      router.push(`/services/${m._id}?category=${encodeURIComponent(m.name)}`);
                    }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg" dangerouslySetInnerHTML={{ __html: highlightMatch(m.name, search) }} />
                        <TaskerCountDisplay categoryName={m.name} categoryId={m._id} />
                      </div>
                      <div className="text-sm text-gray-500">Matches: {m.matchedKeywords.slice(0, 3).join(', ')}{m.matchedKeywords.length > 3 ? '...' : ''}</div>
                    </div>
                    <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ))} */}
              {/* </div>
            )} */}
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
              {
                name: 'Handyman & Home Repairs', icon: '🔨', slug: 'Handyman & Home Repairs'
              },
              {
                name: 'Cleaning Services', icon: '🧹', slug: 'Cleaning Services'
              },
              { name: 'Plumbing, Electrical & HVAC (PEH)', icon: '🚿', slug: 'Plumbing, Electrical & HVAC (PEH)' },
              {
                name: 'Pet Services', icon: '🐶', slug: 'Pet Services'
              },
              {
                name: 'Automotive Services', icon: '🚚', slug: 'Automotive Services'
              },
              { name: 'All Other Specialized Services', icon: '🏠', slug: 'All Other Specialized Services' },
            ].map((cat) => {
              const category = categories.find(c =>
                c.name.toLowerCase().includes(cat.slug.toLowerCase()) ||
                cat.slug.toLowerCase().includes(c.name.toLowerCase())
              );
              console.log(`Category match for ${cat.name}:`, category); // Debug log—remove after testing
              return (
                <button
                  key={cat.name}
                  className="group flex flex-col items-center p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => {
                    setSearch(`${cat.name} near me`);
                    if (category) {
                      router.push(`/services/${category._id}?category=${encodeURIComponent(cat.name)}`);
                    } else {
                      // Fallback: Navigate to a general search if no exact match
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