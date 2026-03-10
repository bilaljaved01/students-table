// ─────────────────────────────────────────────────────
//  helpers.js  —  validation, CSV export, API calls,
//                 and the useStudents / useToast hooks
//  Designed by Bilal · bilaljaved1002@gmail.com
// ─────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

// base URL for the NestJS backend
// in production change this to your deployed API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ── validation ─────────────────────────────────────────
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(f) {
  const errors = {};
  if (!f.name.trim())                    errors.name  = "Name can't be empty";
  if (!f.email.trim())                   errors.email = "Email is required";
  else if (!emailRx.test(f.email))       errors.email = "Doesn't look like a valid email";
  if (!f.age)                            errors.age   = "Age is required";
  else if (+f.age < 5 || +f.age > 100)   errors.age   = "Age should be between 5 and 100";
  return errors;
}

// ── CSV export ─────────────────────────────────────────
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

// ── API helpers ────────────────────────────────────────
// small wrappers so we don't repeat fetch boilerplate

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // try to parse error message from backend
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  // DELETE returns { message } — everything else returns student(s)
  return res.json();
}

// ── useStudents hook ───────────────────────────────────
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // fetch all students from the backend on mount
  const fetchStudents = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const data  = await apiFetch(`/students${query}`);
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
    setStudents(prev => [created, ...prev]);
    return created;
  }

  async function updateStudent(id, data) {
    const updated = await apiFetch(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...data, age: +data.age }),
    });
    setStudents(prev => prev.map(s => s.id === id ? updated : s));
    return updated;
  }

  async function deleteStudent(id) {
    await apiFetch(`/students/${id}`, { method: "DELETE" });
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}

// ── useToast hook ──────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }

  return { toast, showToast };
}
