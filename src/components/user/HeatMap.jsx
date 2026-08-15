import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import axiosClient from "../../api/axiosClient";

/**
 * GitHub-style 5-level color scale.
 * The library auto-distributes these across the user's max count
 * using proportional thresholds via its internal convertPanelColors().
 *
 * Level 0: #2d333b  — Gray (no activity, visible against #161b22 background)
 * Level 1: #0e4429  — Dark green (low activity)
 * Level 2: #006d32  — Medium green
 * Level 3: #26a641  — Bright green
 * Level 4: #39d353  — Brightest green (peak activity)
 */
const PANEL_COLORS = ["#2d333b", "#0e4429", "#006d32", "#26a641", "#39d353"];

const HeatMapProfile = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  useEffect(() => {
    const fetchActivity = async () => {
      const targetUserId = userId || localStorage.getItem("userId");
      if (!targetUserId) return;

      try {
        const res = await axiosClient.get(`/user/activity/${targetUserId}`);
        const data = res.data || [];
        setActivityData(data);

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        setStartDate(oneYearAgo);
      } catch (err) {
        console.error("Error fetching activity data:", err);
      }
    };

    fetchActivity();
  }, [userId]);

  const totalContributions = activityData.reduce((sum, d) => sum + (d.count || 0), 0);

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)" }}>
          Contribution Activity (Last 12 Months)
        </h3>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
          {totalContributions} total {totalContributions === 1 ? "contribution" : "contributions"}
        </span>
      </div>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "760px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={startDate}
        rectSize={14}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={PANEL_COLORS}
      />
      {/* Less → More color legend */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "4px",
        marginTop: "10px",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
      }}>
        <span>Less</span>
        {PANEL_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              backgroundColor: color,
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;