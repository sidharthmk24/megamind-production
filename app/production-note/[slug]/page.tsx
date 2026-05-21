import { notFound } from "next/navigation";
import { NOTES, getNoteBySlug } from "@/lib/notes-data";
import NoteDetail from "@/components/ProductionNote/NoteDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NOTES.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: `${note.title} | Megamind Productions`,
    description: note.excerpt,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const related = NOTES.filter((n) => n.slug !== slug).slice(0, 3);

  return <NoteDetail note={note} related={related} />;
}
