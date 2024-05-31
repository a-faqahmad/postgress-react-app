import { useState, useEffect } from "react";
import { client } from "./api/client";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editUser, setEditUser] = useState(0);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await client.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onAddUser = async () => {
    if (!name || !email || !password) {
      alert("name, email and password are required");
      return;
    }
    try {
      const response = await client.post("/user", {
        name: name,
        email: email,
        password: password,
      });
      getUsers();
    } catch (error) {
      console.log(error);
    }
    setName("");
    setEmail("");
    setPassword("");
  };

  const onEditUser = async (id) => {
    if (!editName || !editEmail) {
      alert("name, email and password are required");
      return;
    }
    try {
      const response = await client.put(`/user/${id}`, {
        name: editName,
        email: editEmail,
      });
      setEditUser(0);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteUser = async (id) => {
    try {
      const response = await client.delete(`/user/${id}`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  });

  return (
    <div>
      <div class="flex items-center justify-center gap-8 mb-4 w-full sm:flex-col sm:items-center">
        <div>
          <label class="mr-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40"
          />
        </div>
        <div>
          <label class="mr-2">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40"
          />
        </div>
        <div>
          <label class="mr-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onAddUser}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add a user
      </button>

      <div class="flex flex-col justify-start items-center">
        {users.map((user) => (
          <div class="flex items-center justify-center gap-8 mb-4 w-full sm:flex-col sm:items-center">
            <div>
              {editUser === user.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40"
                />
              ) : (
                <label class="mr-2">Name: {user.name}</label>
              )}
            </div>
            <div>
              {editUser === user.id ? (
                <input
                  type="text"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  class="border border-gray-300 rounded-lg px-3 py-2.5 text-sm w-40"
                />
              ) : (
                <label class="mr-2">Email: {user.email}</label>
              )}
            </div>
            <div>
              <label class="mr-2">Password:</label>
              {user.password}
            </div>
            <button
              type="button"
              onClick={() => {
                if (editUser === user.id) {
                  onEditUser(user.id);
                } else {
                  setEditUser(user.id);
                  setEditName(user.name);
                  setEditEmail(user.email);
                }
              }}
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {editUser === user.id ? "Proceed" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => onDeleteUser(user.id)}
              class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
