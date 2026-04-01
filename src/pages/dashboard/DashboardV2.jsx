import React, { useState, useEffect, useRef } from 'react'
import withPermissionCheck from '../../config/withPermissionCheck'
import { BiArrowToTop } from "react-icons/bi";
// import { Chart } from 'chart.js/auto';
// import React from 'react'
import { Line, Bar, Doughnut, } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js/auto'
Chart.register(...registerables)

const DashboardV2 = () => {

  const stats = [
    { title: 'Total Sales', value: '$180,630', change: '12%' },
    { title: 'Avg Daily', value: '$5,818', change: '9%' },
    { title: 'Covers', value: '1,622', change: '11%' },
    { title: 'Avg Spend', value: '$111', change: '2%' },
  ]

  // Line + bar combo (daily sales)
  const lineData = {
    labels: ['3/14', '4/15', '1/2', '3/7', '5/5', '8/1', '9/23'],
    datasets: [
      {
        type: 'line',
        label: 'Trend',
        data: [80, 150, 120, 180, 220, 140, 200],
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        backgroundColor: '#6366f1',

      },
      {
        type: 'bar',
        label: 'Daily',
        data: [50, 70, 60, 100, 140, 90, 120],
        borderRadius: 6,
        backgroundColor: '#6366f1',
      },
    ],
  }
  //line+bar
  const [ShowTableDailySales, setShowTableDailySales] = useState(false);
  const [showTableMacroCategoryBreakdown, setShowTableMacroCategoryBreakdown] = useState(false);

  const lineOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { drawBorder: false } },
      x: { grid: { display: false } },
    },
  }

  // Doughnut (macro category breakdown)
  const doughnutData = {
    labels: ['Entrees', 'Wine', 'Appetizers', 'Desserts'],
    datasets: [
      {
        data: [45, 20, 20, 15],
        backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'],
        hoverOffset: 6,
      },
    ],
  }

  const doughnutOptions = { maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }

  // Contribution by item - horizontal bars
  const items = [
    { name: 'Mushroom Risotto', pct: 13 },
    { name: 'Steak', pct: 17 },
    { name: 'Caesar Salad', pct: 6 },
    { name: 'Filet Mignon', pct: 8 },
    { name: 'Margherita', pct: 7 },
    { name: 'Chocolate Lava Cake', pct: 6 },
    { name: 'Grilled Salmon', pct: 9 },
  ]
  // Heatmap-like matrix for Sales by Day Average (simplified)
  const heatmap = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    values: [
      [20, 40, 60, 80, 90],
      [15, 30, 55, 70, 85],
      [10, 25, 45, 60, 75],
      [5, 20, 40, 55, 70],
      [2, 10, 25, 45, 60],
      [1, 5, 15, 30, 45],
    ],
  }

  // Sales by Meal Type table static rows
  const mealRows = [
    { rank: 1, item: 'Mushroom Risotto', qty: 128, net: '$24,945', pct: '14%' },
    { rank: 2, item: 'Caesar Salad', qty: 158, net: '$18,560', pct: '11%' },
    { rank: 3, item: 'Margherita', qty: 199, net: '$17,250', pct: '10%' },
    { rank: 4, item: 'Grilled Salmon', qty: 112, net: '$18,290', pct: '10%' },
    { rank: 5, item: 'Filet Mignon', qty: 113, net: '$15,380', pct: '9%' },
    { rank: 6, item: 'Steak', qty: 112, net: '$14,980', pct: '9%' },
  ]



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        {/* Top controls */}
        <div className="flex gap-3 items-center mb-6">
          <div className="bg-white p-2 rounded shadow-sm text-sm">08/01/2023 - 08/31/2023</div>
          <select className="bg-white p-2 rounded shadow-sm">
            <option>Company</option>
          </select>
          <select className="bg-white p-2 rounded shadow-sm">
            <option>All</option>
          </select>
          <button className="ml-auto bg-white px-4 py-2 rounded shadow-sm">Export</button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.title} className="bg-white p-4 rounded shadow-sm">
              <div className="text-sm text-gray-500">{s.title}</div>
              <div className="text-2xl font-semibold mt-2">{s.value}</div>
              <div className="text-sm text-green-500 mt-1">↑ {s.change}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Daily Sales (line + bars) */}
            <div className="bg-white p-2 rounded shadow-sm h-64">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Daily Sales</h3>
                <button type='button' className='bg-customBlue p-1 text-white' onClick={() => setShowTableDailySales(!ShowTableDailySales)}>{ShowTableDailySales ? "Show Chart" : "Show Table"}</button>
              </div>
              {

                ShowTableDailySales ? <div style={{ overflowY: "auto", height: "195px", }}>
                  <table className="w-full border border-gray-300 text-left">
                    <thead>
                      <tr className="bg-customBlue text-white">
                        <th className="border px-3 py-2">Month</th>
                        <th className="border px-3 py-2">{lineData.datasets[0].label}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineData.labels.map((month, index) => (
                        <tr key={month} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">{month}</td>
                          <td className="border px-3 py-2">{lineData.datasets[0].data[index]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> :
                  <div className="h-44">
                    <Line data={lineData} options={lineOptions} />
                  </div>

              }
            </div>


            {/* Revenue category (funnel) and Contribution by Item */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-4">Revenue Category</h3>
                {/* simple SVG funnel */}
                <div className="flex justify-center">
                  <svg width="220" height="180" viewBox="0 0 220 180">
                    <g fill="#c7d2fe">
                      <rect x="10" y="10" width="200" height="40" rx="6" fill="#4f46e5" />
                      <rect x="30" y="60" width="160" height="30" rx="6" fill="#6366f1" />
                      <rect x="50" y="100" width="120" height="25" rx="6" fill="#818cf8" />
                      <rect x="70" y="135" width="80" height="25" rx="6" fill="#a5b4fc" />
                    </g>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium mb-4">Contribution by Item</h3>
                <div className="space-y-3">
                  {items.map((it) => (
                    <div key={it.name} className="flex items-center gap-4">
                      <div className="w-36 text-sm text-gray-700">{it.name}</div>
                      <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div style={{ width: `${it.pct}%` }} className="h-3 rounded-full bg-theme"></div>
                      </div>
                      <div className="w-12 text-right text-sm text-gray-600">{it.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales by Meal Type table */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Sales by Meal Type</h3>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-theme rounded">Lunch</button>
                  <button className="px-3 py-1 bg-white border rounded">Dinner</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th className="py-2">Rank</th>
                      <th>Item</th>
                      <th>QTY</th>
                      <th>Net S.</th>
                      <th>Contri. %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealRows.map((r) => (
                      <tr key={r.rank} className="border-t">
                        <td className="py-2">{r.rank}</td>
                        <td>{r.item}</td>
                        <td>{r.qty}</td>
                        <td>{r.net}</td>
                        <td>{r.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div className="space-y-4">
            {/* Macro Category Breakdown (doughnut) */}
            <div className="bg-white p-2 rounded shadow-sm h-64">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Macro Category Breakdown</h3>
                <button type='button' className='bg-customBlue p-1 text-white' onClick={() => setShowTableMacroCategoryBreakdown(!showTableMacroCategoryBreakdown)}>{showTableMacroCategoryBreakdown ? "Show Chart" : "Show Table"}</button>
              </div>

              {
                showTableMacroCategoryBreakdown ? (
                  <div>
                    <table className="w-full border border-gray-300 text-left">
                      <thead>
                        <tr className="bg-customBlue text-white">
                          <th className="border px-3 py-2">Category</th>
                          <th className="border px-3 py-2">Sales ($)</th>
                          <th className="border px-3 py-2">Percentage (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doughnutData.labels.map((label, index) => {
                          const total = doughnutData.datasets[0].data.reduce(
                            (sum, val) => sum + val,
                            0
                          );
                          const value = doughnutData.datasets[0].data[index];
                          const percent = ((value / total) * 100).toFixed(1);
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border px-3 py-2">{label}</td>
                              <td className="border px-3 py-2">{value.toLocaleString()}</td>
                              <td className="border px-3 py-2">{percent}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className="h-40">
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <button className="px-3 py-1 bg-white border rounded">Lunch Only</button>
                      <button className="px-3 py-1 bg-white border rounded">Dinner Only</button>
                      <button className="px-3 py-1 bg-white border rounded">Both</button>
                    </div>
                  </>
                )
              }

            </div>

            {/* Sales by Day Average (heatmap-like) */}
            <div className="bg-white p-2 rounded shadow-sm h-64">
              <h3 className="font-medium mb-3">Sales by Day Average</h3>
              <div className="grid grid-cols-5 gap-1">
                {/* render heatmap rows */}
                {heatmap.days.map((d, i) => (
                  <div key={d} className="flex items-center gap-2">
                    <div className="w-10 text-sm">{d}</div>
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      {heatmap.values[i].map((v, j) => (
                        <div key={j} className={`h-6 rounded`} style={{ backgroundColor: `rgba(79,70,229, ${v / 100})` }}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">Highest day</div>
                <div className="text-2xl font-semibold">$6,300</div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Tables */}







      </div>
    </div>
  )
}

export default withPermissionCheck(DashboardV2, "dashboard-v2")
