// app/blog/page.tsx
import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
    title: "Blog | Taskallo",
    description: "Insights, stories, and tips from the Taskallo community.",
    alternates: {
        canonical: "https://www.taskallo.com/blog",
    },
};

export default function BlogPage() {
    return <BlogPageClient />;
}