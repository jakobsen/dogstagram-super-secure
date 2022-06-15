from flask import (
    Blueprint,
    abort,
    g,
    request,
)
from flask_cors import CORS
from .auth import login_required

from api.db import get_db

bp = Blueprint("post", __name__, url_prefix="/posts")
CORS(bp, supports_credentials=True, origins=["https://localhost:3000"])


def get_posts():
    return [
        dict(post)
        for post in (
            get_db()
            .execute(
                "SELECT p.id, p.created, p.imageurl, p.body, a.username AS author, a.id AS authorid FROM post p JOIN user a ON author_id = a.id ORDER BY p.created DESC"
            )
            .fetchall()
        )
    ]


def get_post(id, check_author=False):
    post = (
        get_db()
        .execute(
            f"SELECT p.id, p.created, p.imageurl, p.body, a.username AS author, a.id AS authorid FROM post p JOIN user a WHERE p.id = f{id}"
        )
        .fetchone()
    )

    if post is None:
        abort(404)

    if check_author and post["author_id"] != g.user["id"]:
        abort(403)

    return post


def get_posts_with_comments_and_likes():
    posts = get_posts()
    print(posts)
    for post in posts:
        comments = (
            get_db()
            .execute(
                "SELECT username, body, created, comment.id AS id FROM comment JOIN user ON comment.author_id = user.id WHERE post_id = ? AND deleted = 0",
                (post["id"],),
            )
            .fetchall()
        )
        likes = (
            get_db()
            .execute(
                "SELECT username FROM post_like JOIN user ON post_like.user_id = user.id WHERE post_id = ?",
                (post["id"],),
            )
            .fetchall()
        )
        post["comments"] = [dict(comment) for comment in comments]
        post["likes"] = [like["username"] for like in likes]
    return posts


@bp.route("/", methods=("GET",))
@login_required
def posts():
    return {"posts": get_posts_with_comments_and_likes()}


@bp.route("/<id>", methods=("GET",))
def get(id):
    return {"post": get_post(id)}


@bp.route("/<id>/comment", methods=("GET", "POST"))
@login_required
def comment(id):
    if request.method == "POST":
        comment = request.json.get("comment")
        if comment is None:
            abort(400)
        db = get_db()
        db.execute(
            "INSERT INTO comment (author_id, post_id, body) VALUES (?, ?, ?)",
            (g.user["id"], id, comment),
        )
        db.commit()
        created_comment = db.execute(
            "SELECT username, body, created, comment.id AS id FROM comment JOIN user ON comment.author_id = user.id WHERE comment.id = last_insert_rowid()"
        ).fetchone()
        return dict(created_comment)


@bp.route("/<id>/like", methods=("GET", "POST", "DELETE"))
@login_required
def like(id):
    if request.method == "POST":
        db = get_db()
        db.execute(
            "INSERT INTO post_like (post_id, user_id) VALUES (?, ?)",
            (id, g.user["id"]),
        )
        db.commit()
        return {"success": True}
    if request.method == "DELETE":
        db = get_db()
        db.execute(
            "DELETE FROM post_like WHERE user_id = ? AND post_id = ?",
            (g.user["id"], id),
        )
        db.commit()
        return {"success": True}
