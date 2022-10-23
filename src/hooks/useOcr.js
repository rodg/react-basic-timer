import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useReplicant } from "use-nodecg";
import ReactHlsPlayer from 'react-hls-player'
import { createWorker } from 'tesseract.js';
import { SyncContext } from "../context"

const useOcr = (videoId) => {
    const [time, setTime] = useState("")
    const [wallTime, setWallTime] = useState("")
    const [worker, setWorker] = useState()
    const [initialized, setInit] = useState(false)
    const [count, setCount] = useState(0)
    useEffect(async () => {
        const worker = createWorker({
            // logger: m => console.log(m),
        });
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789.:',
        });
        console.log(`OCR initialized for ${videoId}`)
        setWorker(worker)
        setInit(true)

    }, [])
    // useEffect(() => {
    //     console.log(time)
    // }, [time])

    useEffect(() => {
        const timer = setTimeout(() => initialized && setCount(count + 1), 5e3)
        doOcr()
        console.log(`running at ${Date.now()}`)
        return () => clearTimeout(timer)
    }, [initialized, count])

    const doOcr = async () => {
        const video = document.getElementById(videoId)
        const canvas = document.createElement('canvas')
        canvas.width = 1920
        canvas.height = 1080
        canvas.style.position = 'absolute';
        canvas.style.left = `-1080px`;
        canvas.style.top = `-1920px`;
        var ctx = canvas.getContext('2d');
        setWallTime(Date.now())
        ctx.drawImage(video, 0, 0, 1920, 1080)
        const dataURI = canvas.toDataURL('image/png');
        const { data: { text } } = await worker.recognize(dataURI);
        console.log(text.substring(6, 11).replace(/\s/g, ''))
        setTime(Number(text.substring(6, 11)));
        canvas.remove()
        console.log(`stream: ${videoId}\ntimestamp: ${text}clock time: ${wallTime}`)

    }

    return {
        time: time ? time : null,
        wallTime,
        doOcr,
        initialized
    }


}

export { useOcr }