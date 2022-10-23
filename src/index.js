import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useReplicant } from "use-nodecg";
import { HlsPlayer } from "./HlsPlayer.js";
import { SyncContext } from "./context"
import { usePlayRateMagic } from "./hooks/useSync"

const SyncingComponent = () => {
  usePlayRateMagic()
  return <></>
}

// This component will re-render when the timer's replicant value changes
function App() {
  // get timer replicant from nodecg-speedcontrol
  const [timer, setTimer] = useReplicant("timer", 0, {
    namespace: "nodecg-speedcontrol",
  });
  const [timings, setTimings] = useState({})
  const [doSync, setDoSync] = useState(false)
  const streams = ['banana', 'blue', 'apple']
  useEffect(() => {
    streams.forEach((stream) => {
      const new_timing = {
        time: "",
        wallTime: "",
        playbackRate: 1
      }
      setTimings((old_timings) => {
        old_timings[stream] = new_timing
        return old_timings
      })
    })
  }, [])

  return (
    <SyncContext.Provider value={{ timings, setTimings, doSync, setDoSync }} >
      <SyncingComponent />

      <div>
        <HlsPlayer src="https://us.popola.dev/hls/blue.m3u8" id='blue' />
        <HlsPlayer src="https://us.popola.dev/hls/banana.m3u8" id='banana' />
        <HlsPlayer src="https://us.popola.dev/hls/apple.m3u8" id='apple' />
      </div>
    </SyncContext.Provider>
  );
}

const root = document.getElementById("app");
ReactDOM.render(<App />, root);
