// components/GlobalMessengerWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import GlobalMessenger from "./GlobalMessenger";

const GlobalMessengerWrapper = () => {
    const pathname = usePathname();

    // List of routes where GlobalMessenger should NOT appear
    const excludedRoutes = [
        '/browse-tasks',
        '/dashboard/tasker',
        '/dashboard/client',
        '/authentication'
    ];

    // Check if current path starts with any excluded route
    const shouldHide = excludedRoutes.some(route =>
        pathname?.startsWith(route)
    );

    if (shouldHide) {
        return null;
    }

    return <GlobalMessenger />;
};

export default GlobalMessengerWrapper;