import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Hypergraph } from '../lib/types/hypergraph';

interface HypergraphViewProps {
  hypergraph: Hypergraph;
}

export function HypergraphView({ hypergraph }: HypergraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create force simulation
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d: any) => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Prepare data
    const nodes = Object.entries(hypergraph.nodes).map(([id, node]) => ({
      id,
      ...node
    }));

    const links = Object.entries(hypergraph.hyperedges).map(([id, edge]) => ({
      source: edge.nodes[0],
      target: edge.nodes[1],
      relationships: edge.relationships
    }));

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    // Add nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#69b3a2");

    // Add titles
    node.append("title")
      .text(d => d.title);

    // Update positions
    simulation
      .nodes(nodes)
      .on("tick", () => {
        link
          .attr("x1", d => (d as any).source.x)
          .attr("y1", d => (d as any).source.y)
          .attr("x2", d => (d as any).target.x)
          .attr("y2", d => (d as any).target.y);

        node
          .attr("cx", d => (d as any).x)
          .attr("cy", d => (d as any).y);
      });

    (simulation.force("link") as d3.ForceLink<any, any>)
      .links(links);

    return () => {
      simulation.stop();
    };
  }, [hypergraph]);

  return (
    <svg
      ref={svgRef}
      width="800"
      height="600"
      className="bg-white rounded-lg shadow-md"
    />
  );
}