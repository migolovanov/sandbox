# Dockerfile - Sandbox

FROM ubuntu:bionic

LABEL maintainer="Mikhail Golovanov <migolovanov@gmail.com>"

COPY /sandbox /opt/sandbox

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        php \
        php-dev \
        php-pear \
        python \
        python-pip \
        python3 \
        ruby \
        perl \
        curl \
        gnupg2 \
      	make \
      	build-essential \
    && pip install requests \
    && pecl install uopz \
    && echo 'extension=uopz.so' >> /etc/php/7.2/cli/php.ini \
    && cd /opt/sandbox \
    && apt-get purge -fy make build-essential php-pear python-pip \
    && rm -fr /var/cache/apt/archives/* \
    && mkdir -p /data/files \
    && touch /data/logs.log \
    && mv /bin/bash /bin/bash.real \
    && mv /bin/sh /bin/sh.real \
    && mv /usr/bin/curl /usr/bin/curl.real \
    && chmod +x /opt/sandbox/logger.py /opt/sandbox/wrapper* \
    && ln -s /opt/sandbox/wrapper.sh /bin/bash \
    && ln -s /opt/sandbox/wrapper.sh /bin/sh \
    && ln -s /opt/sandbox/logger.py /usr/bin/wget \
    && ln -s /opt/sandbox/logger.py /usr/bin/curl \
    && sed -i 's/\#!\/bin\/\(sh\|bash\)/\#!\/bin\/bash\.real/g' /usr/sbin/service \
    && touch /data/logs.log

ENTRYPOINT ["/bin/bash.real"]
CMD []
