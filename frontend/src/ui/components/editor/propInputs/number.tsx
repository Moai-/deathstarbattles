import { BasePropInput, isNullish, PropInput } from "./base";

const roundTo = (val: string | number, decimals?: number) => {
  if (typeof decimals !== 'number') {
    return val;
  }
  let res = val;
  if (typeof val === 'string') {
    const numeric = parseFloat(val);
    if (isNaN(numeric)) {
      return val;
    }
    res = numeric;
  }
  const coefficient = parseInt(`1${new Array<number>(decimals).fill(0).join('')}`, 10);
  return (Math.round(res as number * coefficient) / coefficient).toFixed(decimals);
}

export const NumberInput: React.FC<PropInput> = ({step, precision, propKey, description, id, value, onChange}) => (
  <BasePropInput 
    id={id}
    propKey={propKey}
    description={description}
    input={(
      <input
        id={id}
        type="number"
        step={step ?? 1}
        value={isNullish(value) ? "" : String(roundTo(value, precision))}
        onChange={(e) => onChange(e.target.value, value)}
        style={{ width: 150 }}
      />
    )}
  />
)