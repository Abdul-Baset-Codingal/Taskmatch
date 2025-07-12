/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { setStep1 } from "@/features/form/formSlice";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaGlobe,
    FaRegSmile,
    FaRoad,
    FaCamera,
    FaLock,
    FaEyeSlash,
    FaEye,
} from "react-icons/fa";

const Step1BasicInfo = ({
    onNext,
    onBack,
}: {
    onNext: () => void;
    onBack?: () => void;
}) => {
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({

        email: "",
        phone: "",
        dob: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        language: "",
        about: "",
        travelDistance: "",
        profilePicture: "",
    });


    const [preview, setPreview] = useState<string | null>(null);

    const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreview(url);
            setFormData({ ...formData, profilePicture: url });
        }
    };


    const handleNext = () => {
        const finalData = {
            fullName,
            email: formData.email,
            password,
            phone: formData.phone,
            dob: formData.dob,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            language: formData.language,
            about: formData.about,
            travelDistance: formData.travelDistance,
            profilePicture: formData.profilePicture,
        };

        dispatch(setStep1(finalData));
        onNext();
    };


    return (
        <div className="max-w-7xl mx-auto p-10 rounded-3xl shadow-xl bg-white font-sans text-black">
            <form className="space-y-10">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center">
                    <label
                        htmlFor="profilePic"
                        className="group relative cursor-pointer w-36 h-36 rounded-full overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
                        title="Upload Profile Picture"
                        style={{
                            background: "linear-gradient(135deg, #C9303C, #1A4F93)",
                            padding: "4px",
                        }}
                    >
                        <div className="rounded-full overflow-hidden w-full h-full bg-white">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile Preview"
                                    width={144}
                                    height={144}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full bg-gray-300/30 text-gray-800 group-hover:text-gray-900">
                                    <FaCamera className="text-6xl mb-2" />
                                    <span className="text-sm font-semibold tracking-wide">
                                        Upload Photo
                                    </span>
                                </div>
                            )}
                        </div>
                        <input
                            id="profilePic"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                        />
                    </label>
                    <p className="mt-4 text-sm text-gray-500 max-w-xs text-center">
                        Professional photo recommended. JPG or PNG, max 5MB.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Full Name Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">Full Name *</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1A4F93]">
                            <FaUser className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full outline-none text-black bg-transparent placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">Password *</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1A4F93]">
                            <FaLock className="text-gray-500 mr-3" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full outline-none text-black bg-transparent placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 focus:outline-none text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                </div>


                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Field label="Email Address" icon={<FaEnvelope />} type="email" required value={formData.email} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, email: e.target.value })} />
                    <Field label="Phone Number" icon={<FaPhone />} type="tel" required value={formData.phone} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, phone: e.target.value })} />
                </div>

                <Field label="Date of Birth" icon={<FaRegSmile />} type="date" required value={formData.dob} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, dob: e.target.value })} />

                <Field label="Street Address" icon={<FaMapMarkerAlt />} required value={formData.address} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, address: e.target.value })} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <Field label="City" icon={<FaMapMarkerAlt />} required value={formData.city} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, city: e.target.value })} />
                    <SelectField label="Province" icon={<FaMapMarkerAlt />} required value={formData.province} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, province: e.target.value })} options={["Ontario", "British Columbia", "Quebec", "Alberta"]} />
                    <Field label="Postal Code" icon={<FaMapMarkerAlt />} required value={formData.postalCode} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, postalCode: e.target.value })} />
                </div>

                <SelectField label="Language Preference" icon={<FaGlobe />} required value={formData.language} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, language: e.target.value })} options={["English", "French", "Bilingual"]} />

                <TextAreaField label="About Me" icon={<FaRegSmile />} required rows={5} minLength={100} placeholder="Tell customers about yourself..." helperText="Minimum 100 characters." value={formData.about} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, about: e.target.value })} />

                <SelectField label="How far are you willing to travel for tasks?" icon={<FaRoad />} required value={formData.travelDistance} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, travelDistance: e.target.value })} options={[
                    { value: "5", label: "Up to 5 km" },
                    { value: "10", label: "Up to 10 km" },
                    { value: "20", label: "Up to 20 km" },
                    { value: "50", label: "Up to 50 km" },
                ]} />

                {/* Notice */}
                <div className="mt-12 p-6 bg-red-50 border-l-6 border-red-600 rounded-xl text-red-700">
                    🍁 <strong>PIPEDA Compliance Notice:</strong> Your personal information is protected under Canada's PIPEDA law.
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-12">
                    {onBack && (
                        <button onClick={onBack} className="px-8 py-3 font-bold text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition shadow-md">
                            ← Back
                        </button>
                    )}
                    <button type="button" onClick={handleNext} className="px-12 py-3 bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white font-extrabold rounded-xl shadow-lg hover:brightness-110 transition transform hover:-translate-y-0.5">
                        Next Step →
                    </button>
                </div>
            </form>
        </div>
    );
};

// Reusable Fields
const Field = ({ label, icon, value, onChange, ...props }: any) => (
    <div>
        <label className="mb-2 flex items-center gap-2 font-semibold text-black">{icon} {label}</label>
        <input value={value} onChange={onChange} {...props} className="w-full rounded-lg border border-gray-300 px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 shadow-sm transition" />
    </div>
);

const SelectField = ({ label, icon, value, onChange, options, required }: any) => (
    <div>
        <label className="mb-2 flex items-center gap-2 font-semibold text-black">{icon} {label}</label>
        <select value={value} onChange={onChange} required={required} className="w-full rounded-lg border border-gray-300 px-5 py-3 text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 shadow-sm transition">
            <option disabled value="">Select {label.toLowerCase()}</option>
            {options.map((opt: any, i: number) =>
                typeof opt === "string" ? (
                    <option key={i} value={opt}>{opt}</option>
                ) : (
                    <option key={i} value={opt.value}>{opt.label}</option>
                )
            )}
        </select>
    </div>
);

const TextAreaField = ({ label, icon, value, onChange, ...props }: any) => (
    <div>
        <label className="mb-2 flex items-center gap-2 font-semibold text-black">{icon} {label}</label>
        <textarea value={value} onChange={onChange} {...props} className="w-full rounded-lg border border-gray-300 px-5 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 shadow-sm transition" />
        {props.helperText && <p className="mt-1 text-xs text-gray-600 select-none">{props.helperText}</p>}
    </div>
);

export default Step1BasicInfo;
