import React, { useEffect, useState, useContext } from "react";
import { SyncContext } from "../context"
import { useOcr } from "./useOcr";

const usePlayRateMagic = () => {
    const { timings, setTimings, doSync, setDoSync } = useContext(SyncContext)
    useEffect(() => {
        const values = []
        if (doSync) {
            Object.entries(timings).forEach(([key, value]) => {
                console.log(key)
                console.log(value)
                values.push({ streamName: key, ...value })
            });
            console.log(values.sort((a, b) => { return b.time - a.time - ((b.wallTime - a.wallTime) / 1000) }))
            const slowest = values.pop()
            console.log(`The slowest stream is ${slowest.streamName}`)
            values.forEach((feed) => {
                const wall_diff = feed.wallTime - slowest.wallTime
                const difference = feed.time - slowest.time - (wall_diff / 1000)
                console.log(`Difference in wall time from ${feed.streamName} to ${slowest.streamName} is ${wall_diff}`)
                if (difference < 10) {

                    console.log(`${feed.streamName} is ${difference} faster, delaying for ${difference * 2} seconds`)
                    setTimings((old_timing) => {
                        old_timing[feed.streamName].playbackRate = 0.5
                        console.log(old_timing)
                        return { ...old_timing }
                    })
                    setTimeout(() => {
                        console.log("Putting stream back to normal speed")
                        setTimings((old_timing) => {
                            old_timing[feed.streamName].playbackRate = 1
                            return { ...old_timing }
                        })
                    }, difference * 2 * 1000)
                } else {
                    console.log(`difference is ${difference}, likely error? `)
                }
            })
            setDoSync(false)

        }
    }, [doSync])

}

const useSync = (streamName) => {
    const { time, initialized, wallTime } = useOcr(streamName)
    const { timings, setTimings, doSync, setDoSync } = useContext(SyncContext)
    const [timing, setTiming] = useState({ playbackRate: 1 })
    useEffect(() => {
        console.log("Timing should be updated")
        if (timings[streamName]) {
            setTiming(timings[streamName])
            console.log(timing.playbackRate)
        }
    }, [timings, initialized])

    useEffect(() => {
        if (timings[streamName])
            setTimings((old_timing) => {
                const new_timing = {
                    time: time,
                    wallTime: wallTime,
                    playbackRate: 1
                }
                old_timing[streamName] = new_timing
                return old_timing
            })
    }, [time])


    return [timing.playbackRate]

}
export { useSync, usePlayRateMagic }