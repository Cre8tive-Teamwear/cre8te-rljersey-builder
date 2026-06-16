<>
  <ColorPicker
    label="Body Colour"
    value={colours["body-base"]}
    onChange={(v: string) =>
      updateColour("body-base", v)
    }
  />

  <ColorPicker
    label="Sleeve Colour"
    value={colours["sleeve-base"]}
    onChange={(v: string) =>
      updateColour("sleeve-base", v)
    }
  />

  <ColorPicker
    label="Collar Colour"
    value={colours["collar-base"]}
    onChange={(v: string) =>
      updateColour("collar-base", v)
    }
  />

  <ColorPicker
    label="Trim Colour"
    value={colours["trim-base"]}
    onChange={(v: string) =>
      updateColour("trim-base", v)
    }
  />

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

  <ColorPicker
    label="Colour 1"
    value={colours.C1}
    onChange={(v: string) =>
      updateColour("C1", v)
    }
  />

  <ColorPicker
    label="Colour 2"
    value={colours.C2}
    onChange={(v: string) =>
      updateColour("C2", v)
    }
  />

  <ColorPicker
    label="Colour 3"
    value={colours.C3}
    onChange={(v: string) =>
      updateColour("C3", v)
    }
  />

  <ColorPicker
    label="Colour 4"
    value={colours.C4}
    onChange={(v: string) =>
      updateColour("C4", v)
    }
  />

  <ColorPicker
    label="Colour 5"
    value={colours.C5}
    onChange={(v: string) =>
      updateColour("C5", v)
    }
  />
</>