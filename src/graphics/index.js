import React from "react";
import ReactDOM from "react-dom";
import { useReplicant } from "use-nodecg";

// This component will re-render when the timer's replicant value changes
export function Timer() {
  // get timer replicant from nodecg-speedcontrol
  const [timer, setTimer] = useReplicant("timer", 0, {
    namespace: "nodecg-speedcontrol",
  });

  return (
    <div>
      <div>{timer.time}</div>
      <button
        onClick={() =>
          setTimer({
            time: "00:00:00",
            state: "stopped",
            milliseconds: 0,
            timestamp: 0,
            teamFinishTimes: {},
          })
        }
      />
    </div>
  );
}

const root = document.getElementById("app");
ReactDOM.render(<Timer />, root);
