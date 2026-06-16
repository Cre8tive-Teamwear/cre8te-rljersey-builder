"use client";

import { useEffect, useState } from "react";

interface SvgLayerProps {
  src: string;
  colours: Record<string, string>;
}

export default function SvgLayer({ src, colours }: SvgLayerProps) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    async function loadSvg() {
      try {
        const response = await fetch(src);
        const svgText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");

        Object.entries(colours).forEach(([id, colour]) => {
          const elements = doc.querySelectorAll(`[id="${id}"]`);

          elements.forEach((element) => {
            element.setAttribute("fill", colour);
            (element as SVGElement).style.fill = colour;
            element.removeAttribute("class");
          });
        });

        const svg = doc.querySelector("svg");

        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }

        setSvgContent(new XMLSerializer().serializeToString(doc));
      } catch (error) {
        console.error("SVG Load Error:", error);
      }
    }

    loadSvg();
  }, [src, colours]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}