"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthors } from "@/hooks/useAuthors";

const Schema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  birthDate: z.string().min(1, "Fecha requerida"),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().optional(),
});
type FormT = z.infer<typeof Schema>;

export default function CrearPage() {
  const router = useRouter();
  const { create, setAuthors } = useAuthors();
  const { register, handleSubmit, formState:{ errors, isSubmitting } } =
    useForm<FormT>({ resolver: zodResolver(Schema) });

  async function onSubmit(data: FormT) {
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
        description: data.description || undefined,
      };
      const saved = await create(payload);
      setAuthors(prev => [saved, ...prev]);
      router.push("/authors");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Crear autor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("name")} placeholder="Nombre" className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

        <input type="date" {...register("birthDate")} className="w-full border p-2 rounded" />
        {errors.birthDate && <p className="text-red-600 text-sm">{errors.birthDate.message}</p>}

        <input {...register("image")} placeholder="URL de imagen (opcional)" className="w-full border p-2 rounded" />
        {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}

        <textarea {...register("description")} placeholder="Descripción (opcional)" className="w-full border p-2 rounded" />

        <button disabled={isSubmitting} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          Guardar
        </button>
      </form>
    </main>
  );
}
