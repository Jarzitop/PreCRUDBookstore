"use client";
import { useState, useCallback } from "react";

export type Author = { id:number; name:string; birthDate:string; image?:string; description?:string };

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/authors"); if (!r.ok) throw new Error("Error al cargar");
      setAuthors(await r.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }, []);

  const create = useCallback(async (data: Omit<Author,"id">) => {
    const r = await fetch("/api/authors", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("Error al crear");
    return r.json() as Promise<Author>;
  }, []);

  const update = useCallback(async (id:number, data: Partial<Author>) => {
    const r = await fetch(`/api/authors/${id}`, { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("Error al actualizar");
    return r.json() as Promise<Author>;
  }, []);

  const removeById = useCallback(async (id:number) => {
    const r = await fetch(`/api/authors/${id}`, { method:"DELETE" });
    if (!r.ok) throw new Error("Error al eliminar");
  }, []);

  return { authors, setAuthors, loading, error, load, create, update, removeById };
}
