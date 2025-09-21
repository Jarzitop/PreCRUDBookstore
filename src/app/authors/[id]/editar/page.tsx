"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { authors, setAuthors, loading, error, load, update } = useAuthors();

  // carga si no hay lista
  useEffect(() => { if (!authors.length) load(); }, [authors.length, load]);

  const current = useMemo(
    () => authors.find(a => a.id === Number(id)),
    [authors, id]
  );

  const { register, handleSubmit, formState:{ errors, isSubmitting }, reset } =
    useForm<FormT>({ resolver: zodResolver(Schema) });

  // precarga valores cuando exista current
  useEffect(() => {
    if (current) {
      reset({
        name: current.name,
        birthDate: current.birthDate,
        image: current.image ?? "",
        description: current.description ?? "",
      });
    }
  }, [current, reset]);

  async function onSubmit(data: FormT) {
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
        description: data.description || undefined,
      };
      const saved = await update(Number(id), payload);
      setAuthors(prev => prev.map(a => (a.id === saved.id ? saved : a)));
      router.push("/authors");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : String(e));
    }
  }

  if (loading && !authors.length) return <main className="p-6">Cargando…</main>;
  if (error) return <main className="p-6 text-red-600">Error: {error}</main>;
  if (!current) return <main className="p-6">No se encontró el autor.</main>;

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Editar autor</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("name")} className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

        <input type="date" {...register("birthDate")} className="w-full border p-2 rounded" />
        {errors.birthDate && <p className="text-red-600 text-sm">{errors.birthDate.message}</p>}

        <input {...register("image")} placeholder="URL de imagen" className="w-full border p-2 rounded" />
        {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}

        <textarea {...register("description")} placeholder="Descripción" className="w-full border p-2 rounded" />

        <button disabled={isSubmitting} className="px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          Actualizar
        </button>
      </form>
    </main>
  );
}
