/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect } from 'react';
import { Mail, Clock, Send, MessageCircle, Users, CheckCircle, Globe, MapPin } from 'lucide-react';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';
import { toast } from 'react-toastify';

const ContactPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                _subject: "New Contact Form Submission from Taskallo",
                _captcha: "false",
                _template: "table",
                _autoresponse: "Thank you for contacting Taskallo! We have received your message and will get back to you within 24 hours."
            };

            const response = await fetch('https://formsubmit.co/ajax/taskallo88@gmail.com', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

                // Reset success message after 5 seconds
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Failed to send message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="font-sans text-[#063A41] bg-white">
                {/* Hero Section */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 color1">
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
                                <span className="text-[#E5FFDB] text-xs font-semibold tracking-wider uppercase">Get In Touch</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Contact <span className="text-[#109C3D]">Us</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>

                        <div className="flex justify-center gap-3 flex-wrap">
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">&lt; 24hrs</div>
                                <div className="text-white/80 text-xs">Avg Response Time</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">50+</div>
                                <div className="text-white/80 text-xs">Cities Served</div>
                            </div>
                            <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <div className="text-2xl font-bold text-white mb-1">98%</div>
                                <div className="text-white/80 text-xs">Satisfaction Rate</div>
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

                {/* Contact Info Cards */}
                <section className="py-16 bg-gradient-to-b from-[#E5FFDB]/30 to-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB] text-center group hover:-translate-y-1">
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">Email Us</h3>
                                <p className="text-[#063A41]/70 text-sm">support@taskallo.com</p>
                                <p className="text-[#063A41]/70 text-sm">taskallo88@gmail.com</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB] text-center group hover:-translate-y-1">
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">Response Time</h3>
                                <p className="text-[#063A41]/70 text-sm">Within 24 hours</p>
                                <p className="text-[#063A41]/70 text-sm">7 days a week</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5FFDB] text-center group hover:-translate-y-1">
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">Service Area</h3>
                                <p className="text-[#063A41]/70 text-sm">Across Canada</p>
                                <p className="text-[#063A41]/70 text-sm">50+ Cities</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="py-16 md:py-20 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#E5FFDB]/30 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#E5FFDB]/30 to-transparent"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Form Side */}
                            <div className="order-2 md:order-1">
                                <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#E5FFDB]">
                                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#E5FFDB] rounded-full">
                                        <MessageCircle className="w-3.5 h-3.5 text-[#109C3D]" />
                                        <span className="text-[#063A41] font-semibold text-xs">Send Message</span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-[#063A41] mb-2">
                                        Drop Us a Line
                                    </h2>
                                    <p className="text-[#063A41]/70 text-sm mb-6">
                                        Fill out the form below and we&apos;ll get back to you shortly.
                                    </p>

                                    {isSubmitted && (
                                        <div className="mb-6 p-4 bg-[#E5FFDB] rounded-xl border border-[#109C3D]/30 flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#109C3D]" />
                                            <div>
                                                <p className="text-[#063A41] font-semibold text-sm">Message Sent Successfully!</p>
                                                <p className="text-[#063A41]/70 text-xs">We&apos;ll get back to you within 24 hours.</p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* No need for hidden inputs here anymore; they're in the payload */}

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-[#E5FFDB] focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 outline-none transition-all duration-300 text-[#063A41]"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-[#E5FFDB] focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 outline-none transition-all duration-300 text-[#063A41]"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-[#E5FFDB] focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 outline-none transition-all duration-300 text-[#063A41]"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                                                    Subject *
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-[#E5FFDB] focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 outline-none transition-all duration-300 text-[#063A41] bg-white"
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="general">General Inquiry</option>
                                                    <option value="support">Customer Support</option>
                                                    <option value="partnership">Partnership</option>
                                                    <option value="feedback">Feedback</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#063A41] mb-2">
                                                Your Message *
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-[#E5FFDB] focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 outline-none transition-all duration-300 text-[#063A41] resize-none"
                                                placeholder="Tell us how we can help you..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full px-6 py-4 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Info Side */}
                            <div className="order-1 md:order-2">
                                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-[#E5FFDB] rounded-full">
                                    <Users className="w-3.5 h-3.5 text-[#109C3D]" />
                                    <span className="text-[#063A41] font-semibold text-xs">We&apos;re Here to Help</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-5">
                                    Let&apos;s Start a <span className="text-[#109C3D]">Conversation</span>
                                </h2>

                                <p className="text-base text-[#063A41]/80 leading-relaxed mb-8">
                                    Whether you have a question about our services, need help with your account, or want to explore partnership opportunities, our team is ready to assist you.
                                </p>

                                {/* FAQ Preview */}
                                <div className="space-y-4 mb-8">
                                    <h3 className="text-lg font-bold text-[#063A41]">Frequently Asked Questions</h3>

                                    <div className="bg-[#E5FFDB]/50 rounded-xl p-4 border border-[#E5FFDB]">
                                        <h4 className="font-semibold text-[#063A41] text-sm mb-1">How quickly will I get a response?</h4>
                                        <p className="text-[#063A41]/70 text-sm">We typically respond within 24 hours. Most inquiries are answered much faster!</p>
                                    </div>

                                    <div className="bg-[#E5FFDB]/50 rounded-xl p-4 border border-[#E5FFDB]">
                                        <h4 className="font-semibold text-[#063A41] text-sm mb-1">Can I schedule a call with your team?</h4>
                                        <p className="text-[#063A41]/70 text-sm">Yes! Just mention it in your message and we&apos;ll arrange a convenient time for a call.</p>
                                    </div>

                                    <div className="bg-[#E5FFDB]/50 rounded-xl p-4 border border-[#E5FFDB]">
                                        <h4 className="font-semibold text-[#063A41] text-sm mb-1">What&apos;s the best way to reach you?</h4>
                                        <p className="text-[#063A41]/70 text-sm">For all inquiries, email us or fill out the contact form. We read every message!</p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="p-6 bg-gradient-to-r from-[#063A41] to-[#109C3D] rounded-xl text-white">
                                    <h3 className="font-bold text-lg mb-3">Connect With Us</h3>
                                    <p className="text-white/80 text-sm mb-4">Follow us on social media for updates, tips, and community stories.</p>
                                    <div className="flex gap-3">
                                        <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section - Serving Canadians */}
                <section className="py-16 bg-gradient-to-br from-[#063A41] to-[#109C3D] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-[#E5FFDB]" />
                                <span className="text-[#E5FFDB] font-semibold text-xs">Proudly Canadian</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Serving <span className="text-[#E5FFDB]">Canadians</span> Coast to Coast
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                Based in Toronto, Ontario — connecting communities across Canada through trusted task services.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 items-stretch">
                            {/* Map */}
                            <div className="md:col-span-2 bg-white rounded-2xl overflow-hidden shadow-xl h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184552.67411786475!2d-79.54286377452772!3d43.71812528498086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>

                            {/* Info Cards */}
                            <div className="space-y-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🇨🇦</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Canadian Roots</h3>
                                    </div>
                                    <p className="text-white/70 text-sm">Founded and operated in Toronto, serving communities across the nation.</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🌐</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">100% Online</h3>
                                    </div>
                                    <p className="text-white/70 text-sm">We&apos;re a digital-first company. Reach us anytime, from anywhere.</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">📍</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">50+ Cities</h3>
                                    </div>
                                    <p className="text-white/70 text-sm">Growing network of Helpers and Task Posters in cities across Canada.</p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-[#E5FFDB] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">💚</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Community First</h3>
                                    </div>
                                    <p className="text-white/70 text-sm">Building stronger neighbourhoods one task at a time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <div className="text-5xl mb-6">💬</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-[#063A41]/70 mb-10 leading-relaxed">
                            Join thousands of Canadians who trust Taskallo for their everyday tasks. We&apos;re here to help you every step of the way.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                Post a Task Now
                            </button>
                            <button className="px-6 py-3 bg-white border-2 border-[#063A41] text-[#063A41] rounded-full font-semibold hover:bg-[#E5FFDB] transition-all duration-300">
                                Become a Helper
                            </button>
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

export default ContactPage;