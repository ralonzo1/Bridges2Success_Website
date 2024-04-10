# Use the official PHP image
FROM php:8.1-apache

# Set the working directory in the container
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip gnupg2

ENV ACCEPT_EULA=Y

# Add Microsoft SQL Server repository and install ODBC driver
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Update package lists and install dependencies
RUN apt-get update && apt-get install -y \
    unixodbc-dev \
    unixodbc \
    msodbcsql17

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip pdo

# Install pdo_sqlsrv extension
RUN pecl install sqlsrv pdo_sqlsrv && docker-php-ext-enable sqlsrv pdo_sqlsrv
RUN docker-php-ext-enable sqlsrv pdo_sqlsrv

# Copy project files to the working directory
COPY . .

# Install project dependencies
RUN composer install


# Expose port 3000 for the Laravel web server
EXPOSE 8000

# Start the Laravel web server
CMD ["php", "artisan", "serve", "--host=127.0.0.1", "--port=8000"]
