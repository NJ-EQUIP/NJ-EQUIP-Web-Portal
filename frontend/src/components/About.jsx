import React, { useState } from "react";

function About() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const sections = [
    {
      title: "Our Mission",
      content:
        "The New Jersey Energy Portal was established to empower residents, businesses, and policymakers with the information needed to make informed decisions about energy usage, resources, and sustainable practices."
    },
    {
      title: "What We Do",
      content:
        "We serve a diverse audience including policymakers, researchers, community advocates, utility companies, students, and public communities. Our platform offers a variety of features such as interactive data visualizations, energy burden calculators, and dynamic content feeds on energy policy and initiatives."
    },
    {
      title: "Impact of Clean Energy",
      content:
        "Our portal highlights the substantial benefits of clean energy programs in New Jersey. For instance, in 2023, residents utilized over $X million in NJCEP incentives to adopt clean energy programs, leading to an average annual savings of X kWh per household. Furthermore, households participating in the NJ Clean Energy Program can reduce their annual energy costs"
    },
    {
      title: "Our Team",
      content:
        "Our team is committed to enhancing the accessibility of energy-related data. We strive to support informed decision-making by integrating real-time datasets and ensuring our resources are user-friendly for a wide range of users."
    }
  ];

  return (
    <div className="about-container">
      <h2>About the New Jersey Energy Portal</h2>

      {sections.map((sec, i) => (
        <div
          key={i}
          className={`about-item ${openIndex === i ? "open" : ""}`}
          onClick={() => toggle(i)}
        >
          <h3>{sec.title}</h3>
          <p>{sec.content}</p>
        </div>
      ))}
    </div>
  )
}

export default About