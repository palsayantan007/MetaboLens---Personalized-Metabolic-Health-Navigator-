import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

interface DataPoint {
  x: number;
  y: number;
  cluster: number;
}

export default function HealthMap() {
  const d3Container = useRef(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cluster mappings from backend
    axios.get("http://localhost:8000/api/health-map")
      .then((res) => {
        setData(res.data.points || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch map data", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || data.length === 0 || !d3Container.current) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove(); // Clear previous render

    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d: DataPoint) => d.x) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, (d: DataPoint) => d.y) as [number, number])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain([...data.map(d => d.cluster.toString())])
      .range(['#38bdf8', '#fbbf24', '#f87171', '#34d399', '#a78bfa', '#fb7185', '#60a5fa', '#818cf8', '#c084fc', '#e879f9', '#2dd4bf']); // Premium bright tailwind colors

    const g = svg.append("g");

    // Add points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: DataPoint) => x(d.x))
      .attr("cy", (d: DataPoint) => y(d.y))
      .attr("r", 4)
      .attr("fill", (d: DataPoint) => color(d.cluster.toString()) as string)
      .attr("opacity", 0.6)
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 0.5)
      .style("filter", "drop-shadow(0px 0px 3px rgba(56, 189, 248, 0.3))")
      .on("mouseover", function() { d3.select(this).attr("opacity", 1).attr("r", 7).attr("stroke", "#fff"); })
      .on("mouseout", function() { d3.select(this).attr("opacity", 0.6).attr("r", 4).attr("stroke", "rgba(255,255,255,0.1)"); })
      .append("title")
      .text((d: DataPoint) => `Cluster ${d.cluster}`);

  }, [data, loading]);

  if (loading) return <div className="flex h-full items-center justify-center text-slate-500">Loading embeddings...</div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg
        className="w-full h-full min-h-[350px]"
        ref={d3Container}
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
