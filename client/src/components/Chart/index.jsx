import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./styles.scss";

function Chart({ time }) {
  const [realData, setRealData] = useState();

  const data = [
    {
      name: "Page A",
      uv: 4000,
      PRICE: 2400,
      amt: 2400,
      date: "2010-20-01",
    },
    {
      name: "Page B",
      uv: 3000,
      PRICE: 1398,
      amt: 2210,
      date: "2010-20-01",
    },
    {
      name: "Page C",
      uv: 2000,
      PRICE: 9800,
      amt: 2290,
      date: "2010-20-01",
    },
    {
      name: "Page D",
      uv: 2780,
      PRICE: 3908,
      amt: 2000,
      date: "2010-20-01",
    },
    {
      name: "Page E",
      uv: 1890,
      PRICE: 4800,
      amt: 2181,
      date: "2010-20-01",
    },
    {
      name: "Page F",
      uv: 2390,
      PRICE: 3800,
      amt: 2500,
      date: "2010-20-01",
    },
    {
      name: "Page G",
      uv: 3490,
      PRICE: 4300,
      amt: 2100,
      date: "2010-20-01",
    },
  ];

  useEffect(() => {
    if (time === "7 days") {
      setRealData(data.splice(0, data.length > 7 ? 7 : data.length));
    } else if (time === "14 days") {
      setRealData(data.splice(0, data.length > 14 ? 14 : data.length));
    } else {
      setRealData(data.splice(0, data.length > 30 ? 30 : data.length));
    }
  }, [time]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="date">{`${realData[label].date}`}</p>
          <p className="desc">PRICE</p>
          <p className="label">{`${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={realData}>
        <Line
          type="monotone"
          dataKey="PRICE"
          stroke="#013220"
          strokeWidth={4}
          dot={false}
        />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
