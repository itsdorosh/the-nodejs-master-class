# Pirple - The Node.js Master Class

## Before run:
1. generate certificates for HTTPS server
2. create directory for data in following path `{repoRoot}/.data/`
3. create directory for users in following path `{repoRoot}/.data/users/`

#### For generation of cert.pem & key.pem use:

```shell
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
