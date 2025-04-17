from flask import Flask, request, jsonify, redirect, url_for
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

app = Flask(__name__)

EMAIL_DESTINO = "mitchel.mathias.dev@gmail.com"

@app.route("/enviar", methods=["POST"])
def enviar_email():
    nome = request.form.get("nome")
    email = request.form.get("email")
    telefone = request.form.get("tel")
    mensagem = request.form.get("mensagem")

    corpo = f"""
    Nova mensagem do formulário:

    Nome: {nome}
    Email: {email}
    Telefone: {telefone}
    Mensagem: {mensagem}
    """

    msg = MIMEText(corpo)
    msg["Subject"] = "Mensagem do formulário da landing page"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = EMAIL_DESTINO

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            server.send_message(msg)
        return redirect('http://127.0.0.1:5500/index.html')
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
