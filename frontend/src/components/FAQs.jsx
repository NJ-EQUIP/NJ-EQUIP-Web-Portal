//decommisioned {delete upon confirmation of null use}
import React, { useState } from "react";

function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    const items = [
        {
            q: "What is energy burden?",
            a: "Energy burden refers to the percentage of a household's income spent on home energy bills—such as electricity, heating, and cooling. A household is generally considered overburdened if it spends more than 6% of its income on energy costs."
        },
        {
            q: "What is energy equity and why does it matter?",
            a: "Energy equity means ensuring all people—regardless of income, race, or housing status—have access to affordable, reliable, and clean energy. Energy equity matters because high energy burdens can deepen inequality, strain family budgets, and limit access to basic needs like heating or air conditioning."
        },
        {
            q: "Who is most affected by high energy burdens in New Jersey?",
            a: "In New Jersey, low-income households, renters, people of color, and those living in older or poorly insulated housing are disproportionately affected. Overburdened communities are more likely to rely on expensive or inefficient fuel types like oil or propane and often have limited access to clean energy incentives."
        },
        {
            q: "How do I calculate my energy burden using this tool?",
            a: "Navigate to the “Calculate Energy Burden” section. Enter your: 1. Annual household income, Heating fuel type, Zip code or county. The tool will calculate your energy burden and show how it compares to state and local averages."
        },
        {
            q: "What geographic areas does this tool cover?",
            a: "NJ EQUIP provides data at the municipality, county, and ZIP code levels across the entire state of New Jersey. You can explore and compare energy burden trends by geography and time."
        },
        {
            q: "Where does the data come from?",
            a: "Data comes from: U.S. Census Bureau (ACS & Decennial Census); NJ Clean Energy Program (NJCEP); New Jersey Board of Public Utilities (NJBPU); Publicly available Reddit posts for sentiment analysis; NJ Geographic Information Network (NJGIN) for mapping boundaries"
        },
        {
            q: " What is an overburdened community?",
            a: "An overburdened community is defined by the NJ Department of Environmental Protection (NJDEP) as a community that meets criteria based on income, race/ethnicity, and English proficiency. These communities often face greater environmental and health risks and are prioritized under New Jersey’s environmental justice policies."
        },
        {
            q: "How does NJ EQUIP measure public opinion on energy policy?",
            a: "We use sentiment analysis on text data from Reddit, applying models like VADER and ClimateBERT to identify whether public comments reflect positive, neutral, or negative sentiment over time. This helps visualize how people feel about energy policies such as rebates or clean energy programs."
        },
        {
            q: "Can I download or export the data?",
            a: "Currently, NJ EQUIP offers data visualizations for public use. Export and download features may be added in future versions to support research and community advocacy."
        },
        {
            q: "Who should use NJ EQUIP?",
            a: "The portal is designed for: Residents who want to understand their energy costs; Community organizations advocating for energy justice; Researchers analyzing demographic or spatial patterns; Policymakers and planners working on equitable clean energy programs"
        },
    ]
    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>

            {items.map((item, i) => (
                <div
                    key={i}
                    className={`faq-item ${openIndex === i ? "open" : ""}`}
                    onClick={() => toggle(i)}
                >
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                </div>
            ))}
        </div>
    );
}

export default FAQs