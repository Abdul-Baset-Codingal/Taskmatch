/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUser, FaSave, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/shared/Navbar";

const CompleteTaskerProfile = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const missingFieldsQuery = searchParams?.get("fields") || "";
    const missingFields = missingFieldsQuery.split(",").filter(Boolean);

    const [formData, setFormData] = useState({
        about: "",
        profilePicture: "",
        dob: "",
        yearsOfExperience: "",
        categories: "",
        skills: "",
        language: "",
        travelDistance: "",
        idType: "",
        governmentId: "",
        govIDBack: "", // Text for URL (upload file separately if needed)
        qualifications: "",
        services: "[]", // Default to empty array JSON to avoid parse error
        certifications: "",
        backgroundCheckConsent: false,
        hasInsurance: false,
        availability: "[]", // Default to empty array JSON to avoid parse error
        serviceAreas: "",
    });
    const [userData, setUserData] = useState<any>(null); // Prefill from user
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch user data for prefill
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    setUserId(data.user._id);

                    // Prefill form with existing data
                    setFormData((prev) => ({
                        ...prev,
                        about: data.user.about || "",
                        profilePicture: data.user.profilePicture || "",
                        dob: data.user.dob ? new Date(data.user.dob).toISOString().split("T")[0] : "",
                        yearsOfExperience: data.user.yearsOfExperience || "",
                        categories: data.user.categories?.join(", ") || "",
                        skills: data.user.skills?.join(", ") || "",
                        language: data.user.language || "",
                        travelDistance: data.user.travelDistance || "",
                        idType: data.user.idType || "",
                        governmentId: data.user.governmentId || "",
                        govIDBack: data.user.govIDBack || "",
                        qualifications: data.user.qualifications?.join(", ") || "",
                        services: data.user.services ? JSON.stringify(data.user.services) : "[]",
                        certifications: data.user.certifications?.join(", ") || "",
                        backgroundCheckConsent: data.user.backgroundCheckConsent || false,
                        hasInsurance: data.user.hasInsurance || false,
                        availability: data.user.availability ? JSON.stringify(data.user.availability) : "[]",
                        serviceAreas: data.user.serviceAreas?.join(", ") || "",
                    }));
                } else {
                    let errData;
                    try {
                        errData = await response.json();
                    } catch {
                        errData = { message: "Invalid response from server" };
                    }
                    setError(errData.message || "Failed to load user data. Please log in again.");
                    router.push("/authentication");
                }
            } catch (err) {
                setError("Error fetching user data.");
            }
        };

        fetchUserData();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value, type } = target;
        const checked = type === "checkbox" ? (target as HTMLInputElement).checked : false;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const parseJsonSafely = async (response: Response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`Invalid response (not JSON): ${text.substring(0, 200)}...`);
        }
        return response.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError("User ID not found.");
            return;
        }

        setLoading(true);
        setError(null);

        // Convert comma-separated strings to arrays where needed
        let submitData;
        try {
            submitData = {
                ...formData,
                categories: formData.categories.split(",").map((s) => s.trim()).filter(Boolean),
                skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
                qualifications: formData.qualifications.split(",").map((s) => s.trim()).filter(Boolean),
                certifications: formData.certifications.split(",").map((s) => s.trim()).filter(Boolean),
                serviceAreas: formData.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
                // Parse JSON fields if needed (e.g., services, availability)
                services: formData.services ? JSON.parse(formData.services) : [],
                availability: formData.availability ? JSON.parse(formData.availability) : [],
            };
        } catch (parseErr) {
            setError("Invalid JSON in services or availability. Please check your input and try again.");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Update user profile using the dedicated updateProfile endpoint (PUT)
            const updateResponse = await fetch(`http://localhost:5000/api/auth/updateProfile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(submitData),
            });

            if (!updateResponse.ok) {
                let errData;
                try {
                    errData = await parseJsonSafely(updateResponse);
                } catch {
                    const text = await updateResponse.text();
                    errData = { message: text || "Update failed" };
                }
                throw new Error(errData.message || "Update failed");
            }

            // Step 2: Switch to tasker role using the switchRole endpoint (PATCH /users/:id)
            const switchResponse = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ role: "tasker" }),
            });

            if (!switchResponse.ok) {
                let errData;
                try {
                    errData = await parseJsonSafely(switchResponse);
                } catch {
                    const text = await switchResponse.text();
                    errData = { message: text || "Role switch failed" };
                }
                throw new Error(errData.message || "Role switch failed");
            }

            // Success: Redirect to tasker dashboard
            router.push("/dashboard/tasker");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render fields dynamically based on missingFields or all
    const renderField = (field: string) => {
        switch (field) {
            case "about":
                return (
                    <textarea
                        name="about"
                        placeholder="Tell us about yourself (required for taskers)"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                );
            case "profilePicture":
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            name="profilePicture"
                            placeholder="Profile Picture URL"
                            value={formData.profilePicture}
                            onChange={handleInputChange}
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {formData.profilePicture && (
                            <Image
                                src={formData.profilePicture}
                                alt="Preview"
                                width={50}
                                height={50}
                                className="rounded-full object-cover"
                            />
                        )}
                    </div>
                );
            case "dob":
                return (
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "yearsOfExperience":
                return (
                    <input
                        type="number"
                        name="yearsOfExperience"
                        placeholder="Years of experience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "categories":
            case "skills":
            case "qualifications":
            case "certifications":
            case "serviceAreas":
                return (
                    <input
                        type="text"
                        name={field}
                        placeholder={`Comma-separated ${field} (e.g., Plumbing, Electrical)`}
                        value={String(formData[field as keyof typeof formData] ?? "")}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "language":
                return (
                    <input
                        type="text"
                        name="language"
                        placeholder="Preferred language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "travelDistance":
                return (
                    <input
                        type="text"
                        name="travelDistance"
                        placeholder="Max travel distance (e.g., 50km)"
                        value={formData.travelDistance}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "idType":
                return (
                    <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select ID Type</option>
                        <option value="passport">Passport</option>
                        <option value="governmentID">Government ID</option>
                    </select>
                );
            case "governmentId":
                return (
                    <input
                        type="text"
                        name="governmentId"
                        placeholder="Government ID Number"
                        value={formData.governmentId}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "govIDBack":
                return (
                    <input
                        type="file"
                        name="govIDBack"
                        onChange={(e) => {
                            // Handle file upload logic here (e.g., upload to cloud and set URL)
                            console.log("File selected:", e.target.files?.[0]);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                );
            case "services":
                return (
                    <textarea
                        name="services"
                        placeholder='Services as JSON array, e.g., [{"title": "Plumbing", "description": "Fix leaks", "hourlyRate": 50, "estimatedDuration": "2h"}]'
                        value={formData.services}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                );
            case "availability":
                return (
                    <textarea
                        name="availability"
                        placeholder='Availability as JSON array, e.g., [{"day": "Monday", "from": "9:00", "to": "17:00"}]'
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                );
            case "backgroundCheckConsent":
                return (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="backgroundCheckConsent"
                            checked={formData.backgroundCheckConsent}
                            onChange={handleInputChange}
                            className="rounded"
                            required
                        />
                        I consent to background check
                    </label>
                );
            case "hasInsurance":
                return (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="hasInsurance"
                            checked={formData.hasInsurance}
                            onChange={handleInputChange}
                            className="rounded"
                            required
                        />
                        I have insurance
                    </label>
                );
            default:
                return <p className="text-gray-500">Field: {field}</p>;
        }
    };

    const allRequiredFields = [
        "about",
        "profilePicture",
        "dob",
        "yearsOfExperience",
        "categories",
        "skills",
        "language",
        "travelDistance",
        "idType",
        "governmentId",
        "govIDBack",
        "qualifications",
        "services",
        "certifications",
        "backgroundCheckConsent",
        "hasInsurance",
        "availability",
        "serviceAreas",
    ];

    const fieldsToRender = missingFields.length > 0 ? missingFields : allRequiredFields;

    if (!userData) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <FaUser /> Complete Your Tasker Profile
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Fill out the required information to become a tasker. Once complete, you'll be switched to Tasker mode.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {fieldsToRender.map((field) => (
                                <div key={field} className="border-b pb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                        {field.replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    {renderField(field)}
                                </div>
                            ))}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 color1 text-white py-3 px-4 rounded-md  disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save & Switch to Tasker
                                    </>
                                )}
                            </button>
                        </form>
                        {error && <p className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteTaskerProfile;