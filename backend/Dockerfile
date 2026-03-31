FROM php:8.5-fpm

# 1. Cài đặt các thư viện hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl

# 2. Cài đặt PHP extensions (đặc biệt là pdo_mysql để chạy database)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 3. Kích hoạt Apache Rewrite để Laravel chạy được các route
RUN a2enmod rewrite

# 4. Cài đặt Composer vào container
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Thiết lập thư mục làm việc
WORKDIR /var/www/html
COPY . .

# 6. Chạy Composer để cài đặt thư viện Laravel
RUN composer install --no-dev --optimize-autoloader

# 7. Phân quyền cho thư mục storage và cache (rất quan trọng)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Cấu hình Apache trỏ thẳng vào thư mục public của Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

EXPOSE 80