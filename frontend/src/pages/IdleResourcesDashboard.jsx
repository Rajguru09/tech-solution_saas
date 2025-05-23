import React, { useState, useEffect } from "react";

const resourceTypes = ["EC2", "S3", "EBS", "EIP", "Snapshots"];

export default function IdleResourcesDashboard({ onLogout, awsCredentials }) {
  // awsCredentials = { access_key, secret_key }
  const [selectedResources, setSelectedResources] = useState([]);
  const [idleResources, setIdleResources] = useState([]); // flat array of all resources with type field
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
      const response = await fetch("/api/idle-resources", {
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
      // data expected: { ec2: [...], s3: [...], ebs: [...], ... }

      // Flatten all resources with added 'type' field
      const flatResources = [];
      Object.entries(data).forEach(([typeKey, resources]) => {
        resources.forEach((res) => {
          flatResources.push({
            ...res,
            type: typeKey.toUpperCase(), // e.g. "EC2", "S3"
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

    if (
      !window.confirm(
        `Are you sure you want to delete ${checkedResources.size} selected resource(s)?`
      )
    )
      return;

    setLoading(true);
    setError(null);

    try {
      // DELETE expects { resourceIds: [...] } + AWS credentials
      const response = await fetch("/api/delete-idle-resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: awsCredentials.access_key,
          secret_key: awsCredentials.secret_key,
          resourceIds: Array.from(checkedResources),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete resources.";
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = JSON.stringify(errorData.detail);
        } catch {}
        throw new Error(errorMessage);
      }

      // Remove deleted from local list
      setIdleResources((prev) =>
        prev.filter((res) => !checkedResources.has(res.id))
      );
      setCheckedResources(new Set());
    } catch (err) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Amazon Ember, Arial, sans-serif",
        color: "#262626",
        backgroundColor: "#f7f8fa",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          height: 56,
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 0 #e7e7e7",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          fontWeight: 600,
          fontSize: 18,
          userSelect: "none",
          justifyContent: "space-between",
          borderBottom: "1px solid #e7e7e7",
          flexShrink: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 35, color: "#146eb4" }}>
          Idle Resources Dashboard
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: "none",
            color: "#0073bb",
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: 4,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e1f5fe")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: 24,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontWeight: 700,
            fontSize: 20,
            marginBottom: 24,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Resource Types
        </h1>

        {/* Resource Type Selection */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            Select:
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              maxWidth: 700,
            }}
          >
            {resourceTypes.map((type) => {
              const selected = selectedResources.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleResource(type)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: selected ? "2px solid #0073bb" : "1px solid #ccc",
                    backgroundColor: selected ? "#e1f5fe" : "#fff",
                    color: selected ? "#0073bb" : "#333",
                    fontWeight: selected ? 700 : 500,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                    boxShadow: selected ? "0 0 5px #0073bb33" : "none",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleScanClick}
            disabled={loading}
            style={{
              backgroundColor: "#0073bb",
              border: "none",
              color: "#fff",
              padding: "10px 28px",
              borderRadius: 4,
              fontWeight: 700,
              cursor: "pointer",
              userSelect: "none",
              height: 38,
              boxShadow: "0 2px 4px rgb(0 115 187 / 0.5)",
              transition: "background-color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005f8c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0073bb")}
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              color: "red",
              fontWeight: 600,
              userSelect: "none",
            }}
          >
            Error: {error}
          </div>
        )}

        {/* Idle Resources Table */}
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: 6,
            backgroundColor: "#fff",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 800,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1", userSelect: "none" }}>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  Select
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Resource Type
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Cost (USD)
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  CPU Usage (%)
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Start Time
                </th>
              </tr>
            </thead>
            <tbody>
              {idleResources.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                    No idle resources found. Please select resource types and click Scan.
                  </td>
                </tr>
              )}
              {idleResources.map((res) => (
                <tr
                  key={res.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    userSelect: "none",
                  }}
                >
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={checkedResources.has(res.id)}
                      onChange={() => toggleCheck(res.id)}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>{res.type}</td>
                  <td style={{ padding: "8px" }}>{res.id}</td>
                  <td style={{ padding: "8px" }}>{res.name || "-"}</td>
                  <td style={{ padding: "8px" }}>{res.cost ? res.cost.toFixed(2) : "-"}</td>
                  <td style={{ padding: "8px" }}>{res.cpu_usage ?? "-"}</td>
                  <td style={{ padding: "8px" }}>{res.start_time || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Selected Button */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleDeleteSelected}
            disabled={loading || checkedResources.size === 0}
            style={{
              backgroundColor: checkedResources.size > 0 ? "#d32f2f" : "#f5f5f5",
              color: checkedResources.size > 0 ? "#fff" : "#aaa",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: checkedResources.size > 0 ? "pointer" : "default",
              userSelect: "none",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (checkedResources.size > 0)
                e.currentTarget.style.backgroundColor = "#b71c1c";
            }}
            onMouseLeave={(e) => {
              if (checkedResources.size > 0)
                e.currentTarget.style.backgroundColor = "#d32f2f";
            }}
          >
            Delete Selected
          </button>
        </div>
      </main>
    </div>
  );
}
