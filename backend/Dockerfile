# Use the official PHP image
FROM --platform=linux/amd64 php:8.1-apache

# Set the working directory in the container
WORKDIR /var/www/html

ENV DEBIAN_FRONTEND=noninteractive
ENV ACCEPT_EULA=Y

# Install system dependencies (add curl) and ODBC libs early
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gnupg2 \
    libzip-dev zip unzip \
    unixodbc unixodbc-dev

# Add Microsoft SQL Server repository (signed-by) - for Debian 12 (bookworm)
RUN set -eux; \
    mkdir -p /usr/share/keyrings; \
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
      | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg; \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
      > /etc/apt/sources.list.d/microsoft-prod.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends msodbcsql18 mssql-tools18; \
    echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' > /etc/profile.d/mssql-tools.sh

# Install Composer
RUN curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# PHP extensions and SQLSRV
RUN docker-php-ext-configure zip \
 && docker-php-ext-install -j"$(nproc)" zip pdo \
 && pecl install sqlsrv pdo_sqlsrv \
 && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Copy project files to the working directory
COPY . .

# Install project dependencies
RUN composer install --no-interaction --prefer-dist --no-progress

# Expose port 8000 for the Laravel built-in server
EXPOSE 8000

# Start the Laravel web server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
