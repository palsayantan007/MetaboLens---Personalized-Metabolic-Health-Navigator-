'use client';

import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { HealthMapData } from '@/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Map, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HealthMapVisualizerProps {
  healthMapData: HealthMapData;
  patientPosition: [number, number];
  clusterId: number;
}

export function HealthMapVisualizer({
  healthMapData,
  patientPosition,
  clusterId,
}: HealthMapVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; cluster: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !healthMapData.reference_points.length) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 450;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#fafbfc')
      .attr('rx', 12);

    // Calculate scales
    const xExtent = d3.extent(healthMapData.reference_points, d => d.x) as [number, number];
    const yExtent = d3.extent(healthMapData.reference_points, d => d.y) as [number, number];

    const padding = 3;
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - padding, xExtent[1] + padding])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - padding, yExtent[1] + padding])
      .range([height - margin.bottom, margin.top]);

    // Grid lines
    const xTicks = xScale.ticks(8);
    const yTicks = yScale.ticks(8);

    svg.append('g')
      .selectAll('line')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);

    svg.append('g')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);

    // Color scale for clusters
    const getClusterColor = (cluster_id: number, is_healthy: boolean) => {
      if (is_healthy) return '#10b981';
      if (cluster_id === -1) return '#94a3b8';
      const colors = ['#f59e0b', '#ef4444', '#f97316', '#ec4899', '#8b5cf6', '#06b6d4'];
      return colors[Math.abs(cluster_id) % colors.length];
    };

    // Draw reference points (subsampled for performance)
    const sampledPoints = healthMapData.reference_points.filter((_, i) => i % 4 === 0);

    svg.append('g')
      .selectAll('circle')
      .data(sampledPoints)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', d => getClusterColor(d.cluster_id, d.is_healthy))
      .attr('opacity', 0.35)
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5);

    // Highlight patient's cluster region
    const patientClusterPoints = healthMapData.reference_points.filter(p => p.cluster_id === clusterId);
    if (patientClusterPoints.length > 5) {
      const clusterColor = getClusterColor(clusterId, healthMapData.cluster_info[String(clusterId)]?.is_healthy || false);
      
      // Draw cluster boundary using convex hull approximation
      const hull = d3.polygonHull(patientClusterPoints.map(p => [xScale(p.x), yScale(p.y)] as [number, number]));
      
      if (hull) {
        svg.append('path')
          .attr('d', `M${hull.join('L')}Z`)
          .attr('fill', clusterColor)
          .attr('fill-opacity', 0.1)
          .attr('stroke', clusterColor)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '6,4')
          .attr('stroke-opacity', 0.5);
      }
    }

    // Patient pulse effect
    const pulseGroup = svg.append('g');
    
    for (let i = 0; i < 3; i++) {
      pulseGroup.append('circle')
        .attr('cx', xScale(patientPosition[0]))
        .attr('cy', yScale(patientPosition[1]))
        .attr('r', 15 + i * 10)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .delay(i * 400)
        .duration(1600)
        .ease(d3.easeQuadOut)
        .attr('r', 40 + i * 15)
        .attr('opacity', 0.3)
        .transition()
        .duration(400)
        .attr('opacity', 0)
        .on('end', function repeat() {
          d3.select(this)
            .attr('r', 15 + i * 10)
            .attr('opacity', 0)
            .transition()
            .delay(i * 400)
            .duration(1600)
            .ease(d3.easeQuadOut)
            .attr('r', 40 + i * 15)
            .attr('opacity', 0.3)
            .transition()
            .duration(400)
            .attr('opacity', 0)
            .on('end', repeat);
        });
    }

    // Patient marker
    const patientGroup = svg.append('g');

    patientGroup.append('circle')
      .attr('cx', xScale(patientPosition[0]))
      .attr('cy', yScale(patientPosition[1]))
      .attr('r', 14)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .attr('filter', 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))');

    patientGroup.append('text')
      .attr('x', xScale(patientPosition[0]))
      .attr('y', yScale(patientPosition[1]) - 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('fill', '#1e40af')
      .text('YOUR POSITION');

    // Legend
    const legendData = [
      { color: '#10b981', label: 'Healthy Zone' },
      { color: '#f59e0b', label: 'At-Risk Zone' },
      { color: '#3b82f6', label: 'You' },
    ];

    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);

    legend.append('rect')
      .attr('x', -10)
      .attr('y', -10)
      .attr('width', 110)
      .attr('height', 80)
      .attr('fill', 'white')
      .attr('rx', 8)
      .attr('stroke', '#e2e8f0');

    legendData.forEach((item, i) => {
      legend.append('circle')
        .attr('cx', 5)
        .attr('cy', i * 22 + 8)
        .attr('r', 6)
        .attr('fill', item.color);

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 22 + 12)
        .attr('font-size', '11px')
        .attr('fill', '#475569')
        .text(item.label);
    });

    // Axes labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text('UMAP Dimension 1');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text('UMAP Dimension 2');

  }, [healthMapData, patientPosition, clusterId]);

  return (
    <Card className="h-full">
      <div className="p-6">
        <CardHeader
          title="Health Map"
          subtitle="Your position in the metabolic health landscape"
          icon={<Map className="w-5 h-5" />}
          action={
            <Badge variant="info" size="sm">
              UMAP 2D Projection
            </Badge>
          }
        />

        <div ref={containerRef} className="relative rounded-xl overflow-hidden">
          <svg ref={svgRef} className="w-full" />
          
          {tooltip && (
            <div
              className="health-tooltip"
              style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
            >
              <div className="font-semibold">{tooltip.cluster}</div>
              <div className="text-xs opacity-80">{tooltip.content}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-healthcare-400">
          <span>Based on 1,982 reference samples from 64 subjects</span>
          <span>Silhouette Score: 0.747</span>
        </div>
      </div>
    </Card>
  );
}
