# gamepointagent.com Domain Check

$ curl -L --max-time 20 -i https://gamepointagent.com
HTTP/1.1 200 OK
date: Wed, 08 Jul 2026 06:29:27 GMT
server: envoy

HTTP/1.1 503 Service Unavailable
content-length: 22
content-type: text/plain
date: Wed, 08 Jul 2026 06:29:27 GMT
server: envoy

DNS resolution failure

Result: The requested production URL did not serve the GamePoint web app from this environment. The response indicates DNS/custom-domain routing is not correctly attached to a deployed Cloudflare target yet.
