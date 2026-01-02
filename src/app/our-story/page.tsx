/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import { Heart, Users, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';
import Image from 'next/image';
import image from "../../../public/Images/ad.jpg";
import image2 from "../../../public/Images/taskMatch works.jpg";
import ourStory from '../../../public/Images/our-story.jpeg' // Background image
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';
import Link from 'next/link';

const Page = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <Navbar />
            <div className="font-sans text-[#063A41] bg-white">
                {/* Hero Section with Background Image */}
                <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                    {/* Background Image with Dark Gradient Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={ourStory}
                            alt="Our Story Background"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#063A41]/60 via-[#063A41]/70 to-[#063A41]/80"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        {/* <div className="mb-6 inline-block">
                            <div className="px-4 py-2 bg-[#109C3D]/20 backdrop-blur-sm rounded-full border border-[#109C3D]/30">
                                <span className="text-[#E5FFDB] text-xs font-semibold tracking-wider uppercase">Est. 2024</span>
                            </div>
                        </div> */}

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Our <span className="text-[#E5FFDB]">Story</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                            From a single moment of frustration to Canada's most trusted community platform
                        </p>

                        <div className="flex justify-center gap-3 flex-wrap">
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">10,000+</div>
                                <div className="text-white/80 text-xs">Tasks Completed</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">5,000+</div>
                                <div className="text-white/80 text-xs">Trusted Helpers</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">50+</div>
                                <div className="text-white/80 text-xs">Cities</div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-2 bg-white rounded-full mt-1.5 animate-bounce"></div>
                        </div>
                    </div>
                </section>

                {/* Rest of the sections remain unchanged */}
                {/* The Genesis Section */}
                <section className="py-16 md:py-20 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#E5FFDB]/30 to-transparent"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#E5FFDB] rounded-full">
                                    <Sparkles className="w-3.5 h-3.5 text-[#109C3D]" />
                                    <span className="text-[#063A41] font-semibold text-xs">Chapter 1</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-5">
                                    The Genesis
                                </h2>

                                <div className="space-y-4 text-base text-[#063A41]/80 leading-relaxed">
                                    <p>
                                        It was a frigid winter evening in Toronto. Mrs. Chen, my elderly neighbour, stood in her driveway, phone in hand, desperation in her eyes. Her regular snow removal helper had cancelled last minute, and she couldn't find anyone to clear the mounting snow.
                                    </p>
                                    <p>
                                        Hours of unanswered calls. Endless voicemails. The anxiety of not knowing if help would come. That moment crystallized a truth: <strong className="text-[#063A41]">getting reliable help shouldn't be this hard.</strong>
                                    </p>
                                    <p>
                                        That night, the seed of Taskallo was planted — a platform where trust meets convenience, where every Canadian could find help when they needed it most.
                                    </p>
                                </div>

                                <div className="mt-8 p-5 bg-gradient-to-r from-[#063A41] to-[#109C3D] rounded-xl text-white">
                                    <div className="flex items-start gap-3">
                                        <div className="text-3xl">💡</div>
                                        <div>
                                            <div className="font-bold text-base mb-1">The Insight</div>
                                            <div className="text-white/90 text-sm">Every community has people who need help and people ready to help. We just needed to connect them.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={image2}
                                            alt="Winter 2024"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#063A41]/50 to-[#063A41]/70"></div>
                                        <div className="relative flex items-center justify-center h-full text-center text-white p-8">
                                            <div>
                                                <div className="text-7xl mb-4"></div>
                                                <div className="text-xl font-bold mb-1">Winter 2024</div>
                                                <div className="text-white/90 text-sm">Where it all began</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#109C3D] rounded-full opacity-20 blur-3xl"></div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#063A41] rounded-full opacity-20 blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Mission Section */}
                <section className="py-16 md:py-20 bg-gradient-to-b from-[#E5FFDB]/50 to-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white rounded-full shadow-sm">
                                <Heart className="w-3.5 h-3.5 text-[#109C3D]" />
                                <span className="text-[#063A41] font-semibold text-xs">Chapter 2</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                More Than Tasks
                            </h2>
                            <p className="text-lg text-[#063A41]/70 max-w-2xl mx-auto">
                                We're building connections, saving time, and creating peace of mind
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB]">
                                <div className="w-11 h-11 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">Community First</h3>
                                <p className="text-[#063A41]/70 text-sm leading-relaxed">
                                    Every task creates a connection. Every Helper strengthens the fabric of Canadian communities.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB]">
                                <div className="w-11 h-11 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">Trust Built-In</h3>
                                <p className="text-[#063A41]/70 text-sm leading-relaxed">
                                    Verified profiles, secure payments, and real reviews ensure every interaction is safe and reliable.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB]">
                                <div className="w-11 h-11 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">Time Saved</h3>
                                <p className="text-[#063A41]/70 text-sm leading-relaxed">
                                    No more endless calls or emails. Schedule multiple tasks, coordinate helpers, all in one place.
                                </p>
                            </div>
                        </div>

                        {/* Quote Section */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#063A41] to-[#109C3D] rounded-2xl transform rotate-1"></div>
                            <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl">
                                <div className="text-center">
                                    <div className="text-5xl mb-6">🤝</div>
                                    <blockquote className="text-xl md:text-2xl font-semibold text-[#063A41] mb-4 italic leading-relaxed">
                                        "Taskallo isn't just about completing chores. It's about people helping people, building trust one task at a time."
                                    </blockquote>
                                    <div className="text-[#109C3D] font-bold text-sm">— The Taskallo Team</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Vision Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#109C3D] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={image}
                                            alt="Coast to Coast"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#063A41]/20 to-[#063A41]/70"></div>
                                        <div className="relative flex items-center justify-center h-full p-8">
                                            <div className="text-center">
                                                {/* <div className="text-7xl mb-4">🇨🇦</div> */}
                                                <div className="text-2xl font-bold text-white mb-2">Coast to Coast</div>
                                                <div className="text-white/90">Building stronger Canadian communities</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 md:order-2 text-white">
                                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                                    <TrendingUp className="w-3.5 h-3.5 text-[#E5FFDB]" />
                                    <span className="text-[#E5FFDB] font-semibold text-xs">Chapter 3</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold mb-5">
                                    The Future is <span className="text-[#E5FFDB]">Bright</span>
                                </h2>

                                <div className="space-y-4 text-base text-white/90 leading-relaxed">
                                    <p>
                                        Every task tells a story. Every connection strengthens a community. What started as a solution to one problem has become a movement — a way for Canadians to support each other, save time, and build trust.
                                    </p>
                                    <p>
                                        We're expanding to more cities, adding more features, and connecting more people. But our mission remains unchanged: <strong className="text-white">make life easier, one task at a time.</strong>
                                    </p>
                                    <p>
                                        Taskallo isn't just a platform. It's where Canadian communities come together, where trust grows, and where everyday tasks become opportunities to help one another.
                                    </p>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                        <div className="w-9 h-9 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg text1">✓</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">Trusted Taskers</div>
                                            <div className="text-white/70 text-xs">Background checked and reviewed</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                        <div className="w-9 h-9 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg text1">✓</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">Secure Platform</div>
                                            <div className="text-white/70 text-xs">Safe payments and communication</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                        <div className="w-9 h-9 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg text1">✓</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white text-sm">24/7 Support</div>
                                            <div className="text-white/70 text-xs">We're here when you need us</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                            Join the Community
                        </h2>
                        <p className="text-lg text-[#063A41]/70 mb-10 leading-relaxed">
                            Whether you need help or want to help others, Taskallo is where Canadians come together to make life easier.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={'/urgent-task?search=general%20service'}>
                                <button className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                    Post a Task Now
                                </button></Link>
                        </div>
                    </div>
                </section>

                {/* Animation Keyframes */}
                <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
            `}</style>
            </div>
            <Footer />
        </div>
    );
};

export default Page;