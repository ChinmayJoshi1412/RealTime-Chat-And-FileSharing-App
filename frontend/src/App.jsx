import ChatPage from "./Pages/ChatPage";
import { useState,useEffect } from "react";
import { socket } from "./socket";
import { Outlet } from "react-router-dom";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import JoinPage from './Pages/JoinPage';
import MainLayout from "./Layout/MainLayout";

function App() {
  const [isConnected, setisConnected] = useState(socket.connected);
  const [events, setevents] = useState([]);
  const [name, setname] = useState("");
  const [chatroom, setchatroom] = useState("");

  useEffect(()=>{
    const onConnect=()=>{
      setisConnected(true);
    };
    const onDisconnect = ()=>{
      setisConnected(false);
    }
    const onChatEvent=({msg,name})=>{
      setevents(prev=>[...prev,{type:"msg",msg,name}]);
    }
    
    const onFileEvent=({fileName,fileData,name,chatroom})=>{
      console.log('file received');
      const blob = new Blob([fileData], { type: 'application/octet-stream' });
      setevents(prev=>[...prev,{type:"file",fileName,blob,name,chatroom}])
    }


    socket.on('connect',onConnect);
    socket.on('disconnect',onDisconnect);
    socket.on('chat',onChatEvent);
    socket.on('file-received',onFileEvent);

    return ()=>{
      socket.off('connect',onConnect);
      socket.off('disconnect',onDisconnect);
      socket.off('chat',onChatEvent);
      socket.off('file-received',onFileEvent);
    }
  },[]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout/>}>
        <Route index={true} element={<JoinPage name={name} chatroom={chatroom} setname={setname} setchatroom={setchatroom} />}/>
        <Route path='/chatpage' element={<ChatPage events={events} name={name} chatroom={chatroom} setevents={setevents}/>}/>
      </Route>
    )
  )

  return <RouterProvider router={router}/>
}

export default App;
