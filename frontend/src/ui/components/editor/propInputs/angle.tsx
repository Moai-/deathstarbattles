import { BasePropInput, isNullish, PropInput } from "./base";

export const AngleInput: React.FC<PropInput> = ({step, propKey, description, id, value, onChange}) => (
  <BasePropInput 
    id={id}
    propKey={propKey}
    description={description}
    input={(
      <input
        id={id}
        type="range"
        min="-180"
        max="180"
        step={step ?? 0.5}
        value={isNullish(value) ? "" : String((typeof value === 'number' ? value : parseInt(value, 10)) * (180 / Math.PI))}
        onChange={(e) => onChange(String(parseInt(e.target.value, 10) * (Math.PI / 180)), value)}
        style={{ width: 150 }}
      />
    )}
  />
)