"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";
import SvgLayer from "./SvgLayer";

type LogoKey = "clubBadge" | "frontSponsor" | "backSponsor";
type AccordionKey =
  | "select"
  | "garmentColours"
  | "designColours"
  | "logos"
  | "numbers"
  | "quote";

type LogoData = {
  original: string | null;
  transparent: string | null;
  removeBg: boolean;
};

const COLOUR_PALETTE = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Charcoal", value: "#36454F" },
  { name: "Dark Grey", value: "#4A4A4A" },
  { name: "Grey", value: "#808080" },
  { name: "Light Grey", value: "#D3D3D3" },
  { name: "Ecru / Cream", value: "#F5F5DC" },

  { name: "Red", value: "#E60000" },
  { name: "Dark Red", value: "#990000" },
  { name: "Maroon", value: "#800000" },
  { name: "Burgundy", value: "#65000B" },
  { name: "Cerise", value: "#DE3163" },

  { name: "Deep Orange", value: "#FF5500" },
  { name: "Light Orange", value: "#FF9933" },
  { name: "Amber", value: "#FFBF00" },
  { name: "Gold", value: "#FFD700" },
  { name: "Yellow", value: "#FFFF00" },

  { name: "Navy", value: "#000080" },
  { name: "Royal", value: "#4169E1" },
  { name: "Cobalt", value: "#0047AB" },
  { name: "Sky", value: "#87CEEB" },
  { name: "Cyan", value: "#00FFFF" },
  { name: "Teal", value: "#008080" },

  { name: "Bottle Green", value: "#004B23" },
  { name: "Dark Emerald", value: "#046307" },
  { name: "Forest Green", value: "#228B22" },
  { name: "Irish Green", value: "#009A44" },
  { name: "Emerald", value: "#00A877" },
  { name: "Light Emerald", value: "#50C878" },
  { name: "Mint", value: "#98FF98" },

  { name: "Purple", value: "#4B0082" },
  { name: "Violet", value: "#7F00FF" },
  { name: "Lilac", value: "#C8A2C8" },
  { name: "Magenta", value: "#FF00FF" },
  { name: "Pink", value: "#FFC0CB" },

  { name: "Fluorescent Yellow", value: "#CCFF00" },
  { name: "Fluorescent Green", value: "#39FF14" },
  { name: "Fluorescent Orange", value: "#FF5F1F" },
  { name: "Fluorescent Pink", value: "#FF1493" },
];

const BODY_DESIGN_COLOURS: Record<string, string[]> = {
  "001": ["C1"],
  "002": ["C1", "C2"],
  "003": ["C1"],
  "004": ["C1", "C2", "C3"],
  "005": ["C1"],
  "006": ["C1"],
  "007": ["C1", "C2", "C3", "C4", "C5"],
  "008": ["C1"],
  "009": ["C1", "C2"],
  "010": ["C1", "C2"],
  "011": ["C1", "C2"],
  "012": ["C1", "C2"],
  "013": ["C1", "C2"],
  "014": ["C1"],
  "015": ["C1", "C2"],
  "016": ["C1", "C2"],
  "017": ["C1", "C2", "C3"],
  "018": ["C1", "C2"],
  "019": ["C1"],
  "020": ["C1", "C2"],
  "021": ["C1", "C2", "C3"],
  "022": ["C1", "C2"],
  "023": ["C1"],
  "024": ["C1"],
  "025": ["C1", "C2"],
};

const SLEEVE_DESIGN_COLOURS: Record<string, string[]> = {
  "001": ["C1"],
  "002": ["C1", "C2"],
  "003": ["C1", "C2"],
  "004": ["C1", "C2"],
  "005": ["C1", "C2"],
  "006": ["C1", "C2"],
  "007": ["C1", "C2"],
  "008": ["C1", "C2"],
  "009": ["C1", "C2"],
  "010": ["C1"],
};

const COLLAR_DESIGN_COLOURS: Record<string, string[]> = {
  "001": ["C1"],
  "002": ["C1", "C2"],
  "003": ["C1", "C2"],
  "004": ["C1"],
  "005": ["C1"],
};

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

function getLogoSrc(logo: LogoData) {
  if (logo.removeBg && logo.transparent) return logo.transparent;
  return logo.original;
}

