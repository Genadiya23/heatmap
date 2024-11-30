import myCalories from "./calories.json";
import './App.css';
import React, { useEffect, useState } from "react";


const Heatmap = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [hoveredTotal, setHoveredTotal] = useState(null);

  const getColorForValue = (value) => {
    if (value <= 1300) return "#fff394"; 
    if (value <= 1400) return "#ffea76"; 
    if (value <= 1500) return "#ffdc2e";
    if (value <= 1600) return "#ffb617";
    if (value <= 1700) return "#ff9400"; 
    return "#ff6700"; 
  };

  useEffect(() => {
    const Months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const groupedData = myCalories.reduce((acc, entry) => {
      const parsedDate = new Date(entry.date);
      if (isNaN(parsedDate)) {
        console.warn("Invalid date:", entry.date);
        return acc;
      }
      const month = parsedDate.toLocaleString("default", { month: "long", timeZone: "UTC" });
      if (!Months.includes(month)) return acc;
      if (!acc[month]) acc[month] = [];
      acc[month].push({
        date: entry.date,
        meals: entry.meals,
        total: Object.values(entry.meals).reduce((sum, value) => sum + value, 0),
        mostCaloricMeal: Object.entries(entry.meals).reduce((max, [meal, calories]) =>
          calories > max.calories ? { meal, calories } : max, { meal: '', calories: 0 }),
      });
      return acc;
    }, {});

    const completeData = Months.reduce((acc, month) => {
      acc[month] = groupedData[month] || [];
      return acc;
    }, {});

    setMonthlyData(completeData);
  }, []);

  return (
    <div className="heatmap-container">
      <div>
        <div className="month-grid">
          {Object.entries(monthlyData).map(([month, entries]) => (
            <div key={month} className="month-container">
              <h2>{month}</h2>
              {entries.length > 0 ? (
                <div class="grid">
                  {entries.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="calories-box"
                      style={{
                        backgroundColor: getColorForValue(row.total),
                        opacity: hoveredTotal === null || hoveredTotal === row.total ? 1 : 0.3,
                      }}
                      onMouseEnter={() => setHoveredTotal(row.total)}
                      onMouseLeave={() => setHoveredTotal(null)} 
                      tooltip={`${new Date(row.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}\nTotal calories: ${row.total}\nThe most caloric meal: ${row.mostCaloricMeal.meal} (${row.mostCaloricMeal.calories} cal)`}

                    ></div>
                  ))}
                </div>
              ) : (
                <p>No data available for {month}.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;