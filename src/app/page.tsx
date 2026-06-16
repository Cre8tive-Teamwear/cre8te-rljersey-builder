import KitRenderer from "@/components/KitRenderer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8">

      <h1 className="text-4xl font-bold text-center mb-8">
        Rugby Kit Builder
      </h1>

      <KitRenderer />

    </main>
  );
}