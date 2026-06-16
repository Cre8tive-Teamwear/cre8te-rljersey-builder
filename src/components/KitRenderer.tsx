"use client";

import React, { useRef, useState } from "react";
import SvgLayer from "./SvgLayer";

type Tab = "select" | "colours" | "embellishments" | "quote";
type LogoKey = "clubBadge" | "frontSponsor" | "backSponsor";

const COLOUR_PALETTE = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#c8102e" },
  { name: "Maroon", value: "#800020" },
  { name: "Royal Blue", value: "#0057b8" },
  { name: "Navy", value: "#001f5b" },
  { name: "Sky Blue", value: "#6ec6ff" },
  { name: "Gold", value: "#ffd700" },
  { name: "Yellow", value: "#ffeb3b" },
  { name: "Orange", value: "#ff6f00" },
  { name: "Green", value: "#00843d" },
  { name: "Lime", value: "#7fff00" },
  { name: "Purple", value: "#6a0dad" },
  { name: "Pink", value: "#ff69b4" },
  { name: "Grey", value: "#808080" },
];

const LOGO_ZONES = {
  clubBadge: {
    x: 1974.76334,
    y: 777.5394,
    width: 342.58448,
    height: 342.58448,
  },
  frontSponsor: {
    x: 1213.968,
    y: 1192.86548,
    width: 1103.37983,
    height: 441.29287,
  },
  backSponsor: {
    x: 3682.79147,
    y: 1882.86768,
    width: 1103.37983,
    height: 441.29287,
  },
};

function zoneToPercent(zone: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return {
    left: (zone.x / 6000) * 100,
    top: (zone.y / 3000) * 100,
    width: (zone.width / 6000) * 100,
    height: (zone.height / 3000) * 100,
  };
}

