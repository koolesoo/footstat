import React from "react";
import "./TablesCard.css";
const TablesCard = ({ title, data }) => (
  <div className="table-card">
    <h2>{title}</h2>
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Team</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.position}</td>
            <td>{item.team}</td>
            <td>{item.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TablesCard;