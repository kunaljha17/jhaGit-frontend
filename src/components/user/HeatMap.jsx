import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import axiosClient from "../../api/axiosClient";

/**
 * 5-level GitHub-inspired contribution color scale:
 * - Empty (0): #2d333b (Visible slate-gray against dark #161b22 surface)
 * - Level 1 (1–2): #0e4429 (Dark green - minor activity like 1-2 file edits/commits)
 * - Level 2 (3–5): #006d32 (Medium green - moderate activity like creating a repo or multiple edits)
 * - Level 3 (6–9): #26a641 (Bright green - high activity like repos + issues + commits)
 * - Level 4 (10+): #39d353 (Peak green - intense daily activity)
 */
const COLOR_SCALE = {
  EMPTY: "#2d333b",
  LEVEL_1: "#0e4429",
  LEVEL_2: "#006d32",
  LEVEL_3: "#26a641",
  LEVEL_4: "#39d353",
};

const LEGEND_COLORS = [
  COLOR_SCALE.EMPTY,
  COLOR_SCALE.LEVEL_1,
  COLOR_SCALE.LEVEL_2,
  COLOR_SCALE.LEVEL_3,
  COLOR_SCALE.LEVEL_4,
];

/**
 * Determine exact cell fill color based on contribution count
 */
const getCellFill = (count) => {
  const num = Number(count) || 0;
  if (num <= 0) return COLOR_SCALE.EMPTY;
  if (num <= 2) return COLOR_SCALE.LEVEL_1;
  if (num <= 5) return COLOR_SCALE.LEVEL_2;
  if (num <= 9) return COLOR_SCALE.LEVEL_3;
  return COLOR_SCALE.LEVEL_4;
};

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
        rectRender={(props, data) => {
          const count = data?.count || 0;
          const fill = getCellFill(count);
          return (
            <rect
              {...props}
              fill={fill}
              rx={2.5}
            >
              <title>{`${count} contribution${count === 1 ? "" : "s"} on ${data?.date}`}</title>
            </rect>
          );
        }}
        panelColors={{
          0: COLOR_SCALE.EMPTY,
          1: COLOR_SCALE.LEVEL_1,
          3: COLOR_SCALE.LEVEL_2,
          6: COLOR_SCALE.LEVEL_3,
          10: COLOR_SCALE.LEVEL_4,
        }}
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
        {LEGEND_COLORS.map((color, i) => (
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