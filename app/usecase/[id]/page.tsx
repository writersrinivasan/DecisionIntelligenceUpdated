import { notFound } from "next/navigation";
import { USE_CASES, getUseCase } from "@/lib/usecases";
import UseCaseView from "@/components/UseCaseView";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const uc = getUseCase(id);
  return { title: uc ? `${uc.num}. ${uc.title} · DI Lab` : "DI Lab" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = USE_CASES.findIndex((u) => u.id === id);
  if (i < 0) notFound();
  const prev = USE_CASES[i - 1];
  const next = USE_CASES[i + 1];
  return (
    <UseCaseView
      uc={USE_CASES[i]}
      prev={prev && { id: prev.id, title: prev.title }}
      next={next && { id: next.id, title: next.title }}
    />
  );
}
