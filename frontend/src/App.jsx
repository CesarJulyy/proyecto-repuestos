import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/repuestos/`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al conectar con la API");
        return res.json();
      })
      .then((data) => setRepuestos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = repuestos.length;
    const totalStock = repuestos.reduce((a, r) => a + Number(r.stock || 0), 0);
    const lowStock = repuestos.filter((r) => Number(r.stock) <= 5).length;
    return { total, totalStock, lowStock };
  }, [repuestos]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return repuestos
      .filter(
        (r) =>
          r.nombre.toLowerCase().includes(query) ||
          r.codigo.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortBy === "nombre") return a.nombre.localeCompare(b.nombre) * dir;
        if (sortBy === "stock") return (a.stock - b.stock) * dir;
        return (a.precio - b.precio) * dir;
      });
  }, [repuestos, q, sortBy, sortDir]);

  const precio = (v) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(v);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>RepuStore</h1>
            <p style={styles.brandSub}>
              Sistema profesional de gestión de repuestos automotrices
            </p>
            <p style={styles.sub}>
              API: <code style={styles.code}>{import.meta.env.VITE_API_URL}</code>
            </p>
          </div>

          <div style={styles.statsRow}>
            <Stat label="Repuestos" value={stats.total} />
            <Stat label="Stock total" value={stats.totalStock} />
            <Stat label="Stock bajo (≤5)" value={stats.lowStock} />
          </div>
        </header>

        {/* PANEL */}
        <section style={styles.panel}>
          {/* CONTROLS */}
          <div style={styles.controls}>
            <div>
              <label style={styles.label}>Buscar</label>
              <input
                style={styles.input}
                placeholder="Nombre o código"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Ordenar por</label>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="stock">Stock</option>
                <option value="precio">Precio</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Dirección</label>
              <select
                style={styles.select}
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: "salmon" }}>{error}</p>}

          {!loading && !error && (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <Th>Nombre</Th>
                    <Th>Código</Th>
                    <Th align="right">Stock</Th>
                    <Th align="right">Precio</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>{r.nombre}</td>
                      <td style={styles.td}>
                        <code style={styles.codeTiny}>{r.codigo}</code>
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {r.stock}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        {precio(r.precio)}
                      </td>
                      <td style={styles.td}>
                        <Estado stock={r.stock} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          Django REST Framework · Vite + React — RepuStore
        </footer>
      </div>
    </div>
  );
}

/* COMPONENTES */
const Stat = ({ label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statLabel}>{label}</div>
    <div style={styles.statValue}>{value}</div>
  </div>
);

const Th = ({ children, align = "left" }) => (
  <th style={{ ...styles.th, textAlign: align }}>{children}</th>
);

const Estado = ({ stock }) => {
  if (stock === 0) return <Badge text="Agotado" color="#b42318" bg="#fef3f2" />;
  if (stock <= 5) return <Badge text="Bajo" color="#b54708" bg="#fffaeb" />;
  return <Badge text="OK" color="#027a48" bg="#ecfdf3" />;
};

const Badge = ({ text, color, bg }) => (
  <span
    style={{
      padding: "4px 12px",
      borderRadius: 999,
      fontWeight: 800,
      fontSize: 12,
      color,
      background: bg,
      border: `1px solid ${color}`,
    }}
  >
    {text}
  </span>
);

/* ESTILOS */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0b1220, #111827)",
    padding: 32,
    display: "flex",
    justifyContent: "center",
    fontFamily: "system-ui",
    color: "#e5e7eb",
  },
  container: {
    width: "100%",
    maxWidth: 1100,
  },
  header: {
    display: "grid",
    gap: 28,
    marginBottom: 32,
  },
  h1: {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
  },
  brandSub: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 6,
  },
  sub: {
    marginTop: 10,
    fontSize: 14,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  statCard: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.15)",
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#cbd5e1",
    fontWeight: 800,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    marginTop: 6,
  },
  panel: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 28,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.15)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: 14,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.7,
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  td: {
    padding: 14,
  },
  tr: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  code: {
    padding: "3px 8px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.1)",
  },
  codeTiny: {
    padding: "3px 8px",
    borderRadius: 8,
    fontSize: 12,
    background: "rgba(255,255,255,0.1)",
  },
  footer: {
    marginTop: 32,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 13,
  },
};
