import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
let clickAmount = 0;
let energyLimit = 100;
let energyRemains = 100;
let increaseAreaBoost = 0;
let speedReducedBoost = 0;
let multiplierBoost = 0;
let useEffectCalled = false;
let areaGotBigger = false;
let speedReduced = false;
let multiplierActive = false;

let slowIconImage: string;
let areaIconImage: string;
let multiplierIconImage: string;

let interval: any = null
let energyTInterval: any = null;
let initialTime = 1;
let increaseTime = 120;
let yellowSectorSize = 8;
let greenSectorSize = 14;
let defaultIncrease = 1;
let yellowIncrease = 2;
let greenIncrease = 3;
let increaseAmount = 0;

// @ts-ignore
const CircularProgress = () => {

    const size = 190;
    const strokeWidth = 10;
    const circleOneStroke = "grey";

    const [progress, setProgress] = useState(0);

    const angle = 2 * Math.PI * (progress / 360) - Math.PI / 2;
    const radius = (size - strokeWidth) / 2;
    const radiusForZone = (size) / 2;

    const ballRadius = strokeWidth-4;
    const ballX = size / 2 + radius * Math.cos(angle);
    const ballY = size / 2 + radius * Math.sin(angle);

    const centerX = size / 2;
    const centerY = size / 2;

    const threshold = 10000000;

    const [number,setClickAmount] = useState(clickAmount);
    const [energy,setEnergyAmount] = useState(energyRemains);
    const [indicatorAngle, setIndicatorAngle] = useState(0);
    const [time, setTime] = useState(initialTime);
    const [speed, setSpeed] = useState(1);
    const [streak, setStreak] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [messageColor, setMessageColor] = useState("white");
    const [energyTime, setEnergyTime] = useState(increaseTime);
    const [isActive, setIsActive] = useState(false);
    const [isEnergyFull, setIsEnergyFull] = useState(false);

    const containerStyle = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
    };
    useEffect(() => {
        // @ts-ignore
        const savedTickets = JSON.parse(localStorage.getItem('myTickets'));
        if (savedTickets !== null){
            clickAmount = savedTickets;
        }
        // @ts-ignore
        const energyLeft = JSON.parse(localStorage.getItem('energyLeft'));
        if (energyLeft !== null){
            energyRemains = energyLeft;
        }
        // @ts-ignore
        const timeLastSaved: Date = JSON.parse(localStorage.getItem("energyTimeLastDropped"));
        if (timeLastSaved !== null){
            const now = new Date();
            const savedTime = new Date(timeLastSaved);
            const timeDifference = Math.floor((now.getTime() - savedTime.getTime())/1000)
            if (Math.floor((timeDifference)/120) + energyRemains > 100){
                energyRemains = 100;
                setEnergyTime(increaseTime)
                setIsEnergyFull(true);
            }
            else{
                energyRemains = Math.floor(timeDifference/120) + energyRemains;
                setEnergyTime(time =>timeDifference%120)
            }
        }
        // @ts-ignore
        const increaseArea: number = JSON.parse(localStorage.getItem('increaseArea'));{
            if (increaseArea > 0){
                increaseAreaBoost = increaseArea;
                areaGotBigger = true;
            }
        }
        // @ts-ignore
        const speedReduce: number = JSON.parse(localStorage.getItem('reduceSpeed'));{
            if (speedReduce > 0){
                speedReduced = true;
                speedReducedBoost = speedReduce;
                setSpeed(speed => speed-(speed/4));
            }
        }
        // @ts-ignore
        const multiplier: number = JSON.parse(localStorage.getItem('multiplierBoost'));{
            if (multiplier > 0){
                multiplierActive = true;
                multiplierBoost = multiplier;
            }
        }
    }, []);

    useEffect(() => {
        if (speedReduced)
            slowIconImage = "boostIcon timeSlowIconA"
        else
            slowIconImage = "boostIcon timeSlowIcon"

        if (areaGotBigger)
            areaIconImage = "boostIcon areaActiveIconA"
        else
            areaIconImage = "boostIcon areaActiveIcon"

        if (multiplierActive)
            multiplierIconImage = "boostIcon multiplierActiveIconA"
        else
            multiplierIconImage = "boostIcon multiplierActiveIcon"

    }, [speedReduced,areaGotBigger,multiplierActive]);

    useEffect(() => {
        if (!useEffectCalled){
            if (increaseAreaBoost > 0){
                greenSectorSize = greenSectorSize+greenSectorSize;
                yellowSectorSize = yellowSectorSize+yellowSectorSize;
                useEffectCalled = true;
            }
        }
    }, []);

    //circle the ball
    useEffect(() => {
        const circleInt = setInterval(() => {
            setProgress(progress => progress+speed)
        },10)
        
        if (progress>360)
            setProgress(0);

        return () =>{
            clearInterval(circleInt);
        }
    }, [progress, speed]);

    //timer after click
    useEffect(() => {

        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((time) => time - 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        else if (isActive && time === 0){
            clearInterval(interval);
            let button = document.getElementById('clickButton');
            if (energy>0){
                // @ts-ignore
                button.removeAttribute("disabled");
            }
            resetTimer();
        }

        return () => {
            clearInterval(interval);
        }
    }, [energy, isActive, time]);

    //energy system
    useEffect(() => {
        if (!isEnergyFull && energyTime > 0){
            energyTInterval = setInterval(() => {
                setEnergyTime((time) => time - 1);
                localStorage.setItem('energyIncreaseRemain', JSON.stringify(energyTime))
                const now: Date = new Date();
                localStorage.setItem('energyTimeLastDropped', JSON.stringify(now.toUTCString()))
            }, 1000);
        }
        else if (!isEnergyFull && energyTime === 0){
            energyRemains++
            setEnergyAmount(energyRemains);
            localStorage.setItem('energyLeft',JSON.stringify(energyRemains))
            if (energyRemains === 100)
                setIsEnergyFull(true);
            setEnergyTime(increaseTime)
            localStorage.setItem('energyIncreaseRemain', JSON.stringify(increaseTime))
        }
        
        if (energy > 0 && !isActive){
            let button = document.getElementById('clickButton');
            // @ts-ignore
            button.removeAttribute("disabled");
        }

        return () => {
            clearInterval(energyTInterval);
        }
    },[isEnergyFull, energyTime, energy, isActive, time]);

    const formatTime = () => {
        if (isActive){
            const minutes = Math.floor(time / 60);
            const seconds = `0${time % 60}`.slice(-2);
            return `${minutes}:${seconds} to next tap`;
        }
        else if (energyRemains === 0){
            return "Not enough energy"
        }
        else{
            return "Tap to earn"
        }
    };

    const energyTimer = () => {
        if (energyRemains < 100){
            const minutes = Math.floor(energyTime / 60);
            const seconds = `0${energyTime % 60}`.slice(-2);
            return `${minutes}:${seconds} to energy increase`;
        }
        else{
            return "Energy full"
        }
    }

    function SetTextColor(increase:number , color:string) {
        const multiplier = multiplierActive ? 2 : 1;
        clickAmount += increase * multiplier;
        increaseAmount = increase * multiplier;

        if (multiplierActive) {
            multiplierBoost--;
            localStorage.setItem('multiplierBoost', JSON.stringify(multiplierBoost));
            if (multiplierBoost === 0) {
                multiplierActive = false;
            }
        }

        setMessageColor(color);
    }

    const resetTimer = () => {
        setTime(initialTime);
        setIsActive(false);
    };
    const handleClick = () => {
        const inGreen = progress >= indicatorAngle+yellowSectorSize && progress <= indicatorAngle + yellowSectorSize+greenSectorSize;
        const inYellow = ((progress <= indicatorAngle + (2*yellowSectorSize)+greenSectorSize && progress >= indicatorAngle + yellowSectorSize+greenSectorSize) || (progress >= indicatorAngle &&progress <= indicatorAngle + yellowSectorSize));

        if (inGreen || inYellow) {
            if (increaseAreaBoost > 0) {
                if (yellowSectorSize > 6)
                    yellowSectorSize -=2;
                if (greenSectorSize > 2)
                    greenSectorSize -=2;
            }
            else{
                if (yellowSectorSize > 3)
                    yellowSectorSize -=1;
                if (greenSectorSize > 1)
                    greenSectorSize -=1;
            }

            if (speed < 4){
                if (speedReduced && speedReducedBoost > 0)
                    setSpeed(speed => speed + 0.45)
                else
                    setSpeed(speed => speed+0.6);
            }

            setStreak(streak => streak + 1);
            if (inGreen)
                SetTextColor(greenIncrease,"green")
            else if (inYellow)
                SetTextColor(yellowIncrease,"gold")

        } else {
            SetTextColor(defaultIncrease,"white")
            if (speedReduced)
                setSpeed(0.75)
            else
                setSpeed(1);

            setStreak(0);
            if (increaseAreaBoost > 0){
                yellowSectorSize =16;
                greenSectorSize =28;
            }
            else {
                yellowSectorSize =8;
                greenSectorSize =14;
            }

        }
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 1000);
        setIndicatorAngle(Math.random() * 360);
        setIsActive(true);
        setIsEnergyFull(false);
        setEnergyAmount(energyRemains);
        setProgress(prevProgress => Math.min(prevProgress + 1));
        setClickAmount(clickAmount);
        if (speedReduced && speedReducedBoost > 0) {
            speedReducedBoost--;
            localStorage.setItem('reduceSpeed', JSON.stringify(speedReducedBoost));
            if (speedReducedBoost === 0){
                setSpeed(speed => speed + speed*0.25);
                speedReduced = false;
            }
        }
        if (increaseAreaBoost > 0){
            increaseAreaBoost--;
            localStorage.setItem('increaseArea',JSON.stringify(increaseAreaBoost));
            if (areaGotBigger && increaseAreaBoost === 0){
                yellowSectorSize = yellowSectorSize /2;
                greenSectorSize = greenSectorSize /2;
                areaGotBigger = false;
            }
        }
        localStorage.setItem('myTickets',JSON.stringify(clickAmount))
        localStorage.setItem('energyLeft',JSON.stringify(energyRemains))

        let button = document.getElementById('clickButton');
        energyRemains--
        // @ts-ignore
        button.setAttribute("disabled","true");
    }
    const calculateSectorPath = (startAngle: number, endAngle: number): string => {
        const start = polarToCartesian(radiusForZone, startAngle);
        const end = polarToCartesian(radiusForZone, endAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", radiusForZone, radiusForZone,
            "L", start.x, start.y,
            "A", radiusForZone, radiusForZone, 0, largeArcFlag, 1, end.x, end.y,
            "L", radiusForZone, radiusForZone
        ].join(" ");
    };
    const polarToCartesian = (radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: radiusForZone + (radiusForZone * Math.cos(angleInRadians)),
            y: radiusForZone + (radiusForZone * Math.sin(angleInRadians))
        };
    };


    return (
        <div className="clickPage">
            <h2
                style={{
                    color:"white",
                    paddingTop: '20px'
                }}>Tap Remains</h2>
            <h2 style={{
                color: "white",
                fontSize: "42px"
            }}
            >{energyRemains + "/" + energyLimit}
                <div style={containerStyle}>
                    <div style={{width: '50%'}}>
                        <ProgressBar energy={energyRemains}></ProgressBar>
                    </div>
                </div>
                <div style={{
                    color: "grey",
                    fontSize: '16px'
                }}>{energyTimer()}</div>
            </h2>

            <div className="tapInfoContainer">
                <div className="square">
                    <h2 style={{
                        fontSize: '15px',
                        color: '#AAAAAA'
                    }}>Reach to Reward</h2>
                    <h2 style={{
                        fontSize: '20px',
                        color: 'white'
                    }}>5.6/{threshold/1000000}M</h2>
                </div>
            </div>
            <div style={{
                cursor: 'pointer',
                width: '100%',
                height: '28vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <svg width={size} height={size}>
                    <g transform={`rotate(0 ${centerX} ${centerY})`}>
                        <circle
                            stroke={circleOneStroke}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            style={{strokeDashoffset: 0}}
                            r={radius}
                            cx={centerX}
                            cy={centerY}

                        />
                        <path d={calculateSectorPath(indicatorAngle, indicatorAngle + yellowSectorSize)} fill="#00FF9E"
                              className="glow-path"/>
                        <path
                            d={calculateSectorPath(indicatorAngle + yellowSectorSize, indicatorAngle + yellowSectorSize + greenSectorSize)}
                            fill=" #1A9FDF" className="glow-path"/>
                        <path
                            d={calculateSectorPath(indicatorAngle + yellowSectorSize + greenSectorSize, indicatorAngle + 2 * yellowSectorSize + greenSectorSize)}
                            fill="#00FF9E" className="glow-path"/>

                        <circle
                            strokeWidth={strokeWidth}
                            r={radius - 5}
                            cx={centerX}
                            cy={centerY}
                        />
                    </g>
                    <circle
                        cx={ballX}
                        cy={ballY}
                        r={ballRadius}
                        fill="#DE66D4"
                    />
                    <text
                        x="50%"
                        y="45%"
                        alignmentBaseline="middle"
                        textAnchor="middle"
                        fill="white"
                        fontSize={size / 10}
                        dy=".3em">
                        {formatTime()}
                    </text>
                </svg>
            </div>
            <button id="clickButton" onClick={handleClick} style={{
                width: '100vw',
                height: '90vh',
                margin: 0,
                border: 'none',
                backgroundColor: 'transparent',
                color: 'transparent', // In case there's text you want to hide
                padding: 0,
                cursor: 'pointer',
                outline: 'none', // Removes the outline on focus
                position: 'absolute',
                top: 0,
                left: 0
            }}>
            </button>
            <div style={{
                paddingTop:"10px",
                display: 'flex',
                justifyContent: "center",
                alignItems:"center"
            }}>
                <div className={slowIconImage} ></div>
                <div className={areaIconImage}></div>
                <div className={multiplierIconImage}></div>
            </div>
            <h2 style={{
                paddingTop:6
            }}>Streak: {streak}</h2>
            <h2 style={{
                color: "white",
                paddingTop:6
            }}>Tickets: <text>{clickAmount}</text> {showMessage && <text style={{color: messageColor}}>+{increaseAmount}</text>}</h2>
        </div>
    );
};

// @ts-ignore
const ProgressBar = ({energy}) => {
    const containerStyles = {
        height: 4,
        width: '100%',
        backgroundColor: "grey",
        borderRadius: 50
    };

    const fillerStyles = {
        height: '100%',
        width: `${energy}%`,
        backgroundColor: '#DE66D4',
        borderRadius: 'inherit',
        transition: 'width 0.5s ease-in-out',
    };

    return (
        <div style={containerStyles}>
            <div style={fillerStyles} />
        </div>
    );
}


export default CircularProgress;