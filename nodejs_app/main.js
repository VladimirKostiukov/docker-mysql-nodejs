const http  = require('http');
const fs    = require("fs");
const mysql = require('mysql2');

// Создаем и запускаем сервер
http.createServer(function (request, response) {
    console.log(`Requested address: ${request.url}`);
    // Обработка запроса от users.html
    if (request.url == '/getUsers') {
        connection.query('SELECT * FROM users', function (err, rows, fields) {
            if (!err) {
                // Возвращаем выборку из базы данных (список пользователей)
                response.end(JSON.stringify(rows));
            } else {
                console.log('Error while executing query: ' + err.message);
            }
        });
    } else {
            // Получаем путь после слеша
            const filePath = request.url.substr(1);
            fs.readFile(filePath, function (error, data) {
                if (error) {
                    response.statusCode = 404;
                    response.end("File not found! " + request.url);
                } else {
                    // Возвращаем содержимое файла
                    response.end(data);
                }
            });
    }
}).listen(8080, function () {
    console.log("Server started on port 8080");
});

// Параметры подключения к БД
const connection = mysql.createConnection({
    host: "db", // вместо IP-адреса используем имя сервиса БД из файла docker-compose.yml
    port: "3306", // подключаемся к порту контейнера БД который указан в Dokerfile EXPOSE 3306
    user: "root",
    database: "db_users",
    password: "123"
});

// Подключаемся к серверу MySQL
connection.connect(function (err) {
    if (err) {
        return console.error("Error connecting to MySQL server: " + err.message);
    } else {
        console.log("Connection to MySQL server successfully");
    }
});

/*
// Закрытие подключения к серверу MySQL
connection.end(function (err) {
    if (err) {
        return console.log("Error closing connection to MySQL server: " + err.message);
    }
    console.log("Connection to MySQL server closed");
});
*/