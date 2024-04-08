import React from "react";
import { useSelector } from "react-redux";
import "./styles.scss";

function RecentActivity({ data, labels, title, flipVertical = false }) {
  return (
    <div
      className={`recentactivity ${flipVertical ? "flipVertical" : undefined}`}
    >
      <div className="top">
        <p>{title}</p>
      </div>
      <table>
        <thead>
          <tr>
            {labels.map((label, i) => (
              <th style={i === 0 ? { textAlign: "start" } : undefined}>
                <div className="thBox">{label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((obj, i) => (
            <tr key={i}>
              {Object.values(obj).map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flipTable">
        {labels.map((label, i) => (
          <div className="row">
            <p className="label">{label}</p>
            <p className="value">{Object.values(data[0])[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityLog() {
  const user = useSelector((state) => state.auth.user);

  const activeLabels = [
    "Logged in",
    "Browser",
    "Operation system",
    "IP address",
    "Location",
    "ISP",
    "Current",
  ];

  const recentLabels = [
    "Action",
    "Browser",
    "Operation system",
    "IP address",
    "Location",
    "ISP",
    "Date",
  ];

  return (
    <div className="activity">
      <RecentActivity
        title="Active sessions"
        data={user.activity.active}
        labels={activeLabels}
        flipVertical={true}
      />
      <RecentActivity
        title="Recent activity"
        data={user.activity.recent}
        labels={recentLabels}
      />
    </div>
  );
}

export default ActivityLog;
