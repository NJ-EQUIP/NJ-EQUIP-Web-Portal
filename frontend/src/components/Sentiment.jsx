//Move style to index.css
import React, { useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";

const CATALOG = {
  "emotion-policy": {
    title: "Emotions about Energy Policy",
    dir: "/Public-Sentiment/Emotions-Energy-Policy",
    images: [
      "emotions_non_neutral_all.jpg",
      "emotions_total.jpg",
      "grouped_emotion_distribution.jpg",
    ],
    subcollections: [
      {
        key: "emotions-over-time",
        title: "Emotions Over Time",
        dir: "/Public-Sentiment/Emotions-Energy-Policy/Emotions-Over-Time",
        images: [
          "emotions_2010_non_neutral.jpg",
          "emotions_2015_non_neutral.jpg",
          "emotions_2020_non_neutral.jpg",
        ],
      },
    ],
  },

  "sentiment-policy": {
    title: "Sentiments about Energy Policy",
    dir: "/Public-Sentiment/Sentiments-Energy-Policy",
    images: [
      "sentimentovertime.png",
      "sentimentovertime2.png",
      "vader_sentiment_distribution.png",
    ],
    subcollections: [],
  },

  "themes-emotions": {
    title: "Themes and Emotions",
    dir: "/Public-Sentiment/Themes-Emotions",
    images: [
      "emotion_dist_Energy_Cost_and_Burden.jpg",
      "emotion_dist_Environmental_Concern.jpg",
      "emotion_dist_Financial_Aid_and_Programs.jpg",
      "emotion_dist_Government_and_Energy_Policy.jpg",
      "emotion_dist_Housing_and_Utility_Access.jpg",
      "emotion_dist_Other.jpg",
      "emotion_dist_Solar_and_Renewable_Energy.jpg",
    ],
    subcollections: [],
  },
};

function Card({ to, title, subtitle }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        textDecoration: "none",
        color: "inherit",
        background: "white",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, opacity: 0.7 }}>{subtitle}</div>}
    </Link>
  );
}

function ImageTile({ src, name }) {
  const [missing, setMissing] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "white",
      }}
    >
      {!missing ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
          onError={() => setMissing(true)}
        />
      ) : (
        <div
          style={{
            padding: 12,
            background: "#f9fafb",
            border: "1px dashed #e5e7eb",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          Missing image:
          <br />
          <code style={{ fontSize: 12 }}>{src}</code>
        </div>
      )}
      {/* 
      <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>{name}</div>
      */}
    </div>
  );
}

function ImageGrid({ baseDir, images }) {
  if (!images?.length) {
    return <div style={{ opacity: 0.7 }}>No images listed yet.</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {images.map((name) => {
        const src = `${baseDir}/${name}`;
        return <ImageTile key={name} src={src} name={name} />;
      })}
    </div>
  );
}

export default function Sentiment() {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!collection) {
    return (
      <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Public Sentiment</h1>
        <p style={{ marginBottom: 24, opacity: 0.8 }}>
          Choose a collection to view charts and images.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          <Card
            to="/sentiment/emotion-policy"
            title="Emotions about Energy Policy"
            subtitle="Charts from Public-Sentiment/Emotions-Energy-Policy"
          />
          <Card
            to="/sentiment/sentiment-policy"
            title="Sentiments about Energy Policy"
            subtitle="Charts from Public-Sentiment/Sentiments-Energy-Policy"
          />
          <Card
            to="/sentiment/themes-emotions"
            title="Themes and Emotions"
            subtitle="Charts from Public-Sentiment/Themes-Emotions"
          />
        </div>
      </div>
    );
  }

  const subKey = searchParams.get("sub") || "";
  const entry = CATALOG[collection];

  if (!entry) {
    return (
      <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
          ← Back
        </button>
        <div>
          Unknown collection: <code>{collection}</code>
        </div>
      </div>
    );
  }

  const sub = entry.subcollections?.find((s) => s.key === subKey);

  return (
    <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 16px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Back
      </button>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>
        {sub ? `${entry.title} · ${sub.title}` : entry.title}
      </h1>

      {/* 
      <div style={{ marginBottom: 20, opacity: 0.7 }}>
        Source folder:&nbsp;
        <code>{sub ? sub.dir : entry.dir}</code>
      </div>
      */}

      {!sub && entry.subcollections?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Explore more</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {entry.subcollections.map((s) => (
              <Card
                key={s.key}
                to={`/sentiment/${collection}?sub=${s.key}`}
                title={s.title}
                subtitle={`From ${s.dir}`}
              />
            ))}
          </div>
        </div>
      )}

      <ImageGrid
        baseDir={sub ? sub.dir : entry.dir}
        images={(sub ? sub.images : entry.images) || []}
      />
    </div>
  );
}
