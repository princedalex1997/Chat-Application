# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

the current  work folw  for sentding message to new user . 
1. Create a chat in /chat url.
body is :POST (http://localhost:5000/chats)
{
    "userId": "69cd6316dea4ff699734e362"
}

it will create a query in db also create an chatID. 
like  this 
[
    {
        "_id": "69d78f68454d5a67d8fcb0da",
        "chatName": "sender",
        "isGroupChat": "false",
        "users": [
            {
                "_id": "69cd5f72b09ef1176da06580",
                "name": "11",
                "email": "11@gmail.com",
                "isAdmin": false,
                "createdAt": "2026-04-01T18:09:54.979Z",
                "updatedAt": "2026-04-01T18:09:54.979Z",
                "__v": 0
            },
            {
                "_id": "69cd6316dea4ff699734e362",
                "name": "prince",
                "email": "p@gmail.com",
                "isAdmin": false,
                "createdAt": "2026-04-01T18:25:26.680Z",
                "updatedAt": "2026-04-01T18:25:26.680Z",
                "__v": 0
            }
        ],
        "createdAt": "2026-04-09T11:37:12.993Z",
        "updatedAt": "2026-04-09T11:37:12.993Z",
        "__v": 0
    }
]
so no chat fount at this time . you just create a query between sender and reciever

after that start   message to reciever
2. create a message it .  
this is URL & Body;
//  POST ,http://localhost:5000/message
// {
// 	"content":"hi Testinggg 2",
//  "chatId": "69c54b4c9052cddf06db0bc2"
// }
the chatId comes from resopnse from the 1st step .
then sent it . 