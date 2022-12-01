import time
from flask import Flask, request

app = Flask(__name__)


@app.route("/api/time", methods=["POST"])
def get_current_time():
    input = request.json
    print(input)
    send = {str(input): time.time()}

    return send
