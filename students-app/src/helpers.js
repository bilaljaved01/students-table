// ─────────────────────────────────────────────────
//  helpers.js  —  validation, csv, api & hooks
//  Designed by Bilal · bilaljaved1002@gmail.com
// ─────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

// reads VITE_API_URL from your frontend .env
// fallback to localhost if not set
const API_URL = import.meta.env.VITE_API_URL;

// ── validation ─────────────────────────────────────
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(f) {
  const errors = {};
  if (!f.name.trim())                  errors.name  = "Name can't be empty";
  if (!f.email.trim())                 errors.email = "Email is required";
  else if (!emailRx.test(f.email))     errors.email = "Doesn't look like a valid email";
  if (!f.age)                          errors.age   = "Age is required";
  else if (+f.age < 5 || +f.age > 100) errors.age   = "Age should be between 5 and 100";
  return errors;
}

// ── csv export ─────────────────────────────────────
export function downloadCSV(rows) {
  const csv = [
    "Name,Email,Age",
    ...rows.map(r => `"${r.name}","${r.email}",${r.age}`),
  ].join("\n");

  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: "students.csv",
  });
  a.click();
}

// ── shared fetch wrapper ───────────────────────────
// handles errors and JSON parsing in one place
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // NestJS returns { message } on errors
    throw new Error(
      Array.isArray(body.message)
        ? body.message.join(", ")
        : body.message || `Request failed (${res.status})`
    );
  }

  return res.json();
}

// ── useStudents hook ───────────────────────────────
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // load all students from the backend on mount
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/students");
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  async function addStudent(data) {
    const created = await apiFetch("/students", {
      method: "POST",
      body: JSON.stringify({ ...data, age: +data.age }),
    });
    // add to top of the list so it shows up immediately
    setStudents(prev => [created, ...prev]);
  }

  async function updateStudent(id, data) {
    const updated = await apiFetch(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data, age: +data.age }),
    });
    setStudents(prev => prev.map(s => s.id === id ? updated : s));
  }

  async function deleteStudent(id) {
    await apiFetch(`/students/${id}`, { method: "DELETE" });
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  return { students, loading, error, addStudent, updateStudent, deleteStudent };
}

// ── useToast hook ──────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }

  return { toast, showToast };
}