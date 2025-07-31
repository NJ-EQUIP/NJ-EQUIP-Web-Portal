import React, {useEffect} from 'react'

function Home() {
    return (
        <div className="wrapper">
        <div className="box-container">
            <div className="box left-box">
                <div>
                    <h2>Empowering New Jersey with Clean Energy Insights</h2>
                    <p>Discover the latest in clean energy solutions and initiatives across New Jersey. From solar power
                        to
                        wind energy, we provide actionable insights, resources, and updates to help individuals and
                        businesses contribute to a greener future. Explore how New Jersey is leading the charge in
                        sustainable energy.</p>
                </div>
            </div>
            <div className="box right-box">
                <img src="https://ik.imagekit.io/clouglobal/img/wp-content/uploads/2023/08/Net-zero-buildings-are-revolutionary-structures-designed-to-achieve-a-state-of-carbon-neutrality-where-the-energy-consumed-is-offset-by-renewable-energy-generation-symbol-image-credit-CLOU-1.jpg" alt="New Jersey County Map" />
            </div>
        </div>
    </div>
    )
}

export default Home