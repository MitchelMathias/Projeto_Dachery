import flask

app = flask.Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    usuario = flask.request.form.get('usuario')
    senha = flask.request.form.get('senha')

    if usuario == 'admin' and senha == 'admin':
        return flask.send_from_directory('./paginas', 'pag01.html')
    else:
        return flask.send_from_directory('./paginas', 'erro.html')

if __name__ == '__main__':
    app.run(debug=True)