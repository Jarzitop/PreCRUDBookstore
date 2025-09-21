"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAuthors } from "@/hooks/useAuthors";

export default function AuthorsPage() {
  const { authors, setAuthors, loading, error, load, removeById } = useAuthors();

  useEffect(() => { load(); }, [load]);            // ← reemplaza tu useEffect de carga

  async function onDelete(id: number) {
    await removeById(id);                           // ← llamada centralizada
    setAuthors(prev => prev.filter(a => a.id !== id)); // ← actualiza UI
  }



  if (loading) return <main className="p-6">Cargando…</main>;
  if (error)   return <main className="p-6 text-red-600">Error: {error}</main>;

  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Autores</h1>
        <Link href="/crear" className="px-3 py-2 rounded bg-black text-white">Crear autor</Link>
      </div>

      {authors.length === 0 ? (
        <p className="text-gray-600">No hay autores aún.</p>
      ) : (
        <ul className="space-y-2">
          {authors.map(a => (
            <li key={a.id} className="p-3 rounded border flex justify-between items-center">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">{a.birthDate}</div>
              </div>
              <div className="space-x-3">
                <Link href={`/authors/${a.id}/editar`} className="text-blue-600 underline">Editar</Link>
                <button onClick={() => onDelete(a.id)} className="text-red-600">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
