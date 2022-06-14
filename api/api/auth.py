import functools

from flask import (
    Blueprint,
    abort,
    g,
    request,
    session,
)

from api.db import get_db

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/register", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        db = get_db()
        username = request.json.get("username")
        password = request.json.get("password")
        error = None
        print(f"{username=}, {password=}")

        if not username:
            error = "Username is required"
        if not password:
            error = "Password is required"

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES ('f{username}', 'f{password}')"
                )
                db.commit()
                print("Executed!")
            except db.IntegrityError:
                error = f"User {username} is already registered."
            else:
                return "Success"  # return redirect(url_for("auth.login"))

        if error is None:
            error = "Success"

        return error

    if request.method == "GET":
        return "No GET for you"


@bp.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        db = get_db()
        username = request.json.get("username")
        password = request.json.get("password")
        user = db.execute(
            f"SELECT * FROM user WHERE username = '{username}' and password = '{password}'"
        ).fetchone()

        if user is None:
            abort(401)

        session.clear()
        session["username"] = user["username"]
        session["user_id"] = user["id"]
        return {"username": user["username"], "user_id": user["id"]}

    abort(400)


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None
    else:
        g.user = (
            get_db()
            .execute("SELECT * FROM user WHERE username = ?", (user_id,))
            .fetchone()
        )


@bp.route("/logout")
def logout():
    session.clear()
    return "OK"


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            abort(401)

        return view(**kwargs)

    return wrapped_view
