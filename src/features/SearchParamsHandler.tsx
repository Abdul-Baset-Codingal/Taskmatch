// SearchParamsHandler.tsx
"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
    onOpenClientModal: () => void;
};

const SearchParamsHandler: React.FC<Props> = ({ onOpenClientModal }) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const shouldOpen = searchParams.get("openClientLogin");
        if (shouldOpen === "true") {
            onOpenClientModal();
        }
    }, [searchParams, onOpenClientModal]);

    return null; // This component only handles side effects, no UI
};

export default SearchParamsHandler;
