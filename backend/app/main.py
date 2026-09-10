from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import csv
import fitz
from docx import Document
from io import BytesIO

from .database import create_database
from .search import (
    add_cv,
    search_cvs,
    get_all_cvs,
    delete_cv
)


app = FastAPI(title="CV Matching API")


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DATABASE STARTUP
# --------------------------------------------------

@app.on_event("startup")
def startup():
    create_database()


# --------------------------------------------------
# HOME / HEALTH CHECK
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "CV Matching API is running!"
    }


# --------------------------------------------------
# ADD CV USING TEXT
# --------------------------------------------------

@app.post("/cvs")
def create_cv(filename: str, content: str):

    try:
        document_id = add_cv(filename, content)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    return {
        "message": "CV added successfully",
        "id": document_id,
        "filename": filename
    }


# --------------------------------------------------
# UPLOAD PDF / DOCX CV
# --------------------------------------------------

@app.post("/cvs/upload")
async def upload_cv(file: UploadFile = File(...)):

    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    # Read file
    file_bytes = await file.read()

    # Check empty file
    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    # ----------------------------------------------
    # PDF
    # ----------------------------------------------

    if file.filename.lower().endswith(".pdf"):

        try:
            document = fitz.open(
                stream=file_bytes,
                filetype="pdf"
            )

            text = ""

            for page in document:
                text += page.get_text()

            document.close()

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could not read the PDF file"
            )

    # ----------------------------------------------
    # DOCX
    # ----------------------------------------------

    elif file.filename.lower().endswith(".docx"):

        try:
            document = Document(
                BytesIO(file_bytes)
            )

            text = ""

            for paragraph in document.paragraphs:
                text += paragraph.text + "\n"

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could not read the DOCX file"
            )

    # ----------------------------------------------
    # Unsupported format
    # ----------------------------------------------

    else:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported"
        )

    # ----------------------------------------------
    # Validate extracted text
    # ----------------------------------------------

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded CV contains no readable text"
        )

    # ----------------------------------------------
    # Add to database
    # ----------------------------------------------

    try:
        document_id = add_cv(
            file.filename,
            text
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    # ----------------------------------------------
    # Response
    # ----------------------------------------------

    return {
        "message": "CV uploaded successfully",
        "id": document_id,
        "filename": file.filename,
        "characters": len(text)
    }


# --------------------------------------------------
# UPLOAD MULTIPLE CVS USING CSV
# --------------------------------------------------

@app.post("/cvs/upload-csv")
async def upload_csv(file: UploadFile = File(...)):

    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    # Check extension
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported"
        )

    # Read file
    file_bytes = await file.read()

    # Check empty file
    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="CSV file is empty"
        )

    # Decode CSV
    try:
        csv_text = file_bytes.decode("utf-8")

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="CSV file must use UTF-8 encoding"
        )

    # Create CSV reader
    reader = csv.DictReader(
        csv_text.splitlines()
    )

    # Check header
    if not reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="CSV file has no header"
        )

    # Required columns
    required_columns = {
        "filename",
        "content"
    }

    if not required_columns.issubset(
        set(reader.fieldnames)
    ):
        raise HTTPException(
            status_code=400,
            detail="CSV must contain 'filename' and 'content' columns"
        )

    added = 0
    skipped = 0

    # ----------------------------------------------
    # Process every CSV row
    # ----------------------------------------------

    for row in reader:

        filename = (
            row.get("filename") or ""
        ).strip()

        content = (
            row.get("content") or ""
        ).strip()

        # Skip invalid rows
        if not filename or not content:
            skipped += 1
            continue

        try:
            add_cv(
                filename,
                content
            )

            added += 1

        except ValueError:
            # Duplicate or invalid CV
            skipped += 1

    # ----------------------------------------------
    # Response
    # ----------------------------------------------

    return {
        "message": "CSV processing completed",
        "records_added": added,
        "records_skipped": skipped
    }


# --------------------------------------------------
# GET ALL CVs
# --------------------------------------------------

@app.get("/cvs")
def get_cvs():

    results = get_all_cvs()

    return {
        "total_documents": len(results),
        "documents": [
            {
                "id": row["id"],
                "filename": row["filename"],
                "characters": row["characters"]
            }
            for row in results
        ]
    }


# --------------------------------------------------
# DELETE CV
# --------------------------------------------------

@app.delete("/cvs/{document_id}")
def delete_document(document_id: int):

    deleted = delete_cv(document_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return {
        "message": "Document deleted successfully",
        "document_id": document_id
    }


# --------------------------------------------------
# SEARCH CVs
# --------------------------------------------------

@app.get("/search")
def search(
    query: str,
    limit: int = 10
):

    # Validate limit
    if limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Limit must be greater than 0"
        )

    if limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit cannot be greater than 100"
        )

    results = search_cvs(
        query,
        limit
    )

    return {
        "query": query,
        "total_results": len(results),
        "results": [
            {
                "id": row["id"],
                "filename": row["filename"],
                "snippet": row["snippet"],
                "score": row["score"]
            }
            for row in results
        ]
    }