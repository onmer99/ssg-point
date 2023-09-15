'use client'
import { useSession } from 'next-auth/react'
import React,{ useEffect, useState } from 'react'
import GiftPoint from './GiftPoint';

function GiftMainBody() {
  
  const [recUserName,setRecUserName] = useState<string>("");
  const [recUserPhone,setRecUserPhone] = useState<string>("");
  const [errText,setErrText] = useState<string>("");
  const [uuid,setUuid] = useState<string>("");
  const [Isview,setIsView] = useState<boolean>(false);
  
  
  const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  
    const {name,value} = e.target

    if(name === "recPhone"){
      setRecUserPhone(value)
    }
    if(name === "recName"){
      setRecUserName(value)
    }
    
  }

  const findUUIDUrl = "http://workjo.duckdns.org/api/v1/user/find-for-gift"
  const data = useSession();
  const token = data.data?.user.data.token;
  
  async function handleOnClick() {
    
    console.log(token)
    console.log(recUserName)
    console.log(recUserPhone)


    let req = {
      method:"POST",
      headers:{
        'Content-type':'application/json',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin':"*"
      },
      body:JSON.stringify({
        name:recUserName,
        phone:recUserPhone
      })
  }

    console.log(req)

      let response = await fetch(findUUIDUrl,req)
      
      if(response.ok){
        const data = await response.json();
        console.log(data)
        setIsView(true)
        setUuid(data.data)
        return
      }
      setErrText("해당 회원정보를 가진 사용자가 없습니다.")
      return
    //실제 사이트에서는 유저확인하는 모달이 뜸
    //시간되면 구현할 예정입니다.
  }
  useEffect(() => {
    console.log(`uuid = ${uuid}`)
  },[uuid]) 
  return (
    <>
      <div className='px-5 my-10'>
        <h3 className='hidden'>포인트 선물하기</h3>
        <p className='text-xl mt-6 mb-3'>선물하기</p>
        <span className='text-sm text-gray-500 '>신세계포인트를 선물 받으실 분의<br/>
              정보를 정확하게 입력해주세요.</span>
        <input
        type='text'
        onChange={handleOnChange}
        name='recPhone'
        placeholder='  -없이 휴대폰 번호를 입력해주세요.'
        className='text-sm border-[1px] border-gray-400 px-2 rounded-[8px] w-full h-[52px] mt-8 mb-2'
        />      
        <input
        type='text'
        onChange={handleOnChange}
        name='recName'
        placeholder='  실명을 정확하게 입력해 주세요.'
        className='text-sm border-[1px] border-gray-400 px-2 rounded-[8px] w-full h-[52px]'
        />      
        <button 
          className='bg-black w-full text-white my-10 rounded-[8px] h-[52px]'
          onClick={handleOnClick}
          >
          조회하기
        </button>
        <p className='text-red-500 text-xs'>{errText}</p>
        {
          Isview ? <GiftPoint 
                      userUuid={uuid}
                      recName={recUserName}
                      /> : null
        }
      </div>
    </>
  )
}

export default GiftMainBody