export default function KitRenderer() {
  const [activeTab, setActiveTab] = useState<Tab>("select");

  const [bodyDesign, setBodyDesign] = useState("001");
  const [sleeveDesign, setSleeveDesign] = useState("001");
  const [collarDesign, setCollarDesign] = useState("001");
  const [brandingPos, setBrandingPos] = useState("POS1");

  const [fontStyle, setFontStyle] = useState("Font01");
  const [fontColour, setFontColour] = useState("#ffffff");

  const [colours, setColours] = useState({
"body-base": "#ffffff",
"sleeve-base": "#ffffff",

"collar-base": "#ffffff",
"collars-base": "#ffffff",
collar: "#ffffff",
collar_base: "#ffffff",

"trim-base": "#000000",

C1: "#a41123",
C2: "#ffffff",
C3: "#000000",
C4: "#ffd700",
C5: "#808080",

B1: "#000000",
B2: "#000000",
B3: "#000000",
});


  const [logos, setLogos] = useState<Record<LogoKey, string | null>>({
    clubBadge: null,
    frontSponsor: null,
    backSponsor: null,
  });

  const [logoPositions, setLogoPositions] = useState({
    clubBadge: zoneToPercent(LOGO_ZONES.clubBadge),
    frontSponsor: zoneToPercent(LOGO_ZONES.frontSponsor),
    backSponsor: zoneToPercent(LOGO_ZONES.backSponsor),
  });

  const [selectedLogo, setSelectedLogo] = useState<LogoKey | null>(null);

  const dragRef = useRef<{
    key: LogoKey;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const bodyOptions = Array.from({ length: 25 }, (_, i) =>
    String(i + 1).padStart(3, "0")
  );

  const sleeveOptions = Array.from({ length: 10 }, (_, i) =>
    String(i + 1).padStart(3, "0")
  );

  const collarOptions = Array.from({ length: 5 }, (_, i) =>
    String(i + 1).padStart(3, "0")
  );

  const fontOptions = Array.from({ length: 10 }, (_, i) =>
    `Font${String(i + 1).padStart(2, "0")}`
  );

  const updateColour = (id: string, colour: string) => {
    setColours((prev) => ({
      ...prev,
      [id]: colour,
    }));
  };

  const updateCollarColour = (colour: string) => {
setColours((prev) => ({
...prev,

"collar-base": colour,
"collars-base": colour,

collar: colour,
collar_base: colour,

}));
};
  const updateBrandingColour = (colour: string) => {
    setColours((prev) => ({
      ...prev,
      B1: colour,
      B2: colour,
      B3: colour,
    }));
  };

  const handleLogoUpload = (key: LogoKey, url: string) => {
    setLogos((prev) => ({
      ...prev,
      [key]: url,
    }));
  };

  const startLogoAction = (
    e: React.MouseEvent,
    key: LogoKey,
    mode: "move" | "resize"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedLogo(key);

    const pos = logoPositions[key];

    dragRef.current = {
      key,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: pos.left,
      startTop: pos.top,
      startWidth: pos.width,
      startHeight: pos.height,
    };

    window.addEventListener("mousemove", handleLogoMove);
    window.addEventListener("mouseup", stopLogoAction);
  };

  const handleLogoMove = (event: MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const preview = document.getElementById("kit-preview");
    if (!preview) return;

    const rect = preview.getBoundingClientRect();

    const dxPercent = ((event.clientX - drag.startX) / rect.width) * 100;
    const dyPercent = ((event.clientY - drag.startY) / rect.height) * 100;

    setLogoPositions((prev) => {
      if (drag.mode === "move") {
        return {
          ...prev,
          [drag.key]: {
            ...prev[drag.key],
            left: drag.startLeft + dxPercent,
            top: drag.startTop + dyPercent,
          },
        };
      }

      return {
        ...prev,
        [drag.key]: {
          ...prev[drag.key],
          width: Math.max(2, drag.startWidth + dxPercent),
          height: Math.max(2, drag.startHeight + dyPercent),
        },
      };
    });
  };

  const stopLogoAction = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", handleLogoMove);
    window.removeEventListener("mouseup", stopLogoAction);
  };

  const quoteSummary = {
    bodyDesign,
    sleeveDesign,
    collarDesign,
    brandingPos,
    fontStyle,
    fontColour,
    colours,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-2 border-b text-sm">
          <TabButton
            label="Select Designs"
            active={activeTab === "select"}
            onClick={() => setActiveTab("select")}
          />

          <TabButton
            label="Design Colours"
            active={activeTab === "colours"}
            onClick={() => setActiveTab("colours")}
          />

          <TabButton
            label="Embellishments"
            active={activeTab === "embellishments"}
            onClick={() => setActiveTab("embellishments")}
          />

          <TabButton
            label="Request Quote"
            active={activeTab === "quote"}
            onClick={() => setActiveTab("quote")}
          />
        </div>

        <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
          {activeTab === "select" && (
            <>
              <SectionTitle title="Select Designs" />

              <SelectField
                label="Body Design"
                value={bodyDesign}
                setValue={setBodyDesign}
                options={bodyOptions}
              />

              <SelectField
                label="Sleeve Design"
                value={sleeveDesign}
                setValue={setSleeveDesign}
                options={sleeveOptions}
              />

              <SelectField
                label="Collar Design"
                value={collarDesign}
                setValue={setCollarDesign}
                options={collarOptions}
              />

              <SelectField
                label="Branding Position"
                value={brandingPos}
                setValue={setBrandingPos}
                options={["POS1", "POS2", "POS3", "POS4"]}
              />
            </>
          )}

          {activeTab === "colours" && (
            <>
              <SectionTitle title="Garment Colours" />

              <ColourTiles
                label="Body Colour"
                value={colours["body-base"]}
                onChange={(value) => updateColour("body-base", value)}
              />

              <ColourTiles
                label="Sleeve Colour"
                value={colours["sleeve-base"]}
                onChange={(value) => updateColour("sleeve-base", value)}
              />

              <ColourTiles
                label="Collar Colour"
                value={colours["collar-base"]}
                onChange={updateCollarColour}
              />

              <ColourTiles
                label="Trim Colour"
                value={colours["trim-base"]}
                onChange={(value) => updateColour("trim-base", value)}
              />

              <SectionTitle title="Design Colours" />

              <ColourTiles
                label="Colour 1"
                value={colours.C1}
                onChange={(value) => updateColour("C1", value)}
              />

              <ColourTiles
                label="Colour 2"
                value={colours.C2}
                onChange={(value) => updateColour("C2", value)}
              />

              <ColourTiles
                label="Colour 3"
                value={colours.C3}
                onChange={(value) => updateColour("C3", value)}
              />

              <ColourTiles
                label="Colour 4"
                value={colours.C4}
                onChange={(value) => updateColour("C4", value)}
              />

              <ColourTiles
                label="Colour 5"
                value={colours.C5}
                onChange={(value) => updateColour("C5", value)}
              />
            </>
          )}

          {activeTab === "embellishments" && (
            <>
              <SectionTitle title="Logos" />

              <LogoUpload
                label="Club Badge"
                onUpload={(url) => handleLogoUpload("clubBadge", url)}
              />

              <LogoUpload
                label="Front Sponsor"
                onUpload={(url) => handleLogoUpload("frontSponsor", url)}
              />

              <LogoUpload
                label="Back Sponsor"
                onUpload={(url) => handleLogoUpload("backSponsor", url)}
              />

              <p className="text-xs text-gray-500">
                Click a logo on the shirt to select it. Drag to move. Use the
                bottom-right handle to resize.
              </p>

              <SectionTitle title="Numbers" />

              <SelectField
                label="Number Font"
                value={fontStyle}
                setValue={setFontStyle}
                options={fontOptions}
              />

              <ColourTiles
                label="Number Colour"
                value={fontColour}
                onChange={setFontColour}
              />

              <SectionTitle title="Branding" />

              <ColourTiles
                label="Branding Colour"
                value={colours.B1}
                onChange={updateBrandingColour}
              />
            </>
          )}

          {activeTab === "quote" && (
            <>
              <SectionTitle title="Request a Quote" />

              <TextField label="Club Name" />
              <TextField label="Age Group" />
              <TextField label="Estimated Quantity" />
              <TextField label="Contact Name" />
              <TextField label="Contact Email" />
              <TextField label="Contact Number" />

              <textarea
                className="w-full border rounded p-2 min-h-24"
                placeholder="Extra notes"
              />

              <button
                className="w-full bg-black text-white p-3 rounded font-semibold"
                onClick={() => {
                  console.log("QUOTE SUMMARY:", quoteSummary);
                  alert("Quote request ready. Next step: connect this to email.");
                }}
              >
                Request Quote
              </button>

              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(quoteSummary, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>

      <div
        id="kit-preview"
        className="relative aspect-[2/1] w-full overflow-hidden bg-neutral-100 rounded-lg"
        onMouseDown={() => setSelectedLogo(null)}
      >
        <SvgLayer src="/assets/rugby/base/Rugby.svg" colours={colours} />

        <SvgLayer
          src={`/assets/rugby/body/body-${bodyDesign}.svg`}
          colours={colours}
        />

        <SvgLayer
          src={`/assets/rugby/sleeves/Sleeve-${sleeveDesign}.svg`}
          colours={colours}
        />

        <SvgLayer
          src={`/assets/rugby/collars/collar-${collarDesign}.svg`}
          colours={colours}
        />

        <SvgLayer
          src={`/assets/rugby/branding/${brandingPos}.svg`}
          colours={colours}
        />

        <SvgLayer
          src={`/assets/rugby/fonts/${fontStyle}.svg`}
          colours={{
            F1: fontColour,
          }}
        />

        {logos.clubBadge && (
          <DraggableLogo
            src={logos.clubBadge}
            logoKey="clubBadge"
            selected={selectedLogo === "clubBadge"}
            position={logoPositions.clubBadge}
            onMouseDown={startLogoAction}
          />
        )}

        {logos.frontSponsor && (
          <DraggableLogo
            src={logos.frontSponsor}
            logoKey="frontSponsor"
            selected={selectedLogo === "frontSponsor"}
            position={logoPositions.frontSponsor}
            onMouseDown={startLogoAction}
          />
        )}

        {logos.backSponsor && (
          <DraggableLogo
            src={logos.backSponsor}
            logoKey="backSponsor"
            selected={selectedLogo === "backSponsor"}
            position={logoPositions.backSponsor}
            onMouseDown={startLogoAction}
          />
        )}

        <img
          src="/assets/rugby/overlay/RJFull.png"
          alt="Overlay"
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`p-3 font-semibold border-b ${
        active ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-lg font-bold border-b pb-2">{title}</h3>;
}

function SelectField({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded p-2"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColourTiles({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="font-semibold">{label}</label>
        <span className="text-xs font-mono text-gray-500">{value}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {COLOUR_PALETTE.map((colour) => (
          <button
            key={`${label}-${colour.value}`}
            type="button"
            title={colour.name}
            onClick={() => onChange(colour.value)}
            className={`w-8 h-8 rounded-full border-2 transition ${
              value.toLowerCase() === colour.value.toLowerCase()
                ? "border-black scale-110"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: colour.value }}
          />
        ))}
      </div>
    </div>
  );
}

function LogoUpload({
  label,
  onUpload,
}: {
  label: string;
  onUpload: (url: string) => void;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUpload(URL.createObjectURL(file));
  };

  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="w-full"
      />
    </div>
  );
}

function DraggableLogo({
  src,
  logoKey,
  selected,
  position,
  onMouseDown,
}: {
  src: string;
  logoKey: LogoKey;
  selected: boolean;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  onMouseDown: (
    e: React.MouseEvent,
    key: LogoKey,
    mode: "move" | "resize"
  ) => void;
}) {
  return (
    <div
      className={`absolute z-20 cursor-move ${
        selected ? "outline outline-2 outline-blue-500" : ""
      }`}
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      }}
      onMouseDown={(e) => onMouseDown(e, logoKey, "move")}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain pointer-events-none"
      />

      {selected && (
        <button
          type="button"
          className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full cursor-se-resize"
          onMouseDown={(e) => onMouseDown(e, logoKey, "resize")}
        />
      )}
    </div>
  );
}

function TextField({ label }: { label: string }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input className="w-full border rounded p-2" />
    </div>
  );
}