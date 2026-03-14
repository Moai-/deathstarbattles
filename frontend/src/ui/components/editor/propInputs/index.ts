import { EditorControlType } from "shared/src/utils";
import { PropInput } from "./base";
import { NumberInput } from "./number";
import { EnumInput } from "./enum";
import { ColourInput } from "./colour";
import { AngleInput } from "./angle";

export const ControlRecord: Record<EditorControlType, React.FC<PropInput>> = {
  "number": NumberInput,
  "slider": NumberInput,
  "colour": ColourInput,
  "enum": EnumInput,
  "time": NumberInput,
  "entity": NumberInput,
  "angle": AngleInput,
  "checkbox": NumberInput,
}