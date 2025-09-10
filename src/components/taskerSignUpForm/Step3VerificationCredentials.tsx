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

    const [idType, setIdType] = useState<"passport" | "governmentID" | null>(null);
    const [passport, setPassport] = useState<File | null>(null);
    const [govIDFront, setGovIDFront] = useState<File | null>(null);
    const [govIDBack, setGovIDBack] = useState<File | null>(null);
    const [certifications, setCertifications] = useState<File[]>([]);
    const [sin, setSin] = useState("");
    const [backgroundCheckConsent, setBackgroundCheckConsent] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);

    const handlePassportChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setPassport(e.target.files[0]);
    };

    const handleGovIDFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setGovIDFront(e.target.files[0]);
    };

    const handleGovIDBackChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setGovIDBack(e.target.files[0]);
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
        return data.data.url;
    };

    const handleNext = async () => {
        try {
            let govIDUrl = "";
            let govIDBackUrl = "";
            let certUrls: string[] = [];

            if (idType === "passport" && passport) {
                govIDUrl = await uploadToImgBB(passport);
            } else if (idType === "governmentID" && govIDFront && govIDBack) {
                govIDUrl = await uploadToImgBB(govIDFront);
                govIDBackUrl = await uploadToImgBB(govIDBack);
            }

            if (certifications.length > 0) {
                certUrls = await Promise.all(certifications.map(uploadToImgBB));
            }

            const payload = {
                idType,
                govID: govIDUrl,
                govIDBack: govIDBackUrl,
                certifications: certUrls,
                sin,
                backgroundCheckConsent,
                hasInsurance,
            };

            dispatch(setStep3(payload));
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
                    Select the type of ID you wish to upload *
                </label>

                <div className="flex gap-4 mb-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="idType"
                            value="passport"
                            checked={idType === "passport"}
                            onChange={() => setIdType("passport")}
                            className="form-radio text-[#1A4F93]"
                        />
                        <span>Passport</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="idType"
                            value="governmentID"
                            checked={idType === "governmentID"}
                            onChange={() => setIdType("governmentID")}
                            className="form-radio text-[#1A4F93]"
                        />
                        <span>Government ID (Front & Back)</span>
                    </label>
                </div>

                {idType === "passport" && (
                    <div>
                        <label
                            htmlFor="passportUpload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1A4F93] transition relative"
                        >
                            <FaFileAlt className="text-4xl text-gray-400 mb-2" />
                            <span className="text-gray-500 mb-1">
                                Drag & drop your passport or click to browse
                            </span>
                            <span className="text-gray-400 text-sm">
                                Supported formats: JPG, PNG, or PDF (max 5MB)
                            </span>
                            <input
                                id="passportUpload"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handlePassportChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                        {passport && (
                            <p className="mt-2 text-green-600 font-semibold">Selected file: {passport.name}</p>
                        )}
                    </div>
                )}

                {idType === "governmentID" && (
                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Front of Government ID
                            </label>
                            <label
                                htmlFor="govIDFrontUpload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1A4F93] transition relative"
                            >
                                <FaFileAlt className="text-4xl text-gray-400 mb-2" />
                                <span className="text-gray-500 mb-1">
                                    Drag & drop the front of your ID or click to browse
                                </span>
                                <span className="text-gray-400 text-sm">
                                    Supported formats: JPG, PNG, or PDF (max 5MB)
                                </span>
                                <input
                                    id="govIDFrontUpload"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleGovIDFrontChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>
                            {govIDFront && (
                                <p className="mt-2 text-green-600 font-semibold">Selected file: {govIDFront.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Back of Government ID
                            </label>
                            <label
                                htmlFor="govIDBackUpload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1A4F93] transition relative"
                            >
                                <FaFileAlt className="text-4xl text-gray-400 mb-2" />
                                <span className="text-gray-500 mb-1">
                                    Drag & drop the back of your ID or click to browse
                                </span>
                                <span className="text-gray-400 text-sm">
                                    Supported formats: JPG, PNG, or PDF (max 5MB)
                                </span>
                                <input
                                    id="govIDBackUpload"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleGovIDBackChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>
                            {govIDBack && (
                                <p className="mt-2 text-green-600 font-semibold">Selected file: {govIDBack.name}</p>
                            )}
                        </div>
                    </div>
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