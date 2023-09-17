'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

function GiftPoint({userUuid,recName}:{
  userUuid:string,
  recName:string
}) {

  const data = useSession();
  const token = data.data?.user.data.token;

  interface sendGiftUserDataType{
    message:string,
    point:number,
    pointPassword:string,
    toUserUuid:string,
    toUserName:string
  }
  const [sendGiftUserData,setSendGiftUserData] = useState<sendGiftUserDataType>({
    message:"",
    point:0,
    pointPassword:"",
    toUserUuid:userUuid,
    toUserName:recName
  })

  fetchPoint()

  const userName = recName;
  //이름 중간부분 별표처리는 시간이 부족해서 일단 넘어가겠습니다 ㅜㅜ
  // const point = useContext(AppContext);
  const [point,setPoint] = useState<number>(0);
  const [usePointMessage,setUsePointMessage] = useState<boolean>(false);
  const handleOnClick = ( e : any) => {

    if(e.target.name === "use"){
      setUsePointMessage(true)
      return
    }
    setUsePointMessage(false)
  }

  const [sendPoint,setSendPoit] = useState<boolean>(false);

  async function handleOnFetch( e : React.MouseEvent<HTMLButtonElement>) {

    if(point < sendGiftUserData.point){
      Swal.fire({
        text:"포인트가 부족합니다!",
        icon: "error",
        toast: false,
        position: "center",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          container: "my-swal",
        },
      })
      return
    }
    let res = await fetch("https://workjo.duckdns.org/api/v1/point/gifts/give",{
      method:"POST",
      headers:{
        'Content-type':'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body:JSON.stringify({
        "message":sendGiftUserData.message,
        "point":sendGiftUserData.point,
        "pointPassword":sendGiftUserData.pointPassword,
        "toUserUuid":sendGiftUserData.toUserUuid,
        "toUserName":sendGiftUserData.toUserName
      })
    })
    if(res.ok){
      Swal.fire({
        text:"따뜻한 마음과 함께 포인트 선물이 완료되었어요.",
        icon: "success",
        toast: false,
        position: "center",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          container: "my-swal",
        },
      })
      setSendPoit(!sendPoint)
    }
    const data = await res.json();
    console.log(data)

  }
  const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const {name,value} = e.target
    
    if(name === "point"){
      let point = Number(value);
      setSendGiftUserData({
        ...sendGiftUserData,
        [name]:point
      })
      return
    }
    setSendGiftUserData({
      ...sendGiftUserData,
      [name]:value
    })
  }
  async function fetchPoint() {

    let res = await fetch("https://workjo.duckdns.org/api/v1/point/simple-info",{
      method:"GET",
      headers:{
        'Authorization': `Bearer ${token}`
      }
    });
    const json = await res.json();
    if(res.ok){
      setPoint(json.data.usableTotalPoint)
    }
  }
  useEffect(() => {
    
  fetchPoint()

  },[sendPoint])
  return (
    <div className='py-5'>
      <p className='text-sm mb-2 text-[#EA035C]'><b>포인트 받으실 분을 확인하세요.</b></p>
      <div className='drop-shadow-xl relative w-full border-[2px] border-[#EA035C] h-[90px] rounded-[8px]'>
        <p className='absolute top-[22px] left-[20px] text-xs text-black'>선물 받을 분:</p><br/>
        <p className='absolute top-[28px] left-[20px] pt-3'>{userName}</p>
        {/* 유저의 ID도 표시되는데 API에 ID가 없어서 일단 넘어가겠습니다ㅜㅜ */}
      </div>
      <ul>
        <li className='my-10'>
          <p className='text-sm'><b>선물가능 포인트</b></p>
          <p className='pt-[7px] text-2xl text-[#EA035C]'><b>{point}p</b></p>
        </li> 
        <li>
          <p className='text-sm pb-2'><b>선물할 포인트<span className='text-[#EA035C]'>*</span></b></p>
          <input
            name='point'
            onChange={handleOnChange}
            className='text-sm border-[1px] border-gray-400 px-2 rounded-[8px] w-full h-[52px]'
          />
        </li> 
        <li className='py-2'>
          <p className='text-sm pb-2'><b>포인트 비밀번호<span className='text-[#EA035C]'>*</span></b></p>
          <input
            type='password'
            name='pointPassword'
            onChange={handleOnChange}
            className='text-sm border-[1px] border-gray-400 px-2 rounded-[8px] w-full h-[52px]'
          />
          <span className='text-xs text-gray-500'>포인트 비밀번호가 기억나지 않으세요?  </span>
        </li>
        </ul>
        <div className='my-3'>
          <p className='text-sm pb-2'><b>포인트 선물 메시지</b></p>
          <button
          type='button'
          name='use'
          className={
            usePointMessage ? "mr-2 w-5 h-5 rounded-full bg-black appearance-none border border-black cursor-pointer bg-[url('/assets/images/login/check.png')] bg-[length:12px_10px] bg-no-repeat bg-center":
            "mr-2 w-5 h-5 rounded-full appearance-none border border-black cursor-pointer"
          }
          onClick={handleOnClick}
          />
          <label htmlFor="giftMessageUse" className='text-[13px] mr-7'>사용</label>
          <button 
          type='button'
          name='notUse'
          className={
            !usePointMessage ? "mr-2 w-5 h-5 rounded-full bg-black appearance-none border border-black cursor-pointer bg-[url('/assets/images/login/check.png')] bg-[length:12px_10px] bg-no-repeat bg-center":
          "mr-2 w-5 h-5 rounded-full appearance-none border border-black cursor-pointer"}
          onClick={handleOnClick}
          />
          <label htmlFor="giftMessageNoUse" className='text-[13px]'>사용안함</label>
          {
            usePointMessage ? 
            <input 
            name="message"
            onChange={handleOnChange}
            className='px-2 mt-5 border-[1px] rounded-[8px] border-gray-500 w-full h-[200px]'
            /> 
            : ""
          }
          <button
          type='submit'
          onClick={handleOnFetch}
          className='w-full p-4 my-[24px] text-center text-black text-sm rounded-lg bg-ssg-linear'
          >
          선물하기</button>
        </div>
    </div>
  )
}

export default GiftPoint
