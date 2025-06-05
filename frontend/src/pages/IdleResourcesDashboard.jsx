import React, { useState, useEffect } from "react";

const resourceTypes = ["EC2", "S3", "EBS", "EIP", "Snapshots"];

export default function IdleResourcesDashboard({ onLogout, awsCredentials }) {
  const [selectedResources, setSelectedResources] = useState([]);
  const [idleResources, setIdleResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedResources, setCheckedResources] = useState(new Set());

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.margin = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  const toggleResource = (type) => {
    setSelectedResources((prev) =>
      prev.includes(type) ? prev.filter((r) => r !== type) : [...prev, type]
    );
  };

  const handleScanClick = async () => {
    if (selectedResources.length === 0) {
      alert("Please select at least one resource type.");
      return;
    }
    if (!awsCredentials?.access_key || !awsCredentials?.secret_key) {
      alert("AWS credentials missing!");
      return;
    }

    setLoading(true);
    setIdleResources([]);
    setError(null);
    setCheckedResources(new Set());

    try {
      const response = await fetch("/resources/idle-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: awsCredentials.access_key,
          secret_key: awsCredentials.secret_key,
          resourceTypes: selectedResources,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch idle resources.";
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = JSON.stringify(errorData.detail);
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const flatResources = [];
      Object.entries(data).forEach(([typeKey, resources]) => {
        resources.forEach((res) => {
          flatResources.push({
            ...res,
            type: typeKey.toUpperCase(),
          });
        });
      });

      setIdleResources(flatResources);
    } catch (err) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (id) => {
    setCheckedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (checkedResources.size === 0) {
      alert("Please select resources to delete.");
      return;
    }

    if (!window.confirm(`Delete ${checkedResources.size} selected resource(s)?`)) return;

    await handleBulkAction("delete");
  };

  const handleBulkAction = async (action) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/resources/${action}-idle-resources`, {
        method: action === "delete" ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: awsCredentials.access_key,
          secret_key: awsCredentials.secret_key,
          resourceIds: Array.from(checkedResources),
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} resources.`);

      setIdleResources((prev) =>
        prev.filter((res) => !checkedResources.has(res.id))
      );
      setCheckedResources(new Set());
    } catch (err) {
      setError(err.message || `Error during ${action}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRowAction = async (id, action) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/resources/${action}-idle-resources`, {
        method: action === "delete" ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: awsCredentials.access_key,
          secret_key: awsCredentials.secret_key,
          resourceIds: [id],
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} resource.`);

      setIdleResources((prev) => prev.filter((res) => res.id !== id));
    } catch (err) {
      setError(err.message || `Error during ${action}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", fontFamily: "Amazon Ember, Arial, sans-serif", backgroundColor: "#f7f8fa" }}>
      <header style={{ height: 56, backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", boxShadow: "0 1px 0 #e7e7e7", fontSize: 20 }}>
        <div style={{ fontWeight: "bold", color: "#146eb4" }}>Idle Resources Dashboard</div>
        <button onClick={onLogout} style={{ background: "none", border: "none", color: "#0073bb", cursor: "pointer" }}>Logout</button>
      </header>

      <main style={{ flexGrow: 1, overflow: "auto", padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Scan → Detect → Live Fetch</h2>

        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 10 }}>Select Resource Types:</div>
          {resourceTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleResource(type)}
              style={{
                marginRight: 10,
                marginBottom: 10,
                padding: "8px 16px",
                borderRadius: 20,
                border: selectedResources.includes(type) ? "2px solid #0073bb" : "1px solid #ccc",
                backgroundColor: selectedResources.includes(type) ? "#e1f5fe" : "#fff",
                fontWeight: selectedResources.includes(type) ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {type}
            </button>
          ))}
          <button
            onClick={handleScanClick}
            disabled={loading}
            style={{
              backgroundColor: "#0073bb",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: 4,
              fontWeight: 700,
              cursor: "pointer",
              marginLeft: 10,
            }}
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {error && <div style={{ color: "red", marginBottom: 10 }}>Error: {error}</div>}

        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: 6, overflow: "hidden" }}>
          <thead style={{ backgroundColor: "#f1f1f1" }}>
            <tr>
              <th style={{ padding: 10 }}>✔</th>
              <th>Type</th>
              <th>ID</th>
              <th>Name</th>
              <th>Cost ($)</th>
              <th>CPU (%)</th>
              <th>Start Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {idleResources.length === 0 && !loading && (
              <tr><td colSpan="8" style={{ padding: 20, textAlign: "center" }}>No resources found. Click Scan.</td></tr>
            )}
            {idleResources.map((res) => (
              <tr key={res.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ textAlign: "center" }}>
                  <input type="checkbox" checked={checkedResources.has(res.id)} onChange={() => toggleCheck(res.id)} />
                </td>
                <td>{res.type}</td>
                <td>{res.id}</td>
                <td>{res.name || "-"}</td>
                <td>{res.cost ? res.cost.toFixed(2) : "-"}</td>
                <td>{res.cpu_usage ?? "-"}</td>
                <td>{res.start_time || "-"}</td>
                <td>
                  <button
                    onClick={() => handleRowAction(res.id, "delete")}
                    style={{ marginRight: 8, backgroundColor: "#d32f2f", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 4, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRowAction(res.id, "retain")}
                    style={{ backgroundColor: "#388e3c", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 4, cursor: "pointer" }}
                  >
                    Retain
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            onClick={handleDeleteSelected}
            disabled={loading || checkedResources.size === 0}
            style={{
              backgroundColor: checkedResources.size > 0 ? "#d32f2f" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: checkedResources.size > 0 ? "pointer" : "not-allowed",
            }}
          >
            Delete Selected
          </button>
        </div>
      </main>
    </div>
  );
}
