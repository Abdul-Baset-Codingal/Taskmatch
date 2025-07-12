/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, ChangeEvent } from "react";
import { FaLock, FaFileAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setStep3 } from "@/features/form/formSlice";

type Props = {
    onNext: () => void;
    onBack: () => void;
};

const Step3VerificationCredentials = ({ onNext, onBack }: Props) => {
    const dispatch = useDispatch();

    const [govID, setGovID] = useState<File | null>(null);
    const [certifications, setCertifications] = useState<File[]>([]);
    const [sin, setSin] = useState("");
    const [backgroundCheckConsent, setBackgroundCheckConsent] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);

    const handleGovIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setGovID(e.target.files[0]);
    };

    const handleCertificationsChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setCertifications(Array.from(e.target.files));
    };

    const uploadToImgBB = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        return data.data.url; // ✅ return uploaded image URL
    };

    const handleNext = async () => {
        try {
            let govIDUrl = "";
            let certUrls: string[] = [];

            if (govID) {
                govIDUrl = await uploadToImgBB(govID); // ✅ Upload and get URL
            }

            if (certifications.length > 0) {
                certUrls = await Promise.all(certifications.map(uploadToImgBB));
            }

            const payload = {
                govID: govIDUrl, // ✅ now it's a string URL
                certifications: certUrls,
                sin,
                backgroundCheckConsent,
                hasInsurance,
            };

            dispatch(setStep3(payload)); // ✅ Now safe for Redux
            onNext();
        } catch (err) {
            console.error("File upload failed", err);
        }
    };


    return (
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-black">
            <h2 className="text-3xl font-semibold flex items-center gap-3 mb-8 text-[#1A4F93]">
                <FaLock /> Verification & Credentials
            </h2>

            <p className="mb-10 text-gray-700 max-w-full">
                Security & Trust<br />
                We require verification of your identity and qualifications to build trust with customers.
                All documents are securely stored and handled according to Canada's PIPEDA regulations.
            </p>

            <div className="mb-8 w-full max-w-full">
                <label className="block mb-3 font-semibold text-black text-lg w-full">
                    Government-Issued ID *
                </label>
                <p className="mb-2 text-gray-600">
                    Upload a valid Canadian government-issued photo ID (driver's license, passport, or provincial ID)
                </p>
                <label
                    htmlFor="govIdUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1A4F93] transition relative"
                >
                    <FaFileAlt className="text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-500 mb-1">
                        Drag & drop your ID document or click to browse
                    </span>
                    <span className="text-gray-400 text-sm">
                        Supported formats: JPG, PNG, or PDF (max 5MB)
                    </span>
                    <input
                        id="govIdUpload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleGovIdChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </label>
                {govID && (
                    <p className="mt-2 text-green-600 font-semibold">Selected file: {govID.name}</p>
                )}
            </div>

            <div className="mb-8 w-full max-w-full">
                <label className="block mb-3 font-semibold text-black text-lg w-full">
                    Social Insurance Number (SIN) *
                </label>
                <input
                    type="text"
                    placeholder="000-000-000"
                    maxLength={11}
                    value={sin}
                    onChange={(e) => setSin(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A4F93] transition"
                    required
                />
                <p className="mt-1 text-gray-500 text-sm">
                    Required for tax purposes. Your SIN is encrypted and securely stored as required by Canadian regulations.
                </p>
            </div>

            <div className="mb-8 w-full max-w-full">
                <label className="block mb-3 font-semibold text-black text-lg w-full">
                    Professional Certifications
                </label>
                <p className="mb-2 text-gray-600">
                    Upload any relevant certifications, licenses, or qualifications for your services
                </p>
                <label
                    htmlFor="certificationsUpload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1A4F93] transition relative"
                >
                    <FaFileAlt className="text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-500 mb-1">
                        Drag & drop your certification documents or click to browse
                    </span>
                    <span className="text-gray-400 text-sm">
                        Supported formats: JPG, PNG, or PDF (max 5MB)
                    </span>
                    <input
                        id="certificationsUpload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple
                        onChange={handleCertificationsChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </label>
                {certifications.length > 0 && (
                    <ul className="mt-2 text-green-600 font-semibold max-w-full list-disc list-inside">
                        {certifications.map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-8 w-full max-w-full">
                <label className="inline-flex items-center gap-2 cursor-pointer w-full">
                    <input
                        type="checkbox"
                        checked={backgroundCheckConsent}
                        onChange={() => setBackgroundCheckConsent(!backgroundCheckConsent)}
                        className="form-checkbox rounded text-[#1A4F93]"
                        required
                    />
                    <span className="text-black font-semibold w-full">
                        I consent to a criminal background check as required by provincial regulations
                    </span>
                </label>
            </div>

            <div className="mb-8 w-full max-w-full">
                <label className="inline-flex items-center gap-2 cursor-pointer w-full">
                    <input
                        type="checkbox"
                        checked={hasInsurance}
                        onChange={() => setHasInsurance(!hasInsurance)}
                        className="form-checkbox rounded text-[#1A4F93]"
                    />
                    <span className="text-black font-semibold w-full">I have liability insurance for my services</span>
                </label>
            </div>

            <div className="mt-12 p-6 bg-red-50 border-l-6 border-red-600 rounded-xl text-red-700 font-semibold max-w-full">
                🌽 <strong>PIPEDA Compliance Notice:</strong> TaskMatch complies with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA). We're committed to:
                <ul className="list-disc list-inside mt-2 space-y-1 font-normal text-red-800">
                    <li>Collecting only necessary information with your consent</li>
                    <li>Securing your data with industry-standard encryption</li>
                    <li>Providing access to your information upon request</li>
                    <li>Only using your information for the purposes described in our Privacy Policy</li>
                    <li>Storing data on Canadian servers, when possible</li>
                </ul>
            </div>

            <div className="flex justify-between mt-10">
                <button
                    onClick={onBack}
                    type="button"
                    className="px-10 py-3 font-bold border-2 border-[#1A4F93] rounded-xl text-[#1A4F93] hover:bg-[#1A4F93] hover:text-white transition"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    type="button"
                    className="px-12 py-3 bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white font-extrabold rounded-xl shadow-lg hover:brightness-110 transition transform hover:-translate-y-0.5"
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
};

export default Step3VerificationCredentials;
