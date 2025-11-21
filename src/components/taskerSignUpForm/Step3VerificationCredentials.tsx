/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { FaLock, FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setStep3 } from "@/features/form/formSlice";
import { RootState } from "@/app/store";
import { toast } from "react-toastify";

type Props = {
    onNext: () => void;
    onBack: () => void;
};

type Step3Data = {
    idType?: "passport" | "governmentID";
    sin?: string;
    backgroundCheckConsent?: boolean;
    hasInsurance?: boolean;
    passportUrl?: string;
    governmentIdFront?: string;
    governmentIdBack?: string;
    certifications?: string[];
    issueDate?: string;  // String for form, convert to Date in backend
    expiryDate?: string;
} | null;

const Step3VerificationCredentials = ({ onNext, onBack }: Props) => {
    const dispatch = useDispatch();
    const step3Data = useSelector((state: RootState) => state.form.step3 as Step3Data);

    const [idType, setIdType] = useState<"passport" | "governmentID" | null>(null);
    const [passport, setPassport] = useState<File | null>(null);
    const [govIDFront, setGovIDFront] = useState<File | null>(null);
    const [govIDBack, setGovIDBack] = useState<File | null>(null);
    const [certifications, setCertifications] = useState<File[]>([]);
    const [sin, setSin] = useState("");
    const [backgroundCheckConsent, setBackgroundCheckConsent] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);
    const [issueDate, setIssueDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    // States for persisted URLs
    const [passportUrl, setPassportUrl] = useState<string>("");
    const [govIDFrontUrl, setGovIDFrontUrl] = useState<string>("");
    const [govIDBackUrl, setGovIDBackUrl] = useState<string>("");
    const [certUrls, setCertUrls] = useState<string[]>([]);

    useEffect(() => {
        if (step3Data) {
            setIdType(step3Data.idType || null);
            setSin(step3Data.sin || "");
            setBackgroundCheckConsent(step3Data.backgroundCheckConsent || false);
            setHasInsurance(step3Data.hasInsurance || false);
            setPassportUrl(step3Data.passportUrl || "");
            setGovIDFrontUrl(step3Data.governmentIdFront || "");
            setGovIDBackUrl(step3Data.governmentIdBack || "");
            setCertUrls(step3Data.certifications || []);
            setIssueDate(step3Data.issueDate || "");
            setExpiryDate(step3Data.expiryDate || "");
        }
    }, [step3Data]);

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

    const validateDateInput = (value: string): string => {
        // Enforce YYYY-MM-DD format strictly
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
            // If not full format, allow partial input but limit year to 4 digits
            const parts = value.split('-');
            if (parts[0] && parts[0].length > 4) {
                // Truncate year to 4 digits
                parts[0] = parts[0].slice(0, 4);
                return parts.join('-');
            }
        }
        return value;
    };

    const handleIssueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const validatedValue = validateDateInput(rawValue);
        setIssueDate(validatedValue);
    };

    const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const validatedValue = validateDateInput(rawValue);
        setExpiryDate(validatedValue);
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
        if (!data.success) {
            throw new Error(data.error?.message || 'Upload failed');
        }
        return data.data.url;
    };

    const handleNext = async () => {
        if (!idType) {
            toast.error("Please select an ID type.");
            return;
        }
        // if (!sin.trim()) {
        //     toast.error("SIN is required.");
        //     return;
        // }
        if (!backgroundCheckConsent) {
            toast.error("You must consent to the background check.");
            return;
        }

        // Date validation
        if (issueDate && expiryDate && new Date(expiryDate) <= new Date(issueDate)) {
            toast.error("Expiry date must be after issue date.");
            return;
        }

        // ID upload validation
        if (idType === "passport" && !passport && !passportUrl) {
            toast.error("Please upload your passport.");
            return;
        }
        if (idType === "governmentID" && ((!govIDFront && !govIDFrontUrl) || (!govIDBack && !govIDBackUrl))) {
            toast.error("Please upload front and back of your government ID.");
            return;
        }

        // Optional: Require dates if ID uploaded
        if ((idType === "passport" && (passport || passportUrl)) || (idType === "governmentID" && ((govIDFront || govIDFrontUrl) || (govIDBack || govIDBackUrl)))) {
            if (!issueDate || !expiryDate) {
                toast.error("Please provide issue and expiry dates for your ID.");
                return;
            }
        }

        try {
            let finalPassportUrl = passportUrl;
            let finalGovIDFrontUrl = govIDFrontUrl;
            let finalGovIDBackUrl = govIDBackUrl;
            let finalCertUrls = certUrls;

            if (idType === "passport" && passport) {
                finalPassportUrl = await uploadToImgBB(passport);
            } else if (idType === "governmentID") {
                if (govIDFront) finalGovIDFrontUrl = await uploadToImgBB(govIDFront);
                if (govIDBack) finalGovIDBackUrl = await uploadToImgBB(govIDBack);
            }

            if (certifications.length > 0) {
                finalCertUrls = await Promise.all(certifications.map(uploadToImgBB));
            }

            const payload: any = {
                idType,
                sin,
                backgroundCheckConsent,
                hasInsurance,
                certifications: finalCertUrls,
                issueDate,
                expiryDate,
            };

            // Add ID URLs based on type
            if (idType === "passport") {
                payload.passportUrl = finalPassportUrl;
            } else if (idType === "governmentID") {
                payload.governmentIdFront = finalGovIDFrontUrl;
                payload.governmentIdBack = finalGovIDBackUrl;
            }

            dispatch(setStep3(payload));
            onNext();
        } catch (err) {
            console.error("File upload failed", err);
            alert("Upload failed. Please try again.");
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

                {/* Issue and Expiry Dates - Shown after ID selection */}
                {idType && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Issue Date *</label>
                            <input
                                type="date"
                                value={issueDate}
                                onChange={handleIssueDateChange}
                                className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A4F93] transition"
                                pattern="\d{4}-\d{2}-\d{2}"
                                title="Enter date in YYYY-MM-DD format"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Expiry Date *</label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                                className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A4F93] transition"
                                pattern="\d{4}-\d{2}-\d{2}"
                                title="Enter date in YYYY-MM-DD format"
                            />
                        </div>
                    </div>
                )}

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
                        {passportUrl && !passport && (
                            <p className="mt-2 text-blue-600 font-semibold">
                                Already uploaded: <a href={passportUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                            </p>
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
                            {govIDFrontUrl && !govIDFront && (
                                <p className="mt-2 text-blue-600 font-semibold">
                                    Already uploaded: <a href={govIDFrontUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                                </p>
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
                            {govIDBackUrl && !govIDBack && (
                                <p className="mt-2 text-blue-600 font-semibold">
                                    Already uploaded: <a href={govIDBackUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* <div className="mb-8 w-full max-w-full">
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
            </div> */}

            <div className="mb-8 w-full max-w-full">
                <label className="block mb-3 font-semibold text-black text-lg w-full">
                    Proof of Work Eligibility
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
                {certUrls.length > 0 && certifications.length === 0 && (
                    <ul className="mt-2 text-blue-600 font-semibold max-w-full list-disc list-inside">
                        {certUrls.map((url, idx) => (
                            <li key={idx}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="underline">View Certification {idx + 1}</a>
                            </li>
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