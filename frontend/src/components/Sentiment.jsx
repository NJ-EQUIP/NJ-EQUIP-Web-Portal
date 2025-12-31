import React, { useState } from "react";

function Sentiment() {
  return (
    <div>
      <div className="Section1">
        <h1>Public Sentiment</h1>
        <p>
          We analyzed almost <b>35,000 Reddit comments</b> about energy in New Jersey to understand how residents feel and talk about key issues.
        </p>
        <img src="wordcloud.jpg" />
      </div>

      <div className="Section2">
        <h2>Overall Sentiment</h2>
        <p>A majority of comments show a positive tone, especially when discussing renewable energy and community experiences.</p>
        <p>
          A large share is negative, usually tied to policy frustration, rising costs, or access challenges.</p>
        <p>
          A small but important share is neutral, often sharing factual information or personal experiences without strong judgment.
        </p>

        <img src="vader.png" />
        <p>This shows that while frustrations exist, people often approach energy topics with curiosity and optimism.</p>
        <a href="https://www.reddit.com/r/newjersey/comments/1ml2bdq/as_nj_residents_what_options_do_we_have_for/?utm_source=chatgpt.com">Source: Discussion about energy efficiency tips</a>

        <p>Example of a Positive Post - “I work in climate and home energy efficiency… look at what’s driving most of your consumption… optimizing AC use… these simple changes can make a big difference.”</p>
        <p>
          Example of a Negative Post- “It’s not a cut, it’s a deferral… You’ll pay $30/month less in summer, but $10 more during fall/winter. This 'cut' feels like a shell game—no real help for rising electricity costs.”</p>
        <p>
          Example of a Neutral Post- “I used about 13.5% less electricity than last year, but my bill still went from $358 to $418—that’s a $60 jump for less usage.”
        </p>
      </div>

      <div className="Section3">
        <h2>Subjectivity</h2>
        <p>Conversations tend to be either very factual (objective) or very opinionated (subjective). Neutral comments were mostly factual, while negative comments carried stronger emotions.
        </p>
        <img src="subjectivity.png" />
        <p>Comments are usually either highly factual (sharing news or data) or highly opinionated (expressing strong feelings). Few fall in the middle.</p>
      </div>

      <div className="Section4">
        <h2>Topics of Discussion</h2>
        <p>We applied GPT-4.0–to divide the reddit posts into different themes/topics and conducted further sentiment analysis on those themes/topics. The key themes in the reddit discussions were -</p>
        <li>Energy Cost & Burden – the most dominant concern, reflecting affordability struggles.</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/13xreh6/for_those_of_you_who_have_switched_to_solar_in_nj/?utm_">"I used about 13.5% less electricity than last year, but my bill still went from $358 to $418—that’s a $60 jump for less usage."</a>
        </p>
        <li>Housing & Utility Access – challenges of connecting homes, renters, and underserved communities.</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/1ljb9iz/2_bedroom_apartment_btw/">“I also live in a 2‑bedroom duplex. My electric bill is insane. Solo parent and I’m drowning.”</a>
        </p>
        <li>Financial Aid & Programs – mixed reactions to state or utility support.</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/1l4blnm/nj_households_to_get_100_or_more_to_help_cover/">“I got a check yesterday from the home energy assistance program… still waiting for the assistance. Had my services already cut once.”</a>
        </p>
        <li>Government & Energy Policy – often critical, with frustration about bureaucracy and progress.</li>
        <p>
          <a href="https://www.reddit.com/r/SouthJersey/comments/1l47ezn/gov_murphy_just_announced_immediate_ratepayer/">Government & Energy Policy – often critical, with frustration about bureaucracy and progress.</a>
        </p>
        <li>Solar & Renewable Energy – hopeful and curious conversations about clean energy options.</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/13xreh6/for_those_of_you_who_have_switched_to_solar_in_nj/?">“Very happy with my solar… My home and car energy is free, or at least will be in 5–7 years.”</a>
        </p>
        <li>Environmental Concern – expressions of worry about climate, pollution, and ecological justice.</li>
        <img src="reddit1.png" />
        <img src="sent-distri.png" />
      </div>

      <div className="Section5">
        <h2>Emotions around the Topics/Themes</h2>
        <img src="emotions.jpg" />
        <p>Most posts were emotionally neutral, but when emotions appeared, they revealed clear patterns:</p>

        <li><b>Surprise</b> around solar and renewables (optimism, curiosity)</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/1ml2bdq/as_nj_residents_what_options_do_we_have_for/?">“Very happy with my solar… My home and car energy is free—or will be in 5–7 years.”
          </a>
        </p>
        <li><b>Sadness</b> about housing and financial aid (hardship, inequity)</li>
        <p><a href="https://www.reddit.com/r/newjersey/comments/1lqvu3w/first_electric_bill_from_the_june_spike/">“I live in a 600 sq ft studio… bill higher than previous month though I wasn’t home half the time… Is this seriously going to be the new normal? How are we gonna afford this increase?”</a>
        </p>
        <li><b>Anger and disgust</b> in policy and environmental discussions (frustration with government and climate issues)</li>
        <p>
          <a href="https://www.reddit.com/r/newjersey/comments/1m3ulsx/got_my_pseg_bill_and_this_is_pure_bs/">“The electricity rate was about 20–21 ¢/kWh… now it’s 30–31 ¢/kWh. Politicians calling it a 20–30% increase... that’s really 50%.”</a>
        </p>
        <li>Joy → smaller but present, usually in renewable energy success stories.</li>
        <p>
          <a href="https://www.reddit.com/r/solar/comments/1ioneit/did_solar_actually_lower_your_electric_bills/">“For me, solar eliminated my electric bill and drastically reduced my transportation costs (because I drive an EV).”</a>
        </p>
        <img src="emotion1.jpg" />
        <img src="emotion2.jpg" />
        <img src="emotion3.jpg" />
        <img src="emotion4.jpg" />
        <img src="emotion5.jpg" />
        <img src="emotion6.jpg" />
        <img src="emotion7.jpg" />
      </div>

      <div className="Section6">
        <h2>Why it Matters</h2>
        <p>This analysis highlights where New Jersey residents feel <b>hopeful</b>, where they feel <b>frustrated</b>, and where they express <b>concern</b>. Understanding these patterns can help inform equitable energy planning and policymaking.</p>
        <p>
          Tracking sentiment and emotions shows where people feel hopeful, where they feel left behind, and where trust needs to be rebuilt. These insights can guide equitable energy planning in New Jersey.
        </p>
      </div>
    </div>
  )
}

export default Sentiment