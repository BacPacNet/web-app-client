import "./Section3.css"

import Image from "next/image"
import Slider from "../Slider/Slider"
import number3 from "../../../assets/number3.png"

function Section3() {
    return (
        <div className="section3 bg-[#F3F2FF]">
            <div className="heading-3">
                <Image src={number3} alt="3" />
                <h3>Enjoy the features</h3>
            </div>
            <div className="slider-container">
                <Slider />
            </div>
        </div>
    )
}

export default Section3