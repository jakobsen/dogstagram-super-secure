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


def get_posts():
    return [
        dict(post)
        for post in (
            get_db()
            .execute(
                """
                SELECT
                    p.id,
                    p.created,
                    p.imageurl,
                    p.body,
                    user.username AS author,
                    user.id AS authorid,
                    user.image_url AS authorImage
                FROM
                    post p
                    JOIN USER ON p.author_id = user.id
                ORDER BY
                    p.created DESC
                """
            )
            .fetchall()
        )
    ]


def get_post(id, check_author=False):
    post = (
        get_db()
        .execute(
            f"SELECT p.id, p.created, p.imageurl, p.body, user.username AS author, user.id AS authorid, user.image_url AS authorImage FROM post p JOIN user ON p.author_id = user.id WHERE p.id = '{id}'"
        )
        .fetchone()
    )

    if post is None:
        abort(404)

    if check_author and post["author_id"] != g.user["id"]:
        abort(403)

    return dict(post)


def get_post_with_comments_and_likes(id):
    post = get_post(id)
    db = get_db()
    comments = db.execute(
        "SELECT username, body, created, comment.id AS id FROM comment JOIN user ON comment.author_id = user.id WHERE post_id = ? AND deleted = 0",
        (post["id"],),
    ).fetchall()
    likes = db.execute(
        "SELECT username FROM post_like JOIN user ON post_like.user_id = user.id WHERE post_id = ?",
        (post["id"],),
    ).fetchall()
    post["comments"] = [dict(comment) for comment in comments]
    post["likes"] = [like["username"] for like in likes]
    return post


def get_posts_with_comments_and_likes():
    posts = get_posts()
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


@bp.route("/", methods=("GET", "POST"))
@login_required
def posts():
    if request.method == "GET":
        return {"posts": get_posts_with_comments_and_likes()}
    if request.method == "POST":
        image_url = request.json.get("imageUrl")
        body = request.json.get("body")
        print(image_url)
        if image_url is None or body is None:
            abort(400)
        db = get_db()
        db.execute(
            "INSERT INTO post (imageurl, body, author_id) VALUES (?, ?, ?)",
            (image_url, body, g.user["id"]),
        )
        db.commit()
        new_id = db.execute("SELECT last_insert_rowid() AS id").fetchone()["id"]
        return get_post_with_comments_and_likes(new_id)


@bp.route("/<id>", methods=("GET",))
@login_required
def get(id):
    return {"post": get_post_with_comments_and_likes(id)}


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