export default function KitRenderer() {
  const [openSections, setOpenSections] = useState<Record<AccordionKey, boolean>>({
    select: true,
    garmentColours: true,
    designColours: true,
    logos: false,
    numbers: false,
    quote: false,
  });

  const [bodyDesign, setBodyDesign] = useState("001");
  const [sleeveDesign, setSleeveDesign] = useState("001");
  const [collarDesign, setCollarDesign] = useState("001");
  const [brandingPos, setBrandingPos] = useState("POS1");

  const [fontStyle, setFontStyle] = useState("Font01");
  const [fontColour, setFontColour] = useState("#ffffff");
  const [showNumberBlock, setShowNumberBlock] = useState(false);
  const [numberBlockColour, setNumberBlockColour] = useState("#000000");

  const [clubName, setClubName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const [colours, setColours] = useState<Record<string, string>>({
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

  const [logos, setLogos] = useState<Record<LogoKey, LogoData>>({
    clubBadge: { original: null, transparent: null, removeBg: false },
    frontSponsor: { original: null, transparent: null, removeBg: false },
    backSponsor: { original: null, transparent: null, removeBg: false },
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

  const activeDesignColours = Array.from(
    new Set([
      ...(BODY_DESIGN_COLOURS[bodyDesign] ?? []),
      ...(SLEEVE_DESIGN_COLOURS[sleeveDesign] ?? []),
      ...(COLLAR_DESIGN_COLOURS[collarDesign] ?? []),
    ])
  ).sort();

  const toggleSection = (section: AccordionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateColour = (id: string, colour: string) => {
    setColours((prev) => ({ ...prev, [id]: colour }));
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

  const handleLogoUpload = async (key: LogoKey, file: File) => {
    const originalUrl = await fileToDataUrl(file);
    const transparentUrl = await removeWhiteBackgroundFromFile(file);

    setLogos((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        original: originalUrl,
        transparent: transparentUrl,
      },
    }));
  };

  const toggleLogoBackground = (key: LogoKey) => {
    setLogos((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        removeBg: !prev[key].removeBg,
      },
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

  const submitQuote = async () => {
    setSubmitting(true);
    setQuoteSuccess(false);

    let designImageUrl = "";

    try {
      const previewElement = document.getElementById("kit-preview");

      if (previewElement) {
        const dataUrl = await toPng(previewElement, {
          cacheBust: true,
          pixelRatio: 2,
        });

        const blob = await (await fetch(dataUrl)).blob();
        const fileName = `quote-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("quote-designs")
          .upload(fileName, blob, {
            contentType: "image/png",
          });

        if (uploadError) {
          console.error("Image upload failed:", uploadError);
        } else {
          const { data } = supabase.storage
            .from("quote-designs")
            .getPublicUrl(fileName);

          designImageUrl = data.publicUrl;
        }
      }
    } catch (imageError) {
      console.error("Design image capture failed:", imageError);
    }

    const { error } = await supabase.from("quotes").insert([
      {
        club_name: clubName,
        age_group: ageGroup,
        quantity,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_number: contactNumber,
        notes,
        body_design: bodyDesign,
        sleeve_design: sleeveDesign,
        collar_design: collarDesign,
        branding_position: brandingPos,
        number_font: fontStyle,
        number_colour: fontColour,
        colours,
        design_image_url: designImageUrl,
      },
    ]);

    if (error) {
      setSubmitting(false);
      console.error(error);
      alert("Quote failed");
      return;
    }

    const emailResponse = await fetch("/api/send-quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubName,
        ageGroup,
        quantity,
        contactName,
        contactEmail,
        contactNumber,
        bodyDesign,
        sleeveDesign,
        collarDesign,
        brandingPos,
        fontStyle,
        fontColour,
        showNumberBlock,
        numberBlockColour,
        notes,
        colours,
        designImageUrl,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("EMAIL ERROR:", emailResult);
      alert("Quote saved, but email failed. Check console.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setQuoteSuccess(true);
    setOpenSections((prev) => ({
      ...prev,
      quote: true,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 space-y-3 max-h-[85vh] overflow-y-auto">
          <AccordionSection
            title="1. Select Designs"
            open={openSections.select}
            onClick={() => toggleSection("select")}
          >
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
          </AccordionSection>

          <AccordionSection
            title="2. Garment Colours"
            open={openSections.garmentColours}
            onClick={() => toggleSection("garmentColours")}
          >
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
          </AccordionSection>

          <AccordionSection
            title="3. Design Colours"
            open={openSections.designColours}
            onClick={() => toggleSection("designColours")}
          >
            {activeDesignColours.length > 0 ? (
              activeDesignColours.map((colourId) => (
                <ColourTiles
                  key={colourId}
                  label={`Colour ${colourId.replace("C", "")}`}
                  value={colours[colourId]}
                  onChange={(value) => updateColour(colourId, value)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No extra design colours are used by the selected designs.
              </p>
            )}
          </AccordionSection>

          <AccordionSection
            title="4. Logos & Sponsors"
            open={openSections.logos}
            onClick={() => toggleSection("logos")}
          >
            <LogoControl
              label="Club Badge"
              logo={logos.clubBadge}
              onUpload={(file) => handleLogoUpload("clubBadge", file)}
              onToggle={() => toggleLogoBackground("clubBadge")}
            />

            <LogoControl
              label="Front Sponsor"
              logo={logos.frontSponsor}
              onUpload={(file) => handleLogoUpload("frontSponsor", file)}
              onToggle={() => toggleLogoBackground("frontSponsor")}
            />

            <LogoControl
              label="Back Sponsor"
              logo={logos.backSponsor}
              onUpload={(file) => handleLogoUpload("backSponsor", file)}
              onToggle={() => toggleLogoBackground("backSponsor")}
            />

            <p className="text-xs text-gray-500">
              Click a logo on the shirt to select it. Drag to move. Use the
              bottom-right handle to resize.
            </p>
          </AccordionSection>

          <AccordionSection
            title="5. Numbers"
            open={openSections.numbers}
            onClick={() => toggleSection("numbers")}
          >
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

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={showNumberBlock}
                onChange={(e) => setShowNumberBlock(e.target.checked)}
              />
              Add colour block behind number
            </label>

            {showNumberBlock && (
              <ColourTiles
                label="Number Block Colour"
                value={numberBlockColour}
                onChange={setNumberBlockColour}
              />
            )}

            <ColourTiles
              label="Branding Colour"
              value={colours.B1}
              onChange={updateBrandingColour}
            />
          </AccordionSection>

          <AccordionSection
            title="6. Request a Quote"
            open={openSections.quote}
            onClick={() => toggleSection("quote")}
          >
            {quoteSuccess && (
              <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800">
                <strong>Quote submitted successfully.</strong>
                <p className="mt-1">
                  We have received your design and will contact you shortly.
                </p>
              </div>
            )}

            <TextField
              label="Club Name"
              value={clubName}
              onChange={setClubName}
            />

            <TextField
              label="Age Group"
              value={ageGroup}
              onChange={setAgeGroup}
            />

            <TextField
              label="Estimated Quantity"
              value={quantity}
              onChange={setQuantity}
            />

            <TextField
              label="Contact Name"
              value={contactName}
              onChange={setContactName}
            />

            <TextField
              label="Contact Email"
              value={contactEmail}
              onChange={setContactEmail}
            />

            <TextField
              label="Contact Number"
              value={contactNumber}
              onChange={setContactNumber}
            />

            <textarea
              className="w-full border rounded p-2 min-h-24"
              placeholder="Extra notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              className="w-full bg-black text-white p-3 rounded font-semibold disabled:opacity-50"
              onClick={submitQuote}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Request Quote"}
            </button>
          </AccordionSection>
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

        {showNumberBlock && (
          <SvgLayer
            src="/assets/rugby/fonts/NumberBlock.svg"
            colours={{ NB1: numberBlockColour }}
          />
        )}

        <SvgLayer
          src={`/assets/rugby/fonts/${fontStyle}.svg`}
          colours={{ F1: fontColour }}
        />

        {getLogoSrc(logos.clubBadge) && (
          <DraggableLogo
            src={getLogoSrc(logos.clubBadge)!}
            logoKey="clubBadge"
            selected={selectedLogo === "clubBadge"}
            position={logoPositions.clubBadge}
            onMouseDown={startLogoAction}
          />
        )}

        {getLogoSrc(logos.frontSponsor) && (
          <DraggableLogo
            src={getLogoSrc(logos.frontSponsor)!}
            logoKey="frontSponsor"
            selected={selectedLogo === "frontSponsor"}
            position={logoPositions.frontSponsor}
            onMouseDown={startLogoAction}
          />
        )}

        {getLogoSrc(logos.backSponsor) && (
          <DraggableLogo
            src={getLogoSrc(logos.backSponsor)!}
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

function AccordionSection({
  title,
  open,
  onClick,
  children,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between bg-gray-100 px-4 py-3 font-bold text-left"
      >
        <span>{title}</span>
        <span className="text-xl leading-none">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="p-4 space-y-5">{children}</div>}
    </div>
  );
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

function LogoControl({
  label,
  logo,
  onUpload,
  onToggle,
}: {
  label: string;
  logo: LogoData;
  onUpload: (file: File) => void;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2 border rounded p-3">
      <LogoUpload label={label} onUpload={onUpload} />

      {logo.original && (
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={logo.removeBg}
            onChange={onToggle}
          />
          Remove white background
        </label>
      )}
    </div>
  );
}

function LogoUpload({
  label,
  onUpload,
}: {
  label: string;
  onUpload: (file: File) => void;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUpload(file);
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
  position: { left: number; top: number; width: number; height: number };
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

async function removeWhiteBackgroundFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!ctx) {
        resolve(url);
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (red > 220 && green > 220 && blue > 220) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const transparentUrl = canvas.toDataURL("image/png");

      URL.revokeObjectURL(url);

      resolve(transparentUrl);
    };

    image.onerror = () => {
      resolve(url);
    };

    image.src = url;
  });
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>

      <input
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}