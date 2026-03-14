import { BasePropInput, PropInput } from "./base";

export const EnumInput: React.FC<PropInput> = ({ propKey, description, id, enumValues, value, onChange}) => (
  <BasePropInput 
    id={id}
    propKey={propKey}
    description={description}
    input={(
      <select style={{width: 160}} id={id} value={value ?? ''} onChange={(evt) => onChange(evt.target.value, value)}>
        {enumValues?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )}
  />
)