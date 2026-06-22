import KitRenderer from "@/components/KitRenderer";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8">

     <img
  src="/assets/branding/cre8te-a-jersey-logo.png"
  alt="Cre8te A Jersey"
  className="mx-auto mb-6 w-full max-w-[520px]"
/>

      <KitRenderer />

    </main>
  );
}