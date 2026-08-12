import "./BuilderProfile.css";

function BuilderProfile({ builderId, name, stack, photo }) {
  const getBuilderTitle = (stack) => {
    const value = (stack || "").toLowerCase();

    if (value.includes("ai") || value.includes("machine learning")) {
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

    if (value.includes("cyber") || value.includes("security")) {
      return "DIGITAL SENTINEL";
    }

    return "THE GOA BUILDER";
  };

  const builderTitle = getBuilderTitle(stack);

  const stackTags = stack
    ? stack
        .split(/[•,+|/]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5)
    : ["BUILDER"];

  const goBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="profile-page">

      <div className="profile-grid"></div>

      {/* BACK BUTTON */}

      <button
        className="profile-back-button"
        onClick={goBack}
      >
        ← BACK TO GENERATOR
      </button>

      {/* HEADER */}

      <header className="profile-header">

        <div className="profile-logo">
          HH
        </div>

        <div>
          <p>HACKER HOUSE</p>
          <h1>GOA / 2026</h1>
        </div>

        <div className="profile-status">
          <span></span>
          VERIFIED BUILDER
        </div>

      </header>

      {/* MAIN */}

      <main className="profile-container">

        <div className="profile-label">
          BUILDER PROFILE
        </div>

        <section className="profile-card">

          {/* PHOTO */}

          <div className="profile-photo">

            {photo ? (
              <img
                src={photo}
                alt={name || "Builder"}
              />
            ) : (
              <div className="profile-photo-placeholder">
                HH
              </div>
            )}

          </div>

          {/* INFORMATION */}

          <div className="profile-content">

            <div className="profile-small-label">
              BUILDER
            </div>

            <h2>
              {name || "HH GOA BUILDER"}
            </h2>

            <div className="profile-title">
              {builderTitle}
            </div>

            {/* STACK */}

            <div className="profile-section">

              <span>
                STACK / ROLE
              </span>

              <div className="profile-tags">

                {stackTags.map((tag, index) => (
                  <span key={index}>
                    {tag}
                  </span>
                ))}

              </div>

            </div>

            {/* DETAILS */}

            <div className="profile-details">

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

              <div>
                <span>
                  EVENT
                </span>

                <strong>
                  HH GOA 2026
                </strong>
              </div>

            </div>

          </div>

        </section>

        <div className="profile-footer">

          <span>
            HACKER HOUSE / GOA 2026
          </span>

          <span>
            #FrameInGoa
          </span>

        </div>

      </main>

    </div>
  );
}

export default BuilderProfile;