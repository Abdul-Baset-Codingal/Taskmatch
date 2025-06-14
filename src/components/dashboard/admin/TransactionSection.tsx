"use client";

import React from "react";
import Image from "next/image";
import { FaEye, FaPrint, FaExclamationTriangle } from "react-icons/fa";

type TransactionStatus = "Completed" | "Processing" | "Failed";

type Transaction = {
  id: string;
  user: string;
  image: string;
  task: string;
  amount: string;
  status: TransactionStatus;
  date: string;
};

const transactions: Transaction[] = [
  {
    id: "#TRX-9384",
    user: "John Doe",
    image: "/Images/clientImage1.jpg",
    task: "Kitchen Remodel",
    amount: "$1,250.00",
    status: "Completed",
    date: "Apr 20, 2024",
  },
  {
    id: "#TRX-9383",
    user: "Jane Smith",
    image: "/Images/clientImage2.jpg",
    task: "Home Cleaning",
    amount: "$120.00",
    status: "Processing",
    date: "Apr 19, 2024",
  },
  {
    id: "#TRX-9382",
    user: "David Clark",
    image: "/Images/clientImage3.jpg",
    task: "Furniture Delivery",
    amount: "$350.00",
    status: "Failed",
    date: "Apr 18, 2024",
  },
  {
    id: "#TRX-9381",
    user: "Sarah Williams",
    image: "/Images/clientImage5.jpg",
    task: "Pet Sitting",
    amount: "$75.00",
    status: "Completed",
    date: "Apr 17, 2024",
  },
];

const statusStyles: Record<TransactionStatus, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
};

const TransactionSection = () => {
  return (
    <section className="max-w-7xl mx-auto lg:px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-3xl font-bold text-gray-800">
          Recent Transactions
        </h2>

        <div className="flex flex-wrap gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition w-full sm:w-auto">
            Filter
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition w-full sm:w-auto">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-[1100px] w-full text-left text-sm text-gray-800">
          <thead className="bg-gray-100 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((trx) => (
              <tr
                key={trx.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium">{trx.id}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                    <Image
                      src={trx.image}
                      alt={trx.user}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>{trx.user}</span>
                </td>
                <td className="px-6 py-4">{trx.task}</td>
                <td className="px-6 py-4 font-semibold">{trx.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${
                      statusStyles[trx.status]
                    }`}
                  >
                    {trx.status}
                  </span>
                </td>
                <td className="px-6 py-4">{trx.date}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4 text-lg">
                    <button className="text-blue-600 hover:text-blue-800 transition">
                      <FaEye />
                    </button>
                    {trx.status === "Failed" ? (
                      <button className="text-yellow-600 hover:text-yellow-800 transition">
                        <FaExclamationTriangle />
                      </button>
                    ) : (
                      <button className="text-gray-700 hover:text-gray-900 transition">
                        <FaPrint />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionSection;
