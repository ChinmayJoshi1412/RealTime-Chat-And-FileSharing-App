import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';
const JoinPage = ({name,chatroom,setname,setchatroom}) => {
  const nav = useNavigate();
  const connect = (e)=>{
    e.preventDefault();
    socket.connect();
    socket.on('connect',()=>{
      console.log(name);
      socket.emit('join',{name,chatroom});
      nav('/chatpage');
    })
  }
  return (
    <div className='flex flex-col w-full h-full justify-center items-center p-5'>
      <h1 class="font-bold">
        Welcome
      </h1>
      <input type="text" className='rounded-lg p-2 mt-4 focus:border-blue w-1/2' placeholder='name' onChange={(e)=>setname(e.target.value)}/>
      <input type="text" className='rounded-lg p-2 mt-8 focus:border-blue w-1/2' placeholder='chatroom' onChange={(e)=>setchatroom(e.target.value)}/>
      <button className='mt-8 w-1/3 rounded-lg bg-gradient-to-tl from-blue to-lightTeal text-white font-bold text-xl p-2' onClick={connect}>Connect</button>
    </div>
  )
}

export default JoinPage