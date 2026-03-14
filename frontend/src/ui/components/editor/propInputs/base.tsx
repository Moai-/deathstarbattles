type BasePropInputProps = {
  propKey: string;
  input: React.ReactElement;
  description?: string;
  id: string;
}

export type PropInput = {
  // number
  step?: number;
  precision?: number;

  // enum
  enumValues?: ReadonlyArray<{label: string, value: string | number}>;

  // generic
  value?: number | string | null;
  description?: string;
  propKey: string;
  id: string;
  onChange: (rawValue: string, value: unknown) => void;
}

export const BasePropInput: React.FC<BasePropInputProps> = ({propKey, id, input, description}) => (
  <div key={propKey} style={{ marginBottom: 4, display: "flex", maxWidth: 380 }}>
    <label
      htmlFor={id}
      style={{ display: "inline-block", width: 170 }}
      title={description}
    >
      {propKey}
    </label>
    {input}
  </div>
)

export const isNullish = (value: unknown) => value === null || value === undefined;
