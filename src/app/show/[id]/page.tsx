import { notFound } from "next/navigation";

export default async function ShowPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/tvdb/show/${params.id}`);
  const data = await res.json();

  if (!data.data) return notFound();

  const show = data.data;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{show.name}</h1>
      {show.image && <img src={show.image} alt={show.name} className="w-full mt-2" />}
      <p className="mt-4">{show.overview || "No description available."}</p>
    </div>
  );
}
