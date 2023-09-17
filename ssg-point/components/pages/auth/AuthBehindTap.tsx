'use client'

import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useState, useContext } from "react";

const AuthBehindTap = ( props : { authNumber:string,pathName:string }) => {

    const user = useContext(UserContext);
    
    const router = useRouter();
    const pathName = props.pathName;

    const [certNumber,setCertNumber] = useState<string>("");
    
    const [errText,setErrText] = useState<string>("");

    const reqUrl = 'https://workjo.duckdns.org'
    const reqLocalUrl = 'http://10.10.10.103:8000'
    async function sameReqNumHandler() {
    
      let res2 = await fetch(reqUrl + '/api/v1/cert/phone/confirm',{
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

    if(res2.status !== 200){

      setErrText("인증번호를 다시 입력해주세요")

      return
    }
    if(pathName === "signUpAuth"){
      router.push('./conditions')
    }
    if(pathName === "findPointPwd"){
      router.push('./point-pwd-chg/new-point-pwd')
    }
    
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

