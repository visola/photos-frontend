FROM ubuntu AS downloader
RUN apt-get update && apt-get install -y curl

RUN mkdir -p /tmp/build/opt/app

RUN curl -L 'https://github.com/VinnieApps/spa-server/releases/latest/download/spa-server_linux_amd64' > /tmp/build/opt/app/spa-server
RUN chmod +x /tmp/build/opt/app/spa-server

FROM scratch

COPY --from=downloader /tmp/build /
COPY dist /opt/app

WORKDIR /opt/app
ENTRYPOINT ["./spa-server"]
