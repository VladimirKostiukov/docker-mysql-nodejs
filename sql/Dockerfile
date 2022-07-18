# Базовый образ.
FROM mysql:latest

# Создать базу данных "db_users" при старте
ENV MYSQL_DATABASE db_users

# Пароль для подключения к БД
ENV MYSQL_ROOT_PASSWORD: 123

# Скопировать скрипт который будет автоматически выполнен при запуске контейнера (все скрипты добавленные в docker-entrypoint-initdb.d будут выполнены поочередно).
# Скриапт создает таблицу и добавляет несколько записей.
COPY ./db_table_init.sql /docker-entrypoint-initdb.d

# Настройка кодировки utf8mb4 для СУБД MySQL (все дополнительные конфиги копируем сюда /etc/mysql/conf.d/)
COPY ./utf8mb4.cnf /etc/mysql/conf.d/

# Подключаться к порту 3306 (в файле docker-compose должен указываться вторым "3308:3306")
EXPOSE 3306