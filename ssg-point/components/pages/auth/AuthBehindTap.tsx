'use client'
import { useRouter } from "next/navigation";
import React, { useState, SetStateAction } from "react";

  const AuthBehindTap = ( props : { authNumber:string }) => {

    const router = useRouter();

    const [certNumber,setCertNumber] = useState<string>("");
    
    const [errText,setErrText] = useState<string>("");

    async function sameReqNumHandler() {
    
      let res2 = await fetch('http://workjo.duckdns.org/api/v1/cert/phone/confirm',{
        method:"POST",
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          phone:props.authNumber,
          certCode:certNumber
        })
      })
    //props로 전달받은 전화번호& 입력받은 인증번호를 body에 담아서 요청
    console.log(res2)

    setErrText("인증번호를 다시 입력해주세요")
    router.push('./conditions')
  }
  const matchReqNum = (e : React.ChangeEvent<HTMLInputElement>) => {

  setCertNumber(e.target.value);      
  //입력받은 인증번호 상태저장
  }

  return (
    <div className="my-12">
      <p className="text-xs mb-1">
        <b>인증번호</b>
      </p>
        <input
          type="text"
          name="certNumber"
          placeholder=" 인증번호 입력"
          className="text-sm w-full h-[48px] border rounded-[6px] divide-[#e5e7eb]"
          onChange={matchReqNum}
          />
        <p className='text-red-500 text-xs'>{errText}</p>
        <button 
          className="w-full p-4 mt-4 text-center text-sm text-black rounded-lg bg-ssg-linear"
          type="button"
          onClick={sameReqNumHandler}
          >
          <p>
            확인
          </p>
        </button>
    </div>  
    
  );
}

export default AuthBehindTap;

