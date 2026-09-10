import sqlite3

DB_NAME = "cv_matcher.db"


def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_database():
    conn = get_connection()

    conn.execute("""
        CREATE VIRTUAL TABLE IF NOT EXISTS cvs
        USING fts5(
            filename,
            content
        )
    """)

    conn.commit()
    conn.close()