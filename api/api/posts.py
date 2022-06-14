from flask import (
    Blueprint,
    abort,
    g,
    request,
    session,
)
from pprint import pprint
from .auth import login_required

from api.db import get_db

bp = Blueprint("post", __name__, url_prefix="/posts")


def get_posts():
    return [
        dict(post)
        for post in (
            get_db()
            .execute(
                "SELECT p.id, p.created, p.imageurl, p.body, a.username AS author, a.id AS authorid FROM post p JOIN user a;"
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
                "SELECT username, body, created FROM comment JOIN user WHERE post_id = ? AND deleted = 0",
                (post["id"],),
            )
            .fetchall()
        )
        likes = (
            get_db()
            .execute(
                "SELECT username FROM post_like JOIN user WHERE post_id = ?",
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
