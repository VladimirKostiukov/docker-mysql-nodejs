const header_elements = (<div>
    <h2>Проект с применением Docker + Node.js + MySQL + ReactJS</h2>
    <h3>Последовательность:</h3>
    <ol>
        <li>При обращении к данной странице выполняется запрос на сервер (Node.js), запрашивается список пользователей.</li>
        <li>На стороне сервера осуществляется обращение к базе данных (сервер MySQL работает в другом контейнере Docker), считывается список пользователей.</li>
        <li>Полученный список пользователей сервер возвращает инициатору запроса.</li>
        <li>Ответ сервера обрабатывается и результат формируется с помощью React JSX.</li>
        <li>Список пользователей отображается на странице в виде таблицы.</li>
    </ol>
</div>)

ReactDOM.render(header_elements, document.getElementById("header"))

fetch('http://localhost:8000/getUsers')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log("ERROR of response")
            throw Error
        }
    })
    .then(data => {
        const usersList = data.map(item => (
            <tr><td className="center">{item.user_id}</td><td>{item.user_firstname}</td><td>{item.user_lastname}</td></tr>
        ));
        ReactDOM.render(<table><tbody><tr><th>ID</th><th>Имя</th><th>Фамилия</th></tr>{usersList}</tbody></table>, document.getElementById("table"))
    })
    .catch(error => {
        console.log(error)
    })

ReactDOM.render(<div><br /><div className="copy">&copy; VK 2022</div></div>, document.getElementById("footer"))