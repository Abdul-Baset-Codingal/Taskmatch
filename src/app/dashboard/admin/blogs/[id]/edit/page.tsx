import BlogForm from "@/components/dashboard/admin/blogs/BlogForm";

interface EditBlogPageProps {
    params: { id: string };
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
    return (
        <div className="container mx-auto py-6 px-4">
            <BlogForm blogId={params.id} />
        </div>
    );
}