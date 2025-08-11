import React, { useState } from "react";

function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    const items = [
        {
            q: "What is NJ-EQUIP",
            a: "The NJ-EQUIP web portal is a resource that provides information and data related to energy usage,resources, and initiatives in New Jersey. It aims to empower residents, businesses, and policymakers to make informed decisions about energy consumption and clean energy adoption."
        },
        {
            q: "How do I access the data maps?",
            a: "You can access the data maps by clicking on the Maps link in the navigation bar. This will take you to a dashboard with interactive maps displaying energy data across New Jersey counties, allowing users to compare energy consumption by demographics and regions."
        },
        {
            q: "Who is the target audience for the portal?",
            a: "The target audience includes policymakers, researchers, community advocates, utility companies, students, and the public. Users may seek high-level insights or detailed data analysis for better understanding and decision-making regarding energy equity and sustainability."
        },
        {
            q: "What kind of data does the portal provide?",
            a: "The portal integrates real-time datasets such as electricity consumption by county, income data, clean energy adoption metrics, and external APIs for climate data. Users can explore various metrics and insights that highlight energy burdens and efficiency."
        },
        {
            q: "Are there any tools for calculating energy burden or efficiency?",
            a: "Yes, the portal features energy burden calculators that allow users to input their income, household size, and energy use to understand how these factors affect their energy costs. This helps identify opportunities for efficiency improvements."
        },
        {
            q: "Is the portal available in multiple languages?",
            a: "Currently, the portal primarily supports English, but there are plans to include additional languages, such as Spanish, to increase accessibility for a broader audience in New Jersey."
        },
        {
            q: "How frequently is the data updated?",
            a: "The data is updated regularly to ensure that users have access to the latest information regarding energy consumption, policy changes, and incentives. Users can rely on the portal for current insights."
        },
        {
            q: "What types of visualizations can I expect to find on the portal?",
            a: "The portal features a variety of interactive visualizations, including maps, charts, and dashboards that display trends in energy consumption, clean energy adoption, and socio-economic impacts. These visualizations make it easier for users to interpret complex data."
        },
        {
            q: "Are there resources available for energy-saving tips?",
            a: "Yes, the portal includes dynamic content feeds that provide energy-saving tips, information on clean energy initiatives, and updates on relevant energy policies in New Jersey. This ensures users are informed about ways to improve their energy efficiency."
        },
        {
            q: "Can I contribute to the portal's data or provide feedback?",
            a: "Absolutely! The portal encourages user feedback and contributions. Please reach out through the contact form available on the website to share your insights or suggestions for improvement."
        },
        {
            q: "Where can I find more information on clean energy incentives?",
            a: "The portal provides a dedicated section outlining available clean energy incentives and policies. You can explore these options to learn how they can benefit your household or business."
        }
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