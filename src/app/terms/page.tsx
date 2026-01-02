"use client"
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';
import React from 'react';
import {
    Shield,
    FileText,
    Lock,
    Scale,
    Users,
    CreditCard,
    AlertCircle,
    Globe,
    Clock,
    ChevronRight,
    BookOpen,
    CheckCircle,
    Mail
} from 'lucide-react';

const TermsAndPrivacyPage = () => {
    return (
        <div>
            <Navbar />
            <div className="font-sans text-[#063A41] bg-white">
                {/* Hero Section */}
                <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#063A41] to-[#109C3D]">
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-white"
                                    style={{
                                        width: Math.random() * 3 + 1 + 'px',
                                        height: Math.random() * 3 + 1 + 'px',
                                        left: Math.random() * 100 + '%',
                                        top: Math.random() * 100 + '%',
                                        animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                                        animationDelay: Math.random() * 5 + 's'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <div className="mb-6 inline-block">
                            <div className="px-4 py-2 bg-[#109C3D]/20 backdrop-blur-sm rounded-full border border-[#109C3D]/30">
                                <span className="text-[#E5FFDB] text-xs font-semibold tracking-wider uppercase">Legal Information</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Terms & <span className="text-[#109C3D]">Privacy</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Your trust is important to us. Learn how we protect your data and the rules that govern our platform.
                        </p>

                        <div className="flex justify-center gap-3 flex-wrap">
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <Shield className="w-6 h-6 text-white mx-auto mb-2" />
                                <div className="text-white/80 text-xs">PIPEDA Compliant</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <Lock className="w-6 h-6 text-white mx-auto mb-2" />
                                <div className="text-white/80 text-xs">Data Protected</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <Globe className="w-6 h-6 text-white mx-auto mb-2" />
                                <div className="text-white/80 text-xs">Canadian Operated</div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-2 bg-white rounded-full mt-1.5 animate-bounce"></div>
                        </div>
                    </div>
                </section>

                {/* Quick Navigation Cards */}
                <section className="py-16 bg-gradient-to-b from-[#E5FFDB]/30 to-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-10">
                            <p className="text-sm text-[#063A41]/70">Effective Date: December 10, 2025</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <a href="#terms" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB] group hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#063A41]">Terms of Service</h3>
                                        <p className="text-[#063A41]/70 text-sm">Rules and conditions for using Taskallo</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#109C3D] group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </a>

                            <a href="#privacy" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB] group hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#063A41]">Privacy Policy</h3>
                                        <p className="text-[#063A41]/70 text-sm">How we collect and protect your data</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#109C3D] group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Terms of Service Section */}
                <section id="terms" className="py-16 md:py-20 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#E5FFDB]/30 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#E5FFDB]/30 to-transparent"></div>

                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#E5FFDB] rounded-full">
                            <FileText className="w-3.5 h-3.5 text-[#109C3D]" />
                            <span className="text-[#063A41] font-semibold text-xs">Terms of Service</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-8">
                            Taskallo <span className="text-[#109C3D]">Terms of Service</span>
                        </h2>

                        {/* Terms Content */}
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">1. Introduction</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed mb-3">
                                            Welcome to Taskallo, a platform that connects users seeking services (&quot;Bookers&quot;) with independent service providers (&quot;Taskers&quot;). By accessing or using our website, mobile applications, or services (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;), our Conditions of Use, and our Privacy Policy.
                                        </p>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            Taskallo is operated by Taskallo Inc., located in Toronto, Ontario, Canada. We reserve the right to modify these Terms at any time, and such modifications will be effective upon posting.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">2. Eligibility</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            You must be at least 18 years old to use the Service. By using Taskallo, you represent that you meet this age requirement and have the legal capacity to enter into contracts. Taskers must have the right to work in Canada and hold any necessary licenses or permits required by law for the services they offer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">3. User Accounts</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed mb-3">
                                            To access certain features, you must create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                                        </p>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            Taskallo may suspend or terminate your account if we suspect misuse or violation of these Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">4. Posting Tasks and Offering Services</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed mb-3">
                                            Clients can post tasks describing the services needed. Taskers can offer to perform those tasks. All agreements between Clients and Taskers are directly between them; Taskallo facilitates but is not a party to these agreements.
                                        </p>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            Taskers must be qualified and licensed where required by Canadian law. Clients are responsible for verifying Taskers&apos; qualifications. Taskers are independent contractors and must comply with all applicable Canadian laws.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">5. Payments</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed mb-3">
                                            Payments for services are processed through Taskallo&apos;s payment system in Canadian dollars (CAD). We charge a service fee on transactions. All payments are final and non-refundable unless otherwise specified.
                                        </p>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            Taskers are independent contractors and responsible for their own taxes, including collecting and remitting applicable sales taxes such as GST/HST/QST/PST. Taskallo does not withhold taxes or issue tax forms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">6. User Conduct</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            You agree not to use the Service for illegal purposes, harass others, or post harmful content. Prohibited activities include fraud, spam, and infringement of intellectual property rights. All users must comply with Canadian laws and regulations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 7 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">7. Intellectual Property</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            All content on Taskallo, including logos and software, is owned by us or our licensors. You grant us a license to use any content you post for operating the Service.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 8 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">8. Disclaimers</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            The Service is provided &quot;as is&quot; without warranties. We do not guarantee the quality of services provided by Taskers or the accuracy of user content.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 9 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Scale className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">9. Limitation of Liability</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            Taskallo is not liable for any indirect, incidental, or consequential damages arising from the use of the Service. Our total liability shall not exceed the fees paid by you in the past 12 months.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 10 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">10. Indemnification</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            You agree to indemnify Taskallo against any claims arising from your use of the Service or violation of these Terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 11 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">11. Governing Law</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of laws principles. Any disputes shall be resolved in the courts of Ontario, Canada.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 12 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">12. Changes to Terms</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            We may update these Terms at any time. Continued use of the Service constitutes acceptance of changes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 13 */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5FFDB] hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Scale className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#063A41] mb-3">13. Dispute Resolution</h3>
                                        <p className="text-[#063A41]/80 leading-relaxed">
                                            For users in Canada (except Quebec), disputes may be resolved through binding arbitration under the rules of the ADR Institute of Canada, in your primary province. For Quebec residents, disputes will be handled in accordance with Quebec consumer protection laws.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy Section */}
                <section id="privacy" className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#109C3D] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <Shield className="w-3.5 h-3.5 text-[#E5FFDB]" />
                            <span className="text-[#E5FFDB] font-semibold text-xs">Privacy Policy</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Your <span className="text-[#E5FFDB]">Privacy</span> Matters
                        </h2>

                        <p className="text-lg text-white/80 mb-10 max-w-2xl">
                            This Privacy Policy describes how Taskallo collects, uses, and shares your personal information in compliance with PIPEDA and applicable provincial privacy laws in Canada.
                        </p>

                        {/* Privacy Content */}
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Information We Collect</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            We collect personal information such as name, email, payment details, and location when you register or use the Service. We also collect usage data and device information.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">How We Use Your Information</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            We use your information to provide the Service, process payments, communicate with you, and improve our platform. We may share data with Taskers, payment processors, and as required by law.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Lock className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Data Security</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            We implement reasonable security measures to protect your data, but no system is completely secure.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Your Rights</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            You have the right to access, correct, or withdraw consent to the use of your personal information. For requests, contact us at support@taskallo.com.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Cookies</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            We use cookies to enhance your experience. You can manage cookie preferences in your browser.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#E5FFDB] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Changes to Privacy Policy</h3>
                                        <p className="text-white/80 leading-relaxed">
                                            We may update this policy. Changes will be posted here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-2xl flex items-center justify-center">
                            <Mail className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                            Have Questions?
                        </h2>
                        <p className="text-lg text-[#063A41]/70 mb-10 leading-relaxed">
                            If you have any questions about these Terms or our Privacy Policy, please don&apos;t hesitate to reach out to our team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="mailto:support@taskallo.com" className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                Contact Support
                            </a>
                            <a href="/contact" className="px-6 py-3 bg-white border-2 border-[#063A41] text-[#063A41] rounded-full font-semibold hover:bg-[#E5FFDB] transition-all duration-300">
                                Visit Contact Page
                            </a>
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
                    
                    html {
                        scroll-behavior: smooth;
                    }
                `}</style>
            </div>
            <Footer />
        </div>
    );
};

export default TermsAndPrivacyPage;