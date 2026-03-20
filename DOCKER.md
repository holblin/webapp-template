# Docker Build and Docker Hub Push

## 1) Build the image locally

```bash
docker build -t <dockerhub-username>/webapp-template:latest .
```

## 2) Run locally

```bash
docker run --rm -p 4000:4000 <dockerhub-username>/webapp-template:latest
```

The app will be available at:

- Frontend: `http://localhost:4000`
- GraphQL endpoint: `http://localhost:4000/graphql`
- Storybook: `http://localhost:4000/storybook/`

## 3) Log in to Docker Hub

```bash
docker login
```

## 4) Push image

```bash
docker push <dockerhub-username>/webapp-template:latest
```

## 5) Optional versioned tag

```bash
docker tag <dockerhub-username>/webapp-template:latest <dockerhub-username>/webapp-template:v1
docker push <dockerhub-username>/webapp-template:v1
```

## Notes

- Container listens on port `4000` by default.
- You can change the runtime port with `-e PORT=<port>`.
