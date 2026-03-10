// ─────────────────────────────────────────────────────────
//  App.jsx  —  main entry, wires everything together
//  Designed by Bilal · bilaljaved1002@gmail.com
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import { useStudents, useToast, downloadCSV } from "./helpers";
import {
  Modal,
  StudentForm,
  DeleteConfirm,
  StudentsTable,
  Toast,
  Footer,
} from "./components";

export default function App() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const { toast, showToast } = useToast();

  const [search,       setSearch]       = useState("");
  const [showAdd,      setShowAdd]      = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // client-side filter on whatever the backend returned
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      String(s.age).includes(q)
    );
  });

  // ── handlers — all async since they call the API ────
  async function handleAdd(data) {
    try {
      await addStudent(data);
      setShowAdd(false);
      showToast("Student added!", "success");
    } catch (err) {
      // show backend error e.g. "email already exists"
      showToast(err.message, "error");
    }
  }

  async function handleEdit(data) {
    try {
      await updateStudent(editTarget.id, data);
      setEditTarget(null);
      showToast("Changes saved.", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete() {
    try {
      await deleteStudent(deleteTarget.id);
      showToast(`${deleteTarget.name} removed.`, "error");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // ── render ────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="max-w-4xl mx-auto px-5 py-12 flex flex-col min-h-screen">

        {/* ── header ── */}
        <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tighter leading-none text-zinc-100">
              Students
            </h1>
            <p className="mt-1.5 text-zinc-500 text-sm font-light">
              Manage your class roster
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => downloadCSV(filtered)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-xl hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              ↓ Export CSV
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-amber-500 text-zinc-950 rounded-xl hover:bg-amber-400 active:scale-95 transition-all"
            >
              + Add Student
            </button>
          </div>
        </header>

        {/* ── search bar ── */}
        <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 mb-3 focus-within:border-amber-500/40 transition-colors">
          <span className="text-zinc-600 text-lg leading-none select-none">⌕</span>
          <input
            type="text"
            placeholder="Search by name, email or age…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-zinc-600 hover:text-zinc-300 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── main table card ── */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

          {/* backend connection error banner */}
          {error && (
            <div className="flex items-center gap-2.5 px-5 py-3.5 bg-red-950/40 border-b border-red-900/50">
              <span className="text-red-400">⚠</span>
              <p className="text-red-400 text-sm">
                Could not connect to backend —{" "}
                <span className="font-medium">{error}</span>
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div className="w-9 h-9 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-zinc-600 text-sm">Loading students…</p>
            </div>
          ) : (
            <StudentsTable
              students={filtered}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          )}

          {/* row count */}
          {!loading && students.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-800/50 text-right">
              <span className="text-xs text-zinc-600">
                Showing{" "}
                <span className="font-semibold text-zinc-400">{filtered.length}</span>
                {" "}of{" "}
                <span className="font-semibold text-zinc-400">{students.length}</span>
                {" "}students
              </span>
            </div>
          )}
        </div>

        {/* ── modals ── */}
        {showAdd && (
          <Modal title="Add New Student" onClose={() => setShowAdd(false)}>
            <StudentForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
          </Modal>
        )}

        {editTarget && (
          <Modal title="Edit Student" onClose={() => setEditTarget(null)}>
            <StudentForm
              initial={{
                name:  editTarget.name,
                email: editTarget.email,
                age:   String(editTarget.age),
              }}
              onSave={handleEdit}
              onCancel={() => setEditTarget(null)}
            />
          </Modal>
        )}

        {deleteTarget && (
          <DeleteConfirm
            student={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        <Toast toast={toast} />
        <Footer />
      </div>
    </div>
  );
}