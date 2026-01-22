// // app/admin/blogs/page.tsx

// export default function BlogsPage() {
//     return (
//         <div className="container mx-auto py-6 px-4">
//             <BlogList />
//         </div>
//     );
// }

// // app/admin/blogs/create/page.tsx

// export default function CreateBlogPagg() {
//     return (
//         <div className="container mx-auto py-6 px-4">
//             <BlogForm />
//         </div>
//     );
// }

// // app/admin/blogs/[id]/edit/page.tsx

// interface EditBlogPageProps {
//     params: { id: string };
// }

// export default function EditBlogPage({ params }: EditBlogPageProps) {
//     return (
//         <div className="container mx-auto py-6 px-4">
//             <BlogForm blogId={params.id} />
//         </div>
//     );
// }

// app/admin/blogs/stats/page.tsx
import BlogForm from "@/components/dashboard/admin/blogs/BlogForm";
import BlogList from "@/components/dashboard/admin/blogs/BlogList";
import BlogStats from "@/components/dashboard/admin/blogs/blogStats";

export default function BlogStatsPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <BlogStats />
            <div className="mt-8">
                <BlogList />

            </div>
        </div>
    );
}