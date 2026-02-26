import { RefObject } from "react";

export type SelectionMenuItem<T> = {
  label: string;
  value: T;
};

export type SelectionMenuProps<T> = {
  /** When null, menu is not rendered */
  position: { x: number; y: number } | null;
  title: string;
  items: SelectionMenuItem<T>[];
  onSelect: (value: T) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  width?: number;
};

export function SelectionMenu<T>(props: SelectionMenuProps<T>) {
  const {
    position,
    title,
    items,
    onSelect,
    menuRef,
    width = 240,
  } = props;

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        border: "1px solid #999",
        background: "white",
        padding: 6,
        zIndex: 999,
        width,
      }}
    >
      <div style={{ marginBottom: 6, fontWeight: 600 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {items.map((item, index) => (
          <li key={item.label + String(index)}>
            <button
              type="button"
              onClick={() => onSelect(item.value)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
