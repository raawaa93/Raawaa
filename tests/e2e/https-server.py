from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import ssl

CERT = os.environ.get("TLS_CERT", "/tmp/rawaa-e2e.crt")
KEY = os.environ.get("TLS_KEY", "/tmp/rawaa-e2e.key")
HOST = "127.0.0.1"
PORT = 4173

server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile=CERT, keyfile=KEY)
server.socket = context.wrap_socket(server.socket, server_side=True)

print(f"Serving RAWAA E2E over HTTPS at https://{HOST}:{PORT}", flush=True)
server.serve_forever()
