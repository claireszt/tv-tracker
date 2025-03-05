import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/tvdb/show/${id}`);
    const data = await res.json();

    if (!data.data) return notFound();

    const show = data.data;

    return (
      <div className="max-w-xl mx-auto p-m text-light-text">
        <h1 className="text-h1 mobile:text-h1-mobile font-heading">{show.name}</h1>
        {show.image && (
          <Image
            src={show.image}
            alt={show.name}
            width={600}
            height={400}
            className="w-full mt-2 rounded-1"
          />
        )}
        <p className="mt-4 text-body-lg mobile:text-body-lg-mobile font-body">
          {show.overview || "No description available."}
        </p>
      </div>
    );
  } catch (error) {
    return <div className="text-error">Error loading show: {String(error)}</div>;
  }
}
