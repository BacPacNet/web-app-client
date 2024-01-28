import Image from 'next/image'
import bacpacTitle from '../../../assets/bacpacTitle.png'
import './style.css'

function UnderConstructionPage() {
    return (
        <div className="under-construction-page">
            <div class="uc__wrapper">
                <div class="uc__details">
                    <h1 class="title">Coming Soon!</h1>
                    <h3 class="intro">
                        We are working hard to give you a better experience.
                    </h3>
                    <p class="uc__description">
                        We are working hard on it & the site may go live very soon. We promise, it will be worth the wait!
                    </p>
                </div>
                <div class="uc__art">
                    <div className='art_img' >
                        <Image src={bacpacTitle} alt="BACPAC" className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnderConstructionPage
