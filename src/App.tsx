import { ChangeEventHandler, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from 'aws-amplify/storage';
import { StorageImage} from '@aws-amplify/ui-react-storage';
import { getUrl } from 'aws-amplify/storage';


const client = generateClient<Schema>();

// const linkToStorageFile = await getUrl({
//   path: "picture-submissions/cv_esquinazi_daniel.pdf",
//   // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
// });
// console.log('signed URL: ', linkToStorageFile.url);
// console.log('URL expires at: ', linkToStorageFile.expiresAt);

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const { user, signOut } = useAuthenticator();
    const [file, setFile] = useState<File | undefined>();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }
    uploadData({
      path: `picture-submissions/${file.name}`,
      data: file,
    });
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  function deleteTodo(id: string) {
    client.models.Todo.delete({id});
  }
  function sayHello() {
    client.queries.sayHello({ name: "Daniel" }).then((response) => {
      console.log("Response from sayHello function: ", response);
    })
  }

  return (
    <main>
            <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleClick}>Upload</button>
    </div>
    <a href={"linkToStorageFile.url.toString()"} target="_blank" rel="noreferrer">
  file
</a>
    <StorageImage alt="cat" path="picture-submissions/wanda-wanda-nara.gif" />
    <div>
      <button onClick={sayHello} >Say Hello</button>
    </div>
      <button onClick={signOut} >Signout</button>
    </main>
  );
}

export default App;
