import os

from flask import Flask, make_response, request
from flask_cors import CORS
from datetime import timedelta

from . import db
from . import auth


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="secret", DATABASE=os.path.join(app.instance_path, "api.sqlite")
    )

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/")
    def hello():
        cookie = request.cookies.get("foo")
        if cookie is None:
            res = make_response("Setting a cookie")
            res.set_cookie("foo", "bar", timedelta(days=30))
        else:
            res = make_response(f"The value of the cookie is {cookie}")
        return res

    db.init_app(app)
    app.register_blueprint(auth.bp)
    CORS(app)
    return app
