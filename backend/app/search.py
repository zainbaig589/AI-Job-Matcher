from .database import get_connection


def add_cv(filename: str, content: str):

    filename = filename.strip()
    content = content.strip()

    if not filename:
        raise ValueError("Filename cannot be empty")

    if not content:
        raise ValueError("CV content cannot be empty")

    conn = get_connection()

    # Check for duplicate filename
    existing = conn.execute(
        "SELECT rowid FROM cvs WHERE filename = ?",
        (filename,)
    ).fetchone()

    if existing:
        conn.close()
        raise ValueError(
            f"A document named '{filename}' already exists"
        )

    cursor = conn.execute(
        "INSERT INTO cvs (filename, content) VALUES (?, ?)",
        (filename, content)
    )

    document_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return document_id


def search_cvs(query: str, limit: int = 10):

    conn = get_connection()

    query = query.strip()

    if not query:
        conn.close()
        return []

    words = query.split()

    fts_query = " ".join(
        f'"{word}"' for word in words
    )

    results = conn.execute("""
        SELECT
            rowid AS id,
            filename,
            snippet(
                cvs,
                1,
                '<mark>',
                '</mark>',
                '...',
                20
            ) AS snippet,
            bm25(cvs) AS score
        FROM cvs
        WHERE cvs MATCH ?
        ORDER BY score
        LIMIT ?
    """, (fts_query, limit)).fetchall()

    conn.close()

    return results


def get_all_cvs():

    conn = get_connection()

    results = conn.execute("""
        SELECT
            rowid AS id,
            filename,
            length(content) AS characters
        FROM cvs
        ORDER BY rowid DESC
    """).fetchall()

    conn.close()

    return results


def delete_cv(document_id: int):

    conn = get_connection()

    existing = conn.execute(
        "SELECT rowid FROM cvs WHERE rowid = ?",
        (document_id,)
    ).fetchone()

    if not existing:
        conn.close()
        return False

    conn.execute(
        "DELETE FROM cvs WHERE rowid = ?",
        (document_id,)
    )

    conn.commit()
    conn.close()

    return True