import React, { useState } from "react";

function About() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const sections = [
    {
      title: "Sarahana Shrestha: Earth and Environmental Studies, Montclair State University",
      content:
        "University Graduate researcher and co-developer leading the analysis and development of the NJ EQUIP Portal. shresthas1@montclair.edu (0000-0002-9829-9607)"
    },
    {
      title: "Andrew Taggart: Data Science Masters Student, Montclair State University",
      content:
        "Lead Web developer ensuring the portal is technically robust, accessible, and responsive to user needs, responsible for technical architecture, coding, and deployment. (taggarta2@montclair.edu)"
    },
    {
      title: "Dr Aparna S. Varde: Faculty of Engineering, University of Southern Denmark",
      content:
        "Faculty advisor providing guidance on research design, data sources, and the broader vision for advancing energy equity in New Jersey. apva@mmmi.sdu.dk (0000-0002-3170-2510)"
    },
    {
      title: "Our Team",
      content:
        "Our team is committed to enhancing the accessibility of energy-related data. We strive to support informed decision-making by integrating real-time datasets and ensuring our resources are user-friendly for a wide range of users. "
    }
  ];

  return (
    <div className="about-container">
      <h2>Who Are We?</h2>
      <p>This project is a collaborative effort between:</p>

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