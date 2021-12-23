import React from "react";
import ReactDOM from "react-dom";
import { useReplicant } from "use-nodecg";

export function Temp() {
  return <div>test</div>;
}

const root = document.getElementById("app");
ReactDOM.render(<Temp />, root);
