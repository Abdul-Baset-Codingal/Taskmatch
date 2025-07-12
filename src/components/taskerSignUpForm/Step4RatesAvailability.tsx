/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FaCity, FaDollarSign, } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setStep4 } from "@/features/form/formSlice";

type Props = {
    onNext: () => void;
    onBack: () => void;
};

const serviceAreasOptions = [
    "Toronto & Greater Toronto Area (GTA)",
    "Downtown Toronto",
    "North Toronto",
    "East Toronto",
    "West Toronto",
    "Etobicoke",
    "Scarborough",
    "North York",
    "York",
    "Mississauga",
    "Brampton",
    "Markham",
    "Richmond Hill",
    "Vaughan",
    "Oakville",
    "Burlington",
    "Milton",
    "Pickering",
    "Ajax",
    "Whitby",
    "Oshawa",
    "Ottawa",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Kitchener-Waterloo",
    "London",
];

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const noticePeriods = [
    "Same day",
    "1 day",
    "2 days",
    "3 days",
    "1 week",
    "2 weeks",
];

const Step4RatesAvailability = ({ onNext, onBack }: Props) => {
    const [pricingType, setpricingType] = useState<
        "hourly" | "fixed" | "both" | ""
    >("");
    const [chargesGST, setChargesGST] = useState(false);
    const [availability, setAvailability] = useState<
        Record<
            string,
            { available: boolean; from: string; to: string }
        >
    >(
        daysOfWeek.reduce((acc, day) => {
            acc[day] = { available: false, from: "09:00", to: "17:00" };
            return acc;
        }, {} as Record<string, { available: boolean; from: string; to: string }>)
    );
    const [noticePeriod, setNoticePeriod] = useState("");
    const [serviceAreas, setServiceAreas] = useState<string[]>([]);
    const dispatch = useDispatch();

    // Handle availability toggling
    const toggleDayAvailability = (day: string) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                available: !prev[day].available,
            },
        }));
    };

    // Handle from/to time change
    const handleTimeChange = (
        day: string,
        field: "from" | "to",
        value: string
    ) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    // Toggle Service Area
    const toggleServiceArea = (area: string) => {
        setServiceAreas((prev) =>
            prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
        );
    };

    const handleNext = () => {
        const formattedAvailability = Object.entries(availability).map(
            ([day, { available, from, to }]) => ({
                day,
                available,
                from,
                to,
            })
        );

        const payload = {
            pricingType,
            chargesGST,
            availability: formattedAvailability,
            noticePeriod,
            serviceAreas,
        };

        dispatch(setStep4(payload));
        onNext();
    };


    return (
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-black">
            <h2 className="text-3xl font-semibold flex items-center gap-3 mb-8 text-[#1A4F93]">
                <FaDollarSign /> Rates & Availability
            </h2>

            <section className="w-full max-w-7xl mx-auto mb-10 ">
                <label className="block text-lg font-semibold mb-6">How do you want to structure your pricing? *</label>

                <div className="flex flex-col sm:flex-row gap-6 w-full">
                    {[
                        {
                            value: "hourly",
                            label: "Hourly Rate",
                            description: "Charge by the hour for your services",
                            popular: true,
                        },
                        {
                            value: "fixed",
                            label: "Fixed Price",
                            description: "Set prices for specific services",
                            popular: false,
                        },
                        {
                            value: "both",
                            label: "Both Options",
                            description: "Flexibility for different services",
                            popular: false,
                        },
                    ].map(({ value, label, description, popular }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setpricingType(value as any)}
                            className={`
          flex-1
          border
          rounded-xl
          p-6
          cursor-pointer
          transition
          flex
          flex-col
          justify-between
          hover:shadow-lg
          hover:border-[#1A4F93]
          ${pricingType === value
                                    ? "border-[#1A4F93] bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white shadow-lg"
                                    : "border-gray-300 bg-gray-50 text-gray-900"
                                }
        `}
                            style={{ minHeight: "170px" }}
                        >
                            {/* Top row: label + badge */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xl font-semibold">{label}</span>
                                {popular && (
                                    <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold select-none whitespace-nowrap">
                                        Most Popular
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed">{description}</p>
                        </button>
                    ))}
                </div>
            </section>



            {/* GST/HST */}
            <section className="mb-10 max-w-3xl">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={chargesGST}
                        onChange={() => setChargesGST(!chargesGST)}
                        className="form-checkbox rounded text-[#1A1A1A] mr-3"
                    />
                    <span>Do you charge GST/HST? *</span>
                </label>
            </section>

            {/* Availability */}
            <section className="mb-10">
                <label className="block text-lg font-semibold mb-4">Availability *</label>
                <div className="overflow-x-auto max-w-full border border-gray-300 rounded-xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4">Day</th>
                                <th className="py-3 px-4">Available</th>
                                <th className="py-3 px-4">From</th>
                                <th className="py-3 px-4">To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daysOfWeek.map((day) => {
                                const dayData = availability[day];
                                return (
                                    <tr key={day} className="border-t border-gray-200">
                                        <td className="py-3 px-4 font-semibold">{day}</td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                checked={dayData.available}
                                                onChange={() => toggleDayAvailability(day)}
                                                className="form-checkbox rounded text-[#1A1A1A]"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="time"
                                                value={dayData.from}
                                                onChange={(e) =>
                                                    handleTimeChange(day, "from", e.target.value)
                                                }
                                                disabled={!dayData.available}
                                                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="time"
                                                value={dayData.to}
                                                onChange={(e) =>
                                                    handleTimeChange(day, "to", e.target.value)
                                                }
                                                disabled={!dayData.available}
                                                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Advance Notice Required */}
            <section className="mb-10 max-w-md">
                <label className="block text-lg font-semibold mb-3">
                    Advance Notice Required *
                </label>
                <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] hover:border-[#1A1A1A] transition"
                >
                    <option value="">Select notice period</option>
                    {noticePeriods.map((period) => (
                        <option key={period} value={period}>
                            {period}
                        </option>
                    ))}
                </select>
            </section>

            {/* Service Areas */}
            <section className="mb-10 max-w-7xl">
                <label className=" text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaCity /> Service Areas *
                </label>
                <p className="text-gray-700 mb-4">
                    Select the regions where you're willing to work:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto border border-gray-300 rounded-xl p-4">
                    {serviceAreasOptions.map((area) => {
                        const selected = serviceAreas.includes(area);
                        return (
                            <label
                                key={area}
                                className={`flex items-center gap-3 cursor-pointer rounded-lg px-4 py-2 border ${selected
                                    ? "bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white border-transparent"
                                    : "border-gray-300 text-black hover:bg-gray-100"
                                    } transition`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => toggleServiceArea(area)}
                                    className="form-checkbox rounded text-black"
                                />
                                <span className="select-none">{area}</span>
                            </label>
                        );
                    })}
                </div>

                <p className="mt-2 text-gray-500 italic text-sm">
                    💡 Tip: Select multiple areas to increase your earning opportunities.
                    You can always adjust your service areas later in your profile settings.
                </p>
            </section>

            {/* Buttons */}
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

export default Step4RatesAvailability;
