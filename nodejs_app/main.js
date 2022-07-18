const http = require('http');
const fs = require("fs");
const mysql = require('mysql2');

// Создаем и запускаем сервер
http.createServer(function (request, response) {

    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    const filePath = request.url.substr(1);
    fs.readFile(filePath, function (error, data) {
        if (error) {
            response.statusCode = 404;
            response.end("File not found! " + request.url);
        }
        else {
            response.end(data);
        }
    });
}).listen(8080, function () {
    console.log("Сервер запущен на 8080 порту");
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
        return console.error("Ошибка поключения к серверу MySQL: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

// Запрос к БД
var db_data = ''; // для формирования результата запроса к БД
connection.query("SELECT * FROM users",
    function (err, results, fields) {
        if (err) {
            console.log("Ошибка запроса к БД: " + err);
        }

        if (results) {
            // перебираем результат запроса к БД
            results.forEach(function (row) {
                // результат запроса интегрируем в html код
                db_data += '<tr><td style="text-align: center;">' + row.user_id + '</td><td>' + row.user_firstname + '</td><td>' + row.user_lastname + '</td></tr>\n';
            });

            // добавляем результат запроса в html код страницы на которой будут отображаться данные из БД
            AddDataToHtml(db_data);
        }
    });

// Закрытие подключения к серверу MySQL
connection.end(function (err) {
    if (err) {
        return console.log("Ошибка закрытия подключения к серверу MySQL: " + err.message);
    }
    console.log("Подключение к серверу MySQL закрыто");
});

// Формирует html код и записывает его в файл data.html
function AddDataToHtml(db_data) {
    console.log('Запись полученных данных в файл');
    var html = '<!DOCTYPE html>\n\
<html>\n\
<link rel="stylesheet" type="text/css" media="screen" href="main.css">\n\
<head>\n\
<meta charset="utf8">\n\
<title>Данные из БД</title>\n\
</head>\n\
<body>\n<table>\n<tbody>\n<tr><th>ID</th><th>Имя</th><th>Фамилия</th></tr>\n' + db_data + '</tbody>\n</table>\n</body>\n\
</html>';
    // запись в файл
    fs.writeFileSync("./data.html", html);
    console.log('Просмотр результата по адресу: http://localhost:8000/data.html');
}