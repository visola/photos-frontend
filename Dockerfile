FROM ubuntu AS downloader
RUN apt-get update && apt-get install -y curl

ARG CACHEBUST=1
RUN curl -L 'https://github.com/VinnieApps/spa-server/releases/latest/download/spa-server_linux_amd64' > spa-server
RUN chmod +x spa-server

FROM scratch

COPY --from=downloader /spa-server /spa-server
COPY dist /

ENTRYPOINT ["/spa-server"]
