'use client'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from "next/navigation";
import React,{useEffect, useState} from 'react'

function NewPointPwdTopPage() {
  interface pointPwType{
    pointPw:string,
    checkPointPw:string
  }
  const router = useRouter();
  const [errText,setErrText] = useState<string>("");
  const data = useSession();
  const token = data.data?.user.data.token;
  const [pointPwd,setPointPwd] = useState<pointPwType>({} as pointPwType)
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    

    const {name,value} = e.target;
    console.log(value)
    setPointPwd({
      ...pointPwd,
      [name]:value
    })
  }
  async function handleOnFetch() {
    let errMessage = ""
    if(pointPwd.checkPointPw !== pointPwd.pointPw){
      errMessage = "비밀번호를 다시 확인해주세요."
    }
    if(pointPwd.pointPw.length <= 5 ) {
      errMessage = "비밀번호를 숫자 4자리로 입력해주세요."
    }
    setErrText(errMessage)
    let req = {
      method:"PATCH",
      headers:{
        'Content-type':'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body:JSON.stringify({
        pointPw:pointPwd.pointPw
      })
    }
    console.log(req)
    let res = await fetch('https://workjo.duckdns.org/api/v1/user/point-pwd',req)

    const response = await res.json();
    if(res.ok){
      console.log(response)
      router.push("/")
    }
  }
  useEffect(()=>{
console.log(pointPwd)
  },[pointPwd])

  return (
    <div className='w-full'>
      <p className='text-xl mb-7'>포인트 비밀번호 변경</p>
      <p className='text-xs text-gray-500 mb-2'>포인트 비밀번호 입력<span className='text-[#EA035C]'>*</span></p>
      <input
      type='password'
      name='pointPw'
      onChange={handleOnChange}
      className='text-sm border-[1px] divide-[#e5e7eb] rounded-[8px] w-full h-[52px] mb-3'
      placeholder='숫자 4자리를 입력하세요.'
      />
      <p className='mb-2 text-xs text-gray-500'>포인트 비밀번호 확인<span className='text-[#EA035C]'>*</span></p>
      <input
      type='password'
      name='checkPointPw'
      onChange={handleOnChange}
      className='text-sm border-[1px] divide-[#e5e7eb] rounded-[8px] w-full h-[52px] mb-2'
      placeholder='숫자 4자리를 입력하세요.'
      />
      <button
      onClick={handleOnFetch}
      className='w-full p-4 my-[24px] text-center text-black text-sm rounded-lg bg-ssg-linear'>
        변경하기
      </button>
    </div>
  )
}

export default NewPointPwdTopPage
