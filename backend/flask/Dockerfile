FROM python:3.9.2-alpine

# Install dependencies required for creating a virtual environment
RUN apk add --no-cache \
    gcc \
    libffi-dev \
    musl-dev \
    openssl-dev \
    python3-dev \
    postgresql-dev  # 🔹 Added to fix psycopg2 installation

# Upgrade pip
RUN pip install --upgrade pip

# Get curl for healthchecks
RUN apk add curl

# Permissions and nonroot user for tightened security
RUN adduser -D nonroot
RUN mkdir /home/app/ && chown -R nonroot:nonroot /home/app
RUN mkdir -p /var/log/sweatyrss && touch /var/log/sweatyrss/sweatyrss.err.log && touch /var/log/sweatyrss/sweatyrss.out.log
RUN chown -R nonroot:nonroot /var/log/sweatyrss
WORKDIR /home/app
USER nonroot

# Copy all the files to the container
COPY --chown=nonroot:nonroot . .

# Python setup and venv in one RUN command
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/home/app/venv
RUN python -m venv $VIRTUAL_ENV && \
    $VIRTUAL_ENV/bin/pip install --upgrade pip && \
    $VIRTUAL_ENV/bin/pip install -r requirements.txt

# Set PATH for the virtual environment
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Define the port number the container should expose
EXPOSE 8000

CMD ["/home/app/venv/bin/gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
