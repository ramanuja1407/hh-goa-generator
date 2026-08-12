import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";

import BuilderProfile from "./BuilderProfile";
import {
  saveBuilderProfile,
  getBuilderProfile,
} from "./utils/supabase";

import "./App.css";


/* --------------------------------------------------
   BUILDER ID
-------------------------------------------------- */

function getBuilderId() {
  const existingId = localStorage.getItem(
    "hh_goa_builder_id"
  );

  if (existingId) {
    return existingId;
  }

  const newId =
    "HH26-" +
    Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

  localStorage.setItem(
    "hh_goa_builder_id",
    newId
  );

  return newId;
}


/* --------------------------------------------------
   BUILDER TITLE
-------------------------------------------------- */

function getBuilderTitle(stack) {
  const value = (stack || "").toLowerCase();

  if (
    value.includes("ai") ||
    value.includes("machine learning")
  ) {
    return "AI ALCHEMIST";
  }

  if (
    value.includes("aerospace") ||
    value.includes("rocket") ||
    value.includes("space")
  ) {
    return "SKY HACKER";
  }

  if (value.includes("python")) {
    return "PYTHON PILOT";
  }

  if (
    value.includes("react") ||
    value.includes("frontend") ||
    value.includes("web")
  ) {
    return "INTERFACE ARCHITECT";
  }

  if (
    value.includes("backend") ||
    value.includes("node") ||
    value.includes("api")
  ) {
    return "BACKEND ARCHITECT";
  }

  if (
    value.includes("hardware") ||
    value.includes("arduino") ||
    value.includes("esp32")
  ) {
    return "CIRCUIT TINKERER";
  }

  if (
    value.includes("cyber") ||
    value.includes("security")
  ) {
    return "DIGITAL SENTINEL";
  }

  return "THE GOA BUILDER";
}


/* --------------------------------------------------
   APP
-------------------------------------------------- */

