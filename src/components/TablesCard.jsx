import React from "react";
import "./TablesCard.css";

const TablesCard = ({ title, data }) => (
  <div className="table-card">
    <h2 className="table-title">{title}</h2>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>PL</th>
            <th>+/-</th>
            <th>GD</th>
            <th>PTS</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.position}</td>
              <td className="team-cell">
                <img src={item.logo} alt={item.team} className="team-logo" />
                {item.team}
              </td>
              <td>{item.played}</td>
              <td>{item.plusMinus}</td>
              <td>{item.goalDifference}</td>
              <td>{item.points}</td>
              <td className="form-cell">
                {item.form.map((result, i) => (
                  <span
                    key={i}
                    className={`form-result ${result.toLowerCase()}`}
                  >
                    {result}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TablesCard;