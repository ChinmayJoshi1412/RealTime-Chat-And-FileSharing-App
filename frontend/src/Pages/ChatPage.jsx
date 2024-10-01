import {useEffect, useState} from 'react'
import { socket } from '../socket'
import { useNavigate } from 'react-router-dom';
import { IoIosAttach } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
const ChatPage = ({events,name,chatroom,setevents}) => {

  const [value, setvalue] = useState("");
  const [file, setfile] = useState(null);
  const nav = useNavigate();

  const disconnect = (e)=>{
    e.preventDefault();
    socket.disconnect(); 
    setevents([]); 
    setvalue("");
    setfile(null);
    nav('/');
  }

  const sendmessage = (e)=>{
    e.preventDefault();
    console.log(`${name}`);
    socket.emit('chat',{msg:value,name,chatroom});
  }

useEffect(()=>{
  if (file) {
    console.log('Upload called');
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        socket.emit('file-upload', {fileName: file.name, fileData: arrayBuffer,name,chatroom},()=>console.log("File Uploaded"));
    };
    reader.readAsArrayBuffer(file);
}
},[file]);
  return (
    <div className='flex flex-col justify-center items-center'>
              <div className="flex flex-row bg-darkTeal rounded-t-xl w-full p-4 items-center">
                <h2 className=' text-white font-bold md:text-2xl'>Chatroom: {chatroom}</h2>
                <button className='ml-auto w-1/4 rounded-lg bg-gradient-to-tl from-blue to-lightTeal text-white font-bold md:text-xl p-2' onClick={disconnect}>Exit</button>
            </div>
                <ul id="messages" className='flex flex-col h-[20rem] w-full bg-white justify-start p-4 space-y-2 overflow-auto'>
          {
            events.map((event, index) =>{
              return event.name===name?<li key={index} className='flex flex-col ml-auto max-w-[50%] text-wrap leading-1.5 bg-darkTeal rounded-l-xl rounded-b-xl'>
              <div className="text-white text-xs text-end w-full bg-blue  p-2 rounded-tl-xl">{name}</div>
              {event.type==="msg"?<div className="md:text-md text-white text-wrap  p-4">{event.msg}</div>:<a className='flex flex-row space-x-2 md:text-sm text-white items-center p-4' href={window.URL.createObjectURL(event.blob)} download={event.fileName}><FaDownload size={20} className='mx-2' color='white'/><span className='text-wrap'>{event.fileName}</span></a>}
            </li>:<li key={index} className='flex flex-col mr-auto max-w-[50%] leading-1.5 bg-lightTeal rounded-r-xl rounded-b-xl'>
                <div className="text-white text-xs p-2 w-full bg-darkTeal rounded-tr-xl">{event.name}</div>
                {event.type==="msg"?<div className="md:text-md  p-4">{event.msg}</div>:<a className='flex flex-row md:text-md text-white text-wrap  p-4' href={window.URL.createObjectURL(event.blob)} download={event.fileName}><FaDownload size={20} className='mx-2' color='white'/><span className='text-wrap'>{event.fileName}</span></a>}
              </li>
            }
            )
          }
        </ul>  

      <form className='flex flex-row bg-darkTeal p-4 justify-center items-center rounded-b-xl w-full'>
        <div className="">
          <label for="file-input">
          <IoIosAttach color='white' size={30}/>
            </label>
            <input type="file" id='file-input' className='hidden' onChange={(e) => {
                  setfile(e.target.files[0]);
                }}/>
        </div>
            <input type="text" className='w-2/3 h-8 rounded border-solid p-2' onChange={(e)=>setvalue(e.target.value)}/>
            <button className='flex text-white font-bold justify-center items-center m-2 h-8 p-4 rounded bg-gradient-to-tl from-blue to-lightTeal' onClick={sendmessage} >Send</button>
        </form>
    </div>
  )
}

export default ChatPage