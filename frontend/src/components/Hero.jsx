import { useRef, useState } from "react";
import CVScanner from "./CVScanner";
import "./Hero.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Hero() {

  // ==================================================
  // CSV UPLOAD
  // ==================================================

  const csvInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");


  // ==================================================
  // SEARCH
  // ==================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");


  // ==================================================
  // CSV UPLOAD FUNCTION
  // ==================================================

  const handleCSVUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
  `${API_URL}/cvs/upload-csv`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "CSV upload failed"
        );
      }

      setUploadMessage(
        `${data.records_added} CVs uploaded successfully`
      );

    } catch (error) {

      setUploadMessage(error.message);

    } finally {

      setUploading(false);

      event.target.value = "";
    }
  };


  // ==================================================
  // SEARCH FUNCTION
  // ==================================================

  const handleSearch = async () => {

    if (!searchQuery.trim()) {

      setSearchMessage(
        "Please enter something to search."
      );

      setSearchResults([]);

      return;
    }

    setSearching(true);
    setSearchMessage("");
    setSearchResults([]);

    try {

      const response = await fetch(
  `${API_URL}/search?query=${encodeURIComponent(
    searchQuery
  )}&limit=10`
);
      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || "Search failed"
        );
      }

      setSearchResults(data.results);

      if (data.total_results === 0) {

        setSearchMessage(
          "No matching CVs found."
        );
      }

    } catch (error) {

      setSearchMessage(error.message);

    } finally {

      setSearching(false);
    }
  };


  // ==================================================
  // ENTER KEY SEARCH
  // ==================================================

  const handleSearchKeyDown = (event) => {

    if (event.key === "Enter") {
      handleSearch();
    }
  };


  return (
    <>
      {/* ==================================================
          HERO
      ================================================== */}

      <main className="hero" id="home">

        <div className="hero-container">

          {/* ================= LEFT ================= */}

          <div className="hero-content">

            <div className="hero-badge">
              AI-POWERED DOCUMENT SEARCH
            </div>

            <h1 className="hero-title">
              Find the Right
              <span>CVs, Faster</span>
            </h1>

            <p className="hero-description">
              Upload your CV dataset, search with natural
              language, and let our AI find the most relevant
              CVs for you. Powered by full-text search and
              intelligent matching.
            </p>


            {/* ================= SEARCH BOX ================= */}

            <div className="hero-search">

              <input
                type="text"
                placeholder="Search candidates, skills, experience..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />

              <button
                className="primary-button"
                onClick={handleSearch}
                disabled={searching}
              >

                <span>
                  {searching
                    ? "Searching..."
                    : "Start Searching"}
                </span>

                <span className="arrow">
                  →
                </span>

              </button>

            </div>


            {/* ================= CSV UPLOAD ================= */}

            <div className="hero-buttons">

              <button
                className="secondary-button"
                onClick={() =>
                  csvInputRef.current.click()
                }
                disabled={uploading}
              >

                <span className="upload-icon"></span>

                <span>
                  {uploading
                    ? "Uploading..."
                    : "Upload CSV"}
                </span>

              </button>


              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: "none" }}
              />

            </div>


            {/* ================= UPLOAD MESSAGE ================= */}

            {uploadMessage && (

              <div className="upload-message">
                {uploadMessage}
              </div>

            )}

          </div>


          {/* ================= RIGHT ================= */}

          <div className="hero-visual">

            <CVScanner />

          </div>

        </div>

      </main>


      {/* ==================================================
          SEARCH RESULTS
      ================================================== */}

      {(searchResults.length > 0 || searchMessage) && (

        <section className="search-results-section">

          <div className="search-results-container">

            <div className="search-results-heading">

              <span className="section-label">
                SEARCH RESULTS
              </span>

              <h2>
                Matching <span>CVs</span>
              </h2>

              {searchQuery && (

                <p>
                  Results for:
                  <strong> "{searchQuery}"</strong>
                </p>

              )}

            </div>


            {/* ================= RESULTS ================= */}

            {searchResults.length > 0 && (

              <div className="search-results-list">

                {searchResults.map((result) => (

                  <div
                    className="search-result-card"
                    key={result.id}
                  >

                    <div className="result-number">
                      {String(result.id).padStart(2, "0")}
                    </div>


                    <div className="result-content">

                      <h3>
                        {result.filename}
                      </h3>

                      <div
                        className="result-snippet"
                        dangerouslySetInnerHTML={{
                          __html: result.snippet
                        }}
                      />

                    </div>


                    <div className="result-score">

                      <span>
                        Relevance
                      </span>

                      <strong>
                        {result.score.toFixed(3)}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>

            )}


            {/* ================= MESSAGE ================= */}

            {searchMessage && (

              <div className="search-message">
                {searchMessage}
              </div>

            )}

          </div>

        </section>

      )}


      {/* ==================================================
          STATS
      ================================================== */}

      <section className="stats-section">

        <div className="stats-container">

          <div className="stat-item">

            <strong>
              10K+
            </strong>

            <span>
              Documents Ready
            </span>

          </div>


          <div className="stat-divider"></div>


          <div className="stat-item">

            <strong>
              Fast
            </strong>

            <span>
              Full-Text Search
            </span>

          </div>


          <div className="stat-divider"></div>


          <div className="stat-item">

            <strong>
              AI
            </strong>

            <span>
              Smart Matching
            </span>

          </div>


          <div className="stat-divider"></div>


          <div className="stat-item">

            <strong>
              99%
            </strong>

            <span>
              Organized Results
            </span>

          </div>

        </div>

      </section>


      {/* ==================================================
          FEATURES
      ================================================== */}

      <section
        className="features-section"
        id="about"
      >

        <div className="section-heading">

          <span className="section-label">
            POWERFUL SEARCH
          </span>

          <h2>
            Search through your
            <span> entire CV dataset.</span>
          </h2>

          <p>
            Stop manually opening hundreds of resumes.
            DocSearch turns your CV collection into a fast,
            searchable knowledge base.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              ↥
            </div>

            <h3>
              Upload Your Data
            </h3>

            <p>
              Upload your CSV dataset containing candidate
              resumes and let the system prepare your documents.
            </p>

          </div>


          <div className="feature-card featured">

            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              ◈
            </div>

            <h3>
              Intelligent Processing
            </h3>

            <p>
              Extract important information from your CVs and
              organize the content for efficient searching.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              ⌕
            </div>

            <h3>
              Find Candidates
            </h3>

            <p>
              Search using keywords or natural language and
              quickly discover the most relevant candidates.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          HOW IT WORKS
      ================================================== */}

      <section
        className="workflow-section"
        id="search"
      >

        <div className="workflow-container">

          <div className="workflow-heading">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From raw CVs to
              <span> searchable data.</span>
            </h2>

          </div>


          <div className="workflow">

            <div className="workflow-step">

              <div className="step-number">
                01
              </div>

              <h3>
                Upload
              </h3>

              <p>
                Add your CV dataset through CSV upload.
              </p>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="step-number">
                02
              </div>

              <h3>
                Process
              </h3>

              <p>
                Resume content is extracted and prepared.
              </p>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="step-number">
                03
              </div>

              <h3>
                Index
              </h3>

              <p>
                Documents are organized for fast retrieval.
              </p>

            </div>


            <div className="workflow-line"></div>


            <div className="workflow-step">

              <div className="step-number">
                04
              </div>

              <h3>
                Search
              </h3>

              <p>
                Find the candidates that match your query.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CTA
      ================================================== */}

      <section
        className="cta-section"
        id="upload"
      >

        <div className="cta-content">

          <span className="cta-label">
            READY TO SEARCH?
          </span>

          <h2>
            Turn your CV collection
            <br />
            into something searchable.
          </h2>

          <p>
            Upload your dataset and start discovering
            relevant candidates in seconds.
          </p>

          <button
            className="cta-button"
            onClick={() =>
              csvInputRef.current.click()
            }
          >
            Get Started
            <span>→</span>
          </button>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="home-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <strong>
              Doc<span>Search</span>
            </strong>

            <p>
              Intelligent document search for modern teams.
            </p>

          </div>


          <div className="footer-copy">

            © 2026 DocSearch. All rights reserved.

          </div>

        </div>

      </footer>

    </>
  );
}