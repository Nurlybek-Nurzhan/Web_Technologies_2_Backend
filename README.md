# Assignment #1 — Building Your First Express API (GET, POST, PUT, DELETE) with JSON Storage

## 1. Project Description

This project is a RESTful API built using **Node.js** and **Express**. It is designed to manage a list of tasks and stores all data persistently in a local **JSON file** (`data.json`). This project demonstrates the implementation of the four basic CRUD operations: Create, Read, Update, and Delete.

## 2. Chosen Object: Task

For this project, the **Task** object was selected. Each task consists of the following fields:

* **id**: A unique number (generated using `Date.now()`).
* **name**: A string representing the title of the task.
* **completed**: A boolean indicating if the task is finished (defaults to `false`).

## 3. Setup Instructions (How to install dependencies)

To get this project running on your local machine, follow these steps:

1. **Navigate to the project directory**:
```bash
cd "WEB Technologies 2"

```


2. **Initialize the project (if not already done)**:
```bash
npm init -y

```


3. **Install Express**:
```bash
npm install express

```



## 4. How to Run the Server

To start the backend server, run the following command in your terminal:

```bash
node server.js

```

The server will start and listen for requests at `http://localhost:3000`.

## 5. List of API Routes (Route Documentation)

### Demo Routes

| Method | Route | Description |
| --- | --- | --- |
| **GET** | `/` | Returns a simple "Server is running" message. |
| **GET** | `/hello` | Returns a JSON object: `{ "message": "Hello from server!" }`. |
| **GET** | `/time` | Returns the current server time in ISO format. |
| **GET** | `/status` | Returns 200 OK and server uptime data. |

### Task CRUD Routes

| Method | Route | Description |
| --- | --- | --- |
| **GET** | `/tasks` | Reads and returns all tasks from `data.json`. |
| **POST** | `/tasks` | Adds a new task to the list and saves it to the file. |
| **PUT** | `/tasks/:id` | Updates an existing task's name or status based on ID. |
| **DELETE** | `/tasks/:id` | Removes the specified task from the list and saves changes. |

## 6. Example Postman Requests

### POST (Create Task)

* **URL**: `http://localhost:3000/tasks`
* **Body**:
```json
{ "name": "Finish my assignment" }

```



### PUT (Update Task)

* **URL**: `http://localhost:3000/tasks/1766334835384`
* **Body**:
```json
{ "name": "Assignment Finished!", "completed": true }

```



---

## 7. Postman Test Screenshots

### GET all tasks
<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/08b5088b-6216-4635-a674-579ef0018dbc" />

### POST a new task
<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/6cb2e4a9-f509-46de-92d5-6b220848b06c" />

### PUT update a task
<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/09b05a65-07c5-4028-9d67-65c576ade8ba" />

### DELETE a task
<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/a497782d-0a66-4a4d-bb6c-8b29fd639cec" />
