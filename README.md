# docker-mysql-nodejs
Проект с применением Docker + MySQL + Node.js + React.js
<p>Проект реализован с применением контейнизатора приложений Docker, програмной платформы Node.js, реляционной системы управления базами данных MySQL и React JSX для визуализации результата.</p>
<h2>Основная цель</h2>
<p>Реализовать взаимодействие между двумя контейнерами Docker в одной сети.</p>
<h2>Что делает проект</h2>
<p>При старте, создается два Docker образа:</p>
<ol>
<li>Запускает в первом контейнере MySQL, создает базу данных &laquo;db_users&raquo;, создает таблицу &laquo;users&raquo; и записывает в нее 4 имени и фамилии.</li>
<li>Node.js поднимает во втором контейнере локальный сервер для возможности работы с HTML файлами в браузере.</li>
</ol>
<p><strong>Далее</strong>:</p>
<ol>
<li>При обращении к странице <a href="http://localhost:8000/users.html">http://localhost:8000/users.html</a> выполняется запрос на сервер (Node.js), запрашивается список пользователей.</li>
<li>На стороне сервера осуществляется обращение к базе данных (сервер MySQL работает в другом контейнере Docker), считывается список пользователей.</li>
<li>Полученный список пользователей сервер возвращает инициатору запроса.</li>
<li>Ответ сервера обрабатывается и результат формируется с помощью React JSX.</li>
<li>Список пользователей отображается на странице в виде таблицы.</li>
</ol>
<h2>Решение проблем</h2>
<p>В процессе реализации проекта возникли проблемы, с которыми могут столкнуться многие начинающие разработчики.</p>
<h3>После установки на локальный компьютер, Docker Desktop <span>не работает.</span></h3>
<p>Основной причиной данной проблемы может быть то, что на компьютере отключена аппаратная виртуализация. Для проверки (на примере ОС Windows 10), откройте &laquo;Диспетчер задач / Производительность / ЦП&raquo;, параметр "Виртуализация: Отключена". Включить аппаратную виртуализацию можно через &laquo;Панель управления / Программы и компоненты / Включение или отключение компонентов Windows&raquo; активировав функцию &laquo;Hiper-V&raquo; и/или &laquo;Платформа виртуальной машины&raquo;. Если после перезагрузки ПК проблема не будет решена, значит аппаратная виртуализация отключена в BIOS. На примере процессора AMD искать и активировать в BIOS <span>параметр "SVM Mode" либо "Secure virtual machine", либо "AMD-V".</span></p>
<p>Если при первом запуске Docker Desktop <span>появится сообщение &laquo;WSL 2 installation is incomplete. </span>The WSL 2 Linux is now installed using a separate MSI update package <span>.... </span>install the kernel update&raquo;, перейдите по предложенной ссылке для установки пакета обновления ядра Linux. После установки пакета, перезагрузите ПК.</p>
<h3>Управление последовательностью запуска контейнеров</h3>
<p>Возможна ситуация, когда контейнер с MySQL <span>приходит в рабочее состояние позже чем контейнер с приложением, которое подключается к базе данных. Возникает ошибка &laquo;connect ECONNREFUSED &hellip;&raquo;. Для решения данной проблемы необходимо в файле </span>docker-compose.yml <span>установить следующую зависимость:</span></p>
<p>version: '3.9'<br />
services:<br />
&nbsp; db:<br />
&nbsp; &nbsp; healthcheck:<br />
&nbsp; &nbsp; &nbsp; &nbsp; test: "/usr/bin/mysql --user=root --password=123 --execute \"SHOW DATABASES;\""<br />
&nbsp; &nbsp; &nbsp; &nbsp; interval: 2s<br />
&nbsp; &nbsp; &nbsp; &nbsp; timeout: 20s<br />
&nbsp; &nbsp; &nbsp; &nbsp; retries: 10<br />
&nbsp;nodejs:<br />
&nbsp; &nbsp;depends_on:<br />
&nbsp; &nbsp; &nbsp;db:<br />
&nbsp; &nbsp; &nbsp; &nbsp;condition: service_healthy</p>
<p>В данном примере указаны только те настройки, которые отвечают за определение последовательности запуска контейнеров. Эта инструкция говорит Docker&rsquo;у о том, что контейнер &laquo;nodejs&raquo; должен запуститься после того (&laquo;depends_on&raquo;) как контейнер &laquo;db&raquo; будет в рабочем состоянии (&laquo;condition: service_healthy&raquo;). В свою очередь, контейнер &laquo;db&raquo; при старте, должен успешно пройти проверку (&laquo;healthcheck&raquo;) выполнив команду, указанную в &laquo;test&raquo;. Если команда &laquo;test&raquo; не выполнена при первой попытке, она повторяется заданное кол-во раз (&laquo;retries&raquo;) с параметрами &laquo;interval&raquo; и &laquo;timeout&raquo;. Таким образом, контейнер &laquo;nodejs&raquo; не будет запущен, пока &laquo;db&raquo; не пройдет проверку работоспособности.</p>
<h3>Проблемы с кодировкой в базе данных MySQL</h3>
<p>Довольно распространенная ситуация, когда в базе данных записи хранятся в кириллице, но при их извлечении из БД кодировка не соответствует ожидаемой и вместо понятного текста получаем набор каких-то символов. В некоторых случаях, помогает после подключения к БД выполнение запроса &laquo;SET NAMES <span>&rsquo;название_кодировки&rsquo;&raquo;, однако это срабатывает не всегда, так как данный запрос распространяется не на все переменные окружения (полный список переменных кодировки: character_set_client, character_set_connection, character_set_database, character_set_results, character_set_server, character_set_system). При наличии возможности и при отсутствии противопоказаний, нужную кодировку можно указать в конфигурационном файле, который расположен на сервере </span>MySQL <span>по адресу /etc/</span>my.cnf, либо создать свой собственный file_name.cnf <span>и поместить его в папку /etc/mysql/conf.d/. Для примера, чтобы работать с любой кодировкой включая кириллицу, моно установить кодировку </span>UFT-8 (в официальной документации MySQL <span>рекомендуется использовать utf8mb4 вместо </span>utf8). Для этого, в файл my.cnf или собственный file_name.cnf следует добавить следующие строки:</p>
<p>[client]<br />
default-character-set = utf8mb4<br /></p>
<p>[mysql]<br />
default-character-set = utf8mb4<br /></p>
<p>[mysqld]<br />
character-set-client-handshake = FALSE<br />
init_connect ='SET collation_connection = utf8mb4_unicode_ci'<br />
init_connect ='SET NAMES utf8mb4'<br />
character-set-server = utf8mb4<br />
collation-server = utf8mb4_unicode_ci<br />
<h2>Как запустить проект</h2>
<p>Перед запуском проекта на ПК должен быть предварительно установлен Docker Desktop.</p>
<ol>
<li>Скачать проект в рабочий каталог git clone https://github.com/VladimirKostiukov/docker-mysql-nodejs.git.</li>
<li>Запустить Docker Desktop.</li>
<li>С помощью консоли (терминала) перейти в каталог проекта docker-mysql-nodejs (где расположен файл docker-compose.yml).</li>
<li>В командной строке выполнить <cpan style="color: green;">docker-compose up</cpan>.</li>
<li>Подождать пока Docker создаст образы и запустит контейнеры.</li>
<li>Признаком успешного окончания сборки и запуска является наличие в консоли последних двух строк следующего вида: &laquo;Server started on port 8080&raquo; и &laquo;Connection to MySQL server successfully&raquo;.</li>
<li>Скопировать адрес http://localhost:8000/users.html в адресную строку браузера и нажать ENTER.</li>
<li>В окне браузера отобразится список имен и фамилий.</li>
</ol>
