import React, { useEffect, useState, useMemo, useContext } from "react";
import ReactDOM from "react-dom";
import { useReplicant } from "use-nodecg";
import ReactHlsPlayer from 'react-hls-player'
import { useOcr } from "./hooks/useOcr";
import { useSync } from "./hooks/useSync";
import { SyncContext } from "./context";

const HlsPlayer = ({ src, ...props }) => {
    const { setDoSync } = useContext(SyncContext)
    const [playbackRate] = useSync(props.id)
    const renderVideo = useMemo(() => {
        // https://www.tilcode.com/react-fixing-flickering-video-redraw/
        return <ReactHlsPlayer
            src={src}
            autoPlay={true}
            controls={true}
            width={1280}
            height="auto"
            id={props.id}
        />

    }, [src, props.id])
    useEffect(() => {
        if (props.playbackRate) {
            const video = document.getElementById(props.id)
            video.playbackRate = props.playbackRate
        }
    }, [props.playbackRate])
    useEffect(() => {
        const video = document.getElementById(props.id)
        video.playbackRate = playbackRate
        console.log(`Set ${props.id} to ${playbackRate}`)
    }, [playbackRate])

    const setPlaybackRate = (val) => {
        return () => {
            const video = document.getElementById(props.id)
            video.playbackRate = val
        }
    }
    return <div>
        {renderVideo}
        <div></div>
        <button onClick={setPlaybackRate(0.5)}>Slow Down</button>
        <button onClick={setPlaybackRate(1)}>Regular</button>
        <button onClick={setPlaybackRate(1.5)}>Speed Up</button>
        <button onClick={() => { setDoSync(true) }}>Do OCR</button>

    </div>

}

export { HlsPlayer };