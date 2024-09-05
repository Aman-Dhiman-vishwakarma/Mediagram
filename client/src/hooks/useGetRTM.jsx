import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../redux/messageSlice';

const useGetRTM = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector((store)=>store.socket)
    const {messages} = useSelector((store)=>store.message)

  useEffect(()=>{
    socket?.on("newMessage", (newmessage)=>{
        dispatch(setMessage([...messages, newmessage]))
        console.log(newmessage)
    })

   return () => {
    socket?.off("newMessage")
   }  
  }, [messages, setMessage])
}

export default useGetRTM
