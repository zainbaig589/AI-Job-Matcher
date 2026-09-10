import React from "react";
import "./CVScanner.css";

export default function CVScanner() {
  return (
    <section className="cv-scanner">

      {/* Background glow */}
      <div className="scanner-glow"></div>

      {/* Scanner stage */}
      <div className="scanner-stage">

        {/* =========================
            CV DOCUMENT
        ========================= */}
        <div className="cv-document">

          <div className="cv-header">
            <div className="cv-avatar"></div>

            <div>
              <div className="cv-name">Muhammad Zain</div>
              <div className="cv-role">Software Engineer</div>
            </div>
          </div>

          <div className="cv-line large"></div>
          <div className="cv-line"></div>
          <div className="cv-line short"></div>

          <div className="cv-section-title">
            EXPERIENCE
          </div>

          <div className="cv-line"></div>
          <div className="cv-line"></div>
          <div className="cv-line short"></div>

          <div className="cv-section-title">
            SKILLS
          </div>

          <div className="skills">
            <span>Python</span>
            <span>FastAPI</span>
            <span>SQL</span>
          </div>

          {/* Red scanning laser */}
          <div className="scan-line">
            <span></span>
          </div>

        </div>


        {/* =========================
            PROCESSING CARD
        ========================= */}
        <div className="processing-card">

          <div className="processing-icon">
            ✓
          </div>

          <div className="processing-content">

            <strong>CV Processed</strong>

            <span>
              Extracting information...
            </span>

            <div className="progress">
              <div></div>
            </div>

          </div>

          <div className="processing-percent">
            98%
          </div>

        </div>


        {/* =========================
            PROCESSED CV STACK
        ========================= */}
        <div className="processed-stack">

          <div className="stack-title">
            PROCESSED
          </div>

          <div className="stack-cv stack-3">
            <div className="mini-avatar"></div>
            <div className="mini-lines"></div>
          </div>

          <div className="stack-cv stack-2">
            <div className="mini-avatar"></div>
            <div className="mini-lines"></div>
          </div>

          <div className="stack-cv stack-1">
            <div className="mini-avatar"></div>
            <div className="mini-lines"></div>
          </div>

        </div>

      </div>

    </section>
  );
}