function App() {
  const builderId = getBuilderId();

  const [name, setName] = useState(
    localStorage.getItem("hh_goa_name") || ""
  );

  const [stack, setStack] = useState(
    localStorage.getItem("hh_goa_stack") || ""
  );

  const [photo, setPhoto] = useState(null);

  const [saving, setSaving] = useState(false);

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const pathname = window.location.pathname;

  const isBuilderProfile =
    pathname.startsWith("/builder/");


  /* --------------------------------------------------
     SAVE NAME + STACK LOCALLY
  -------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem(
      "hh_goa_name",
      name
    );
  }, [name]);

  useEffect(() => {
    localStorage.setItem(
      "hh_goa_stack",
      stack
    );
  }, [stack]);


  /* --------------------------------------------------
     BUILDER PROFILE PAGE
     
     When someone opens:
     /builder/HH26-XXXX

     we fetch the profile from Supabase.
  -------------------------------------------------- */

  if (isBuilderProfile) {
    const urlBuilderId =
      decodeURIComponent(
        pathname.split("/builder/")[1] || ""
      );

    return (
      <BuilderProfileLoader
        builderId={urlBuilderId}
      />
    );
  }


  /* --------------------------------------------------
     PHOTO UPLOAD
  -------------------------------------------------- */

  const handlePhotoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    /*
     * Convert photo to Base64.
     *
     * This lets us store the image together
     * with the builder profile in Supabase.
     */

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };


  /* --------------------------------------------------
     STACK TAGS
  -------------------------------------------------- */

  const getStackTags = () => {
    if (!stack.trim()) {
      return ["YOUR STACK"];
    }

    return stack
      .split(/[•,+|/]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4);
  };


  /* --------------------------------------------------
     BUILDER TITLE
  -------------------------------------------------- */

  const builderTitle =
    getBuilderTitle(stack);


  /* --------------------------------------------------
     PUBLIC PROFILE URL
  -------------------------------------------------- */

  const profileUrl =
    `${window.location.origin}/builder/${builderId}`;


  /* --------------------------------------------------
     DOWNLOAD PNG
  -------------------------------------------------- */

  const downloadCard = async () => {
    const card =
      document.querySelector(".id-card");

    if (!card) return;

    try {
      const dataUrl = await toPng(card, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#080808",
      });

      const link =
        document.createElement("a");

      link.download =
        `${name || "HH-Goa-Builder"}-2026.png`;

      link.href = dataUrl;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

    } catch (error) {
      console.error(
        "PNG generation failed:",
        error
      );

      alert(
        "Something went wrong while generating the PNG."
      );
    }
  };


  /* --------------------------------------------------
     SHARE ON X
  -------------------------------------------------- */

  const shareOnX = () => {
    const builderName =
      name || "a Hacker House Goa builder";

    const text = `I just created my HH Goa 2026 Builder ID 🚀

${builderName}
${builderTitle}
${builderId}

#HHGoa #HackerHouse #FrameInGoa`;

    const url =
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };


  /* --------------------------------------------------
     SAVE TO SUPABASE + OPEN PROFILE
  -------------------------------------------------- */

  const openProfile = async () => {
    if (!name.trim()) {
      alert("Please enter your name first.");
      return;
    }

    if (!stack.trim()) {
      alert("Please enter your stack / role first.");
      return;
    }

    setSaving(true);

    try {
      await saveBuilderProfile({
        builderId,
        name: name.trim(),
        stack: stack.trim(),
        photoUrl: photo || null,
      });

      /*
       * Profile has now been saved publicly.
       * Open the profile URL.
       */

      window.location.href =
        `/builder/${builderId}`;

    } catch (error) {
      console.error(
        "Could not save builder profile:",
        error
      );

      alert(
        "Could not save your builder profile. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };


  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <div className="brand-mark">
            HH
          </div>

          <div>

            <p className="eyebrow">
              HACKER HOUSE
            </p>

            <h1>
              GOA 2026
            </h1>

          </div>

        </div>

        <div className="header-right">

          <span className="live-dot"></span>

          <span>
            BUILDER NETWORK
          </span>

        </div>

      </header>


      {/* MAIN */}

      <main className="container">

        <section className="hero">

          <div className="hero-label">

            <span>
              01
            </span>

            CREATE YOUR IDENTITY

          </div>

          <h2>

            BUILD.
            <br />

            <span>
              BREAK.
            </span>

            <br />

            BELONG.

          </h2>

          <p className="description">

            Your Hacker House Goa identity
            starts here. Upload a photo,
            add your stack, and generate
            your unique builder card.

          </p>

        </section>


        {/* WORKSPACE */}

        <section className="workspace">


          {/* CONTROLS */}

          <div className="controls">

            <div className="section-heading">

              <span>
                01
              </span>

              <div>

                <strong>
                  YOUR DETAILS
                </strong>

                <small>
                  Make it yours.
                </small>

              </div>

            </div>


            {/* PHOTO UPLOAD */}

            <label className="upload-box">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
              />

              <div className="upload-symbol">
                +
              </div>

              <strong>

                {photo
                  ? "CHANGE PHOTO"
                  : "UPLOAD PHOTO"}

              </strong>

              <small>
                JPG, PNG or WebP
              </small>

            </label>


            {/* FORM */}

            <div className="form">

              <label>

                <span>
                  NAME
                </span>

                <input
                  type="text"
                  placeholder="Your builder name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </label>


              <label>

                <span>
                  STACK / ROLE
                </span>

                <input
                  type="text"
                  placeholder="AI • Python • Aerospace"
                  value={stack}
                  onChange={(e) =>
                    setStack(e.target.value)
                  }
                />

              </label>

            </div>


            <div className="tip">

              <span>
                ✦
              </span>

              Your builder title is generated
              from your stack.

            </div>

          </div>


          {/* PREVIEW */}

          <div className="preview-section">

            <div className="preview-header">

              <div>

                <span>
                  02
                </span>

                <strong>
                  LIVE PREVIEW
                </strong>

              </div>

              <small>
                ID / {builderId}
              </small>

            </div>


            {/* CARD */}

            <div className="card-area">

              <div className="id-card">

                <div className="card-grid"></div>

                <div className="card-glow"></div>


                {/* TOP */}

                <div className="card-top">

                  <div>

                    <strong>
                      HH
                    </strong>

                    <span>
                      GOA / 26
                    </span>

                  </div>

                  <div className="verified">

                    <span></span>

                    VERIFIED BUILDER

                  </div>

                </div>


                {/* PHOTO */}

                <div className="photo-frame">

                  {photo ? (

                    <img
                      src={photo}
                      alt="Uploaded builder"
                    />

                  ) : (

                    <div className="photo-placeholder">

                      <span>
                        YOUR
                      </span>

                      <strong>
                        PHOTO
                      </strong>

                    </div>

                  )}

                  <div className="photo-corner top-left"></div>

                  <div className="photo-corner bottom-right"></div>

                </div>


                {/* INFO */}

                <div className="card-info">

                  <div className="builder-label">
                    BUILDER
                  </div>

                  <h3>
                    {name || "YOUR NAME"}
                  </h3>


                  <div className="stack-tags">

                    {getStackTags().map(
                      (tag, index) => (

                        <span key={index}>
                          {tag}
                        </span>

                      )
                    )}

                  </div>


                  <div className="builder-title">

                    <span>
                      YOUR BUILDER TITLE
                    </span>

                    <strong>
                      {builderTitle}
                    </strong>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="card-footer">

                  <div>

                    <span>
                      BUILDER ID
                    </span>

                    <strong>
                      {builderId}
                    </strong>

                  </div>


                  <div>

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      GOA, INDIA
                    </strong>

                  </div>


                  {/* QR */}

                  <div className="qr-code">

                    <QRCodeSVG
                      value={profileUrl}
                      size={46}
                      bgColor="#ffffff"
                      fgColor="#080808"
                      level="M"
                    />

                  </div>


                  <div className="footer-mark">
                    HH
                  </div>

                </div>

              </div>

            </div>


            {/* ACTION BUTTONS */}

            <div className="action-buttons">

              <button
                className="download-button"
                onClick={downloadCard}
              >

                <span>
                  ↓
                </span>

                DOWNLOAD PNG

              </button>


              <button
                className="share-button"
                onClick={shareOnX}
              >

                𝕏 SHARE ON X

              </button>

            </div>


            {/* SAVE + PROFILE */}

            <button
              className="profile-preview-button"
              onClick={openProfile}
              disabled={saving}
            >

              {saving
                ? "SAVING BUILDER PROFILE..."
                : "SAVE & VIEW MY BUILDER PROFILE →"}

            </button>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <span>
          HACKER HOUSE / GOA 2026
        </span>

        <span>
          #FrameInGoa
        </span>

      </footer>

    </div>
  );
}


/* --------------------------------------------------
   BUILDER PROFILE LOADER
-------------------------------------------------- */

function BuilderProfileLoader({
  builderId,
}) {

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    let active = true;

    async function loadProfile() {

      try {

        setLoading(true);
        setError("");

        const data =
          await getBuilderProfile(
            builderId
          );

        if (!active) return;

        if (!data) {

          setError(
            "This builder profile does not exist yet."
          );

          return;
        }

        setProfile(data);

      } catch (err) {

        console.error(
          "Profile loading failed:",
          err
        );

        if (active) {

          setError(
            "Unable to load this builder profile."
          );

        }

      } finally {

        if (active) {
          setLoading(false);
        }

      }

    }

    loadProfile();

    return () => {
      active = false;
    };

  }, [builderId]);


  /* LOADING */

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080808",
          color: "#ff6a00",
          fontFamily:
            "Inter, system-ui, sans-serif",
          fontWeight: 800,
          letterSpacing: "0.12em",
          fontSize: "12px",
        }}
      >
        LOADING BUILDER PROFILE...
      </div>
    );

  }


  /* ERROR */

  if (error) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "30px",
          background: "#080808",
          color: "#ffffff",
          fontFamily:
            "Inter, system-ui, sans-serif",
          textAlign: "center",
        }}
      >

        <div>

          <div
            style={{
              color: "#ff6a00",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.15em",
              marginBottom: "15px",
            }}
          >
            HH GOA / BUILDER PROFILE
          </div>

          <h2>
            {error}
          </h2>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              border: "1px solid #ff6a00",
              background: "transparent",
              color: "#ff6a00",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            ← BACK TO GENERATOR
          </button>

        </div>

      </div>
    );

  }


  /* PROFILE */

  return (
    <BuilderProfile
      builderId={profile.builder_id}
      name={profile.name}
      stack={profile.stack}
      photo={profile.photo_url}
    />
  );
}


export default App;