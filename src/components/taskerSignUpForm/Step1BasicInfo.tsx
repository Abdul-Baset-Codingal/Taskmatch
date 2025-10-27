/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep1 } from "@/features/form/formSlice";
import { RootState } from "@/app/store";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaRegSmile,
    FaCamera,
    FaLock,
    FaEyeSlash,
    FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Step1BasicInfo = ({
    onNext,
    onBack,
}: {
    onNext: () => void;
    onBack?: () => void;
}) => {
    interface Step1Data {
        firstName?: string;
        lastName?: string;
        password?: string;
        email?: string;
        phone?: string;
        dob?: string;
        address?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        language?: string;
        about?: string;
        travelDistance?: string;
        profilePicture?: string | null;
    }

    const dispatch = useDispatch();
    const step1Data = useSelector((state: RootState) => state.form.step1) as Partial<Step1Data> | null;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null); // Store ImgBB URL

    type FormDataType = {
        email: string;
        phone: string;
        dob: string;
        address: string;
        city: string;
        province: string;
        postalCode: string;
        language: string;
        about: string;
        travelDistance: string;
        profilePicture: File | null;
    };

    const [formData, setFormData] = useState<FormDataType>({
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
        profilePicture: null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (step1Data) {
            setFirstName(step1Data.firstName || "");
            setLastName(step1Data.lastName || "");
            setPassword(step1Data.password || "");
            setConfirmPassword(step1Data.password || "");
            setFormData({
                email: step1Data.email || "",
                phone: step1Data.phone || "",
                dob: step1Data.dob || "",
                address: step1Data.address || "",
                city: step1Data.city || "",
                province: step1Data.province || "",
                postalCode: step1Data.postalCode || "",
                language: step1Data.language || "",
                about: step1Data.about || "",
                travelDistance: step1Data.travelDistance || "",
                profilePicture: null, // No file to restore
            });
            const picUrl = step1Data.profilePicture || null;
            setProfilePictureUrl(picUrl);
            if (picUrl) {
                setPreview(picUrl);
            }
        }
    }, [step1Data]);

    const uploadToImgBB = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error.message || 'Image upload failed');
        }
        return data.data.url; // Return the ImgBB URL
    };

    const handleProfilePicChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Selected File:', file);
            const url = URL.createObjectURL(file); // For local preview
            setPreview(url);
            setFormData({ ...formData, profilePicture: file });

            try {
                const imageUrl = await uploadToImgBB(file); // Upload to ImgBB
                setProfilePictureUrl(imageUrl); // Store the URL
                console.log('Profile Picture URL:', imageUrl);
            } catch (err) {
                console.error('Profile Picture Upload Failed:', err);
                toast.error('Failed to upload profile picture');
                // Optionally revert preview and formData if upload fails
                setPreview(null);
                setFormData({ ...formData, profilePicture: null });
            }
        }
    };

    const validateForm = (): string | null => {
        if (!firstName.trim()) return 'First name is required';
        if (!lastName.trim()) return 'Last name is required';
        if (!password.trim()) return 'Password is required';
        if (!confirmPassword.trim()) return 'Confirm password is required';
        if (password !== confirmPassword) return 'Passwords do not match';
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.phone.trim()) return 'Phone is required';
        if (!formData.dob) return 'Date of birth is required';
        if (!formData.address.trim()) return 'Address is required';
        if (!formData.city.trim()) return 'City is required';
        if (!formData.province) return 'Province is required';
        if (!formData.postalCode.trim()) return 'Postal code is required';
        const aboutText = formData.about.trim();
        if (!aboutText || aboutText.length < 50) return 'About me must be at least 50 characters';
        if (!profilePictureUrl) return 'Profile picture is required';
        return null;
    };

    const handleNext = () => {
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        const finalData = {
            firstName,
            lastName,
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
            profilePicture: profilePictureUrl || '', // Send ImgBB URL
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

                    {/* Show required message if no preview */}
                    {!preview && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                            * Profile picture is required
                        </p>
                    )}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* First Name Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">First Name *</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1A4F93]">
                            <FaUser className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full outline-none text-black bg-transparent placeholder-gray-400"
                            />
                        </div>
                    </div>
                    {/* Last Name Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">Last Name *</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1A4F93]">
                            <FaUser className="text-gray-500 mr-3" />
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-black font-semibold mb-2">Confirm Password *</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1A4F93]">
                            <FaLock className="text-gray-500 mr-3" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {/* Error Message if passwords don't match */}
                        {confirmPassword && confirmPassword !== password && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
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



                <TextAreaField label="About Me" icon={<FaRegSmile />} required rows={5} minLength={100} placeholder="Tell customers about yourself..." helperText="Minimum 100 characters." value={formData.about} onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, about: e.target.value })} />





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