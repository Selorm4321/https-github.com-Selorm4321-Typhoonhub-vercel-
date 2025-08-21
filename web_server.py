#!/usr/bin/env python3
"""
Simple HTTP server for serving the TyphoonHub thumbnail fix demo
"""
import http.server
import socketserver
import sys
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    # Change to the directory containing the web files
    os.chdir('/home/user/webapp')
    
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running on port {PORT}")
        sys.stdout.flush()
        httpd.serve_forever()