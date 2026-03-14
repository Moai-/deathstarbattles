import { useState } from "react";
import { BasePropInput, PropInput } from "./base";
import { rgb, ui32ToRgb } from "shared/src/utils";
import { Sketch, rgbToHex } from "@uiw/react-color";

export const ColourInput: React.FC<PropInput> = ({ propKey, description, id, value, onChange}) => (
  <BasePropInput 
    id={id}
    propKey={propKey}
    description={description}
    input={<ColourPicker colour={value} onChange={(newColour) => onChange(String(newColour), value)} />}
  />
)

type ColourPickerProps = {
  colour?: string | number | null;
  onChange: (newColour: number) => void;
}

const ColourPicker: React.FC<ColourPickerProps> = ({colour, onChange}) => {
  const [showInput, setShowInput] = useState(false);
  const parsedColour = typeof colour === 'string'
    ? parseInt(colour, 10)
    : colour === null
      ? 0
      : colour as number;
  const convertableColour = ui32ToRgb(parsedColour);
  const hex = rgbToHex(convertableColour);
  const toggleInput = () => {
    setShowInput(!showInput);
  }
  return (
    <div style={{width: 160, position: 'relative'}}>
      <div 
        onClick={toggleInput} 
        style={{height: 20, width: 20, margin: 1, borderRadius: 5, backgroundColor: hex, float: 'right'}} />
      {showInput && (
        <div style={{position: 'absolute', top: '100%', right: 1}}>
          <Sketch 
            color={hex}
            disableAlpha
            onChange={(newShade) => onChange(rgb(newShade.rgb).num())}
          />
        </div>
      )}
    </div>
  )
}