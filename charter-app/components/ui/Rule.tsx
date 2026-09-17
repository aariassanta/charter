import React from "react";

/** Hairline horizontal divider. */
export function Rule({ style }: { style?: React.CSSProperties }) {
  return <hr className="rule" style={style} />;
}
