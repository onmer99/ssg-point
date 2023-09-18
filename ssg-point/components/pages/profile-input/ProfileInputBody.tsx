'use client'
import React, {useState, useEffect,useContext } from "react";
import { useRouter } from "next/navigation";
import { SignupInputProfileList } from "@/data/SignupInputProfileList";
import { userProfileInputFormType } from "@/types/userProfileInputFormType";
import { profileInputErrTextType } from "@/types/profileInputErrTextType";
import { DaumAddressType } from "@/types/DaumAddressType";
import DaumPostCodeModal from "../auth/modal/DaumPostCodeModal";
import { wayMarketingList } from "@/data/wayMarketingList";
import { UserContext } from "@/context/UserContext";


function ProfileInputBody() {

interface existByIdMessageType {
  state:boolean,
  message:string
}
  const [existByIdMessage,setExistByIdMessage] = useState<existByIdMessageType>({
    state:false,
    message:"",
  })


  const router = useRouter();
  const user = useContext(UserContext);

  const reqUrl = 'https://workjo.duckdns.org/api/v1'

  const [isView, setIsView] = useState<boolean>(false);

  const [address,setAddress] = useState<DaumAddressType>();
  const handleOpenModal = () =>{

    setIsView(true);

  }

  useEffect(() => {
    if(address){
        // setIsView(false);
        console.log(address)
    }
}, [address])

  async function existById (e : React.MouseEvent<HTMLButtonElement>) {
    
    user.loginId = userProfile.loginId

    let res = await fetch(reqUrl + '/user/id-check',{
      method:"POST",
      headers:{
        'Content-type':"application/json"
      },
      body:JSON.stringify({
        loginId:user.loginId
      })
    })

    const data = res.json();
    if(!res.ok){
      console.log(data)
      setExistByIdMessage({
        message:"이미 존재하는 ID입니다.",
        state:false
      })
      return
    }
    else{
      console.log(data)
      setExistByIdMessage({
        message:"사용가능한 ID입니다.",
        state:true
      })
      return
    }
  }
  const [userProfile,setUserProfile] = useState<userProfileInputFormType>({
    loginId:"",
    password:"",
    checkPassword:"",
    userName:user.userName,
    phone:user.phone,
    detailAddress:""
  })
  const [profileErrText,setProfileErrText] = useState<profileInputErrTextType>({
    loginId:"",
    password:"",
    checkPassword:"",
    detailAddress:"",
  })
  const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {

    const {name,value} = e.target;

    setUserProfile({
      ...userProfile,
      [name]:value.toString()
    })

  }

  const handleOnFecth = (e : React.MouseEvent<HTMLButtonElement>) => {

    let errText:profileInputErrTextType = {
      loginId:"",
      password:"",
      checkPassword:"",
      detailAddress:""
    }

    console.log(userProfile)

    if(userProfile.loginId === "" || userProfile.loginId.length > 20 || userProfile.loginId.length < 6 ){
      errText.loginId = "아이디를 6자 이상 20자 이하로 입력해주세요."
    } 
    if(6 > userProfile.password.length || 20 < userProfile.password.length){
      errText.password = "비밀번호는 8자 이상 20자 이하로 입력해주세요."
    }
    if(userProfile.password !== userProfile.checkPassword){
      errText.checkPassword = "비밀번호가 서로 다릅니다."
    }
    // if(userProfile.detailAddress === "") errText.detailAddress = "상세 주소를 입력해주세요."
    if(errText.loginId !== "" || errText.password !== "" || errText.checkPassword !== "" ||
    errText.detailAddress !== "" || !existByIdMessage.state){

      console.log(errText)
      setProfileErrText(errText);
      
      return
    }
    console.log(userProfile)
    fetchingProfile();
  }

  async function fetchingProfile() {

    let res = await fetch(reqUrl + '/auth/signup',{
      method:"POST",
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({
        loginId:userProfile.loginId,
        password:userProfile.password,
        name:userProfile.userName,
        phone:userProfile.phone,
        address:address?.address
      })
    })
    if(res.ok) {
      const data = res.json();
      console.log(data)
      console.log(address?.address)
      router.push('./complete')
    }

    return
  }

  return (  
    <>
      <form className="block px-5 mt-10">
        <p className="text-[14px] pb-2">아이디<span className="text-red-500">*</span></p>
        <div className="flex">
          <input
            className="h-[48px] border w-3/4 rounded-[6px] border-gray-400 text-sm"
            type="text"
            placeholder="  영문,숫자 6~20자리 입력해주세요."
            name="loginId"
            onChange={handleOnChange}
          />          
          <button 
            className="h-[px] w-1/4 border rounded-[6px] ml-3 border-gray-400 text-[15px]"
            type="button"
            onClick={existById}
            >
            중복확인
          </button>
          </div>
          <p className=
            {
              existByIdMessage.state ? 'my-1 text-gray-400 text-xs' : 'my-1 text-red-500 text-xs'
            }
          >
            {existByIdMessage.message}
          </p>
          <p className='text-red-500 text-xs'>{profileErrText.loginId}</p>
        <div className="flex-col">
          {
            SignupInputProfileList.map( item => (
            <div className="flex-col">
              {/* { item.id === 1 || 2 ? () => setPwType(true)  : null} */}
            <p 
              className="text-[14px] my-3"
              key={item.id}
              >{item.title}
              <span className="text-red-500">*</span></p>
              <input
                className="h-[48px] border w-full rounded-[6px] border-gray-400 text-sm"
                type= "password"
                placeholder= {item.placeholder}
                key={item.id}
                name={item.name}
                onChange={handleOnChange}
                //이름과 휴대폰 번호는 휴대폰 인증에서 데이터 받아와서 미리 표시해두고 싶지만
                //시간부족으로 차후 구현예정입니다.
                />
                {/* <p className='text-red-500 text-xs'>{profileErrText.}</p> */}
            </div>
            ))
          }
          <div>
              {/* { item.id === 1 || 2 ? () => setPwType(true)  : null} */}
            <p 
              className="text-[14px] my-3"
              >이름
              <span className="text-red-500">*</span></p>
              <input
                className="h-[48px] border w-full rounded-[6px] border-gray-400 text-sm"
                onChange={handleOnChange}
                //이름과 휴대폰 번호는 휴대폰 인증에서 데이터 받아와서 미리 표시해두고 싶지만
                //시간부족으로 차후 구현예정입니다.
                value={user.userName}
                />
            <p 
              className="text-[14px] my-3"
              >휴대폰 번호
              <span className="text-red-500">*</span></p>
              <input
                className="h-[48px] border w-full rounded-[6px] border-gray-400 text-sm"
                onChange={handleOnChange}
                value={user.phone}
                //이름과 휴대폰 번호는 휴대폰 인증에서 데이터 받아와서 미리 표시해두고 싶지만
                //시간부족으로 차후 구현예정입니다.
                />
            </div>
        <p className="text-[14px] my-3">자택주소<span className="text-red-500">*</span></p>
        <div className="flex mb-2">
          <DaumPostCodeModal 
            isView={isView}
            setAddress={setAddress} />
          <input
            className="h-[48px] border w-3/4 rounded-[6px] border-gray-400 text-sm"
            type="text"
            placeholder="  우편번호"
            name="zoneCode"
            onChange={handleOnChange}
            value={address?.zonecode}
          />
          <p
            className="w-1/4 border text-center rounded-[6px] ml-3 border-gray-400 text-[14px]"
            onClick={handleOpenModal}
            >
            {/* form태그안 button은 default가 submit이고 누를시 새로고침된다.
            방지하려면 button의 type을 button으로 주면된다. */}
            우편번호<br/> 찾기
          </p>
        </div>
        <div className="flex-col">
          <input
            className="h-[48px] border w-full mb-2 rounded-[6px] border-gray-400 text-sm"
            type="text"
            name="city"
            onChange={handleOnChange}
            value={address?.address}
            />
            <p className='text-red-500 text-xs'></p>
            <input
            className="h-[48px] border w-full mb-2 rounded-[6px] border-gray-400 text-sm"
            type="text"
            placeholder="  상세주소"
            name="detailAddress"
            onChange={handleOnChange}
            />
            <p className='text-red-500 text-xs'>{profileErrText.detailAddress}</p>
        </div>
        <ul className="flex-col">
        <li className="flex text-[12px] my-5">
          <input 
            name="agreeMarketingReceive-1"
            type="checkbox"
            className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
            />
          <label 
            htmlFor="agreeMarketingReceive"
            className="pl-2"
            >
            <p>
              [선택] 혜택제공 및 분석을 위한 개인정보 수집 및 이용동의
            </p>
          </label>
        </li>
        <li className="flex text-[12px] my-5">
          <input 
            name="agreeMarketingReceive-2"
            type="checkbox"
            className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
            />
          <label 
            htmlFor="agreeMarketingReceive"
            className="pl-2"
          >
            <p>
              [선택] 이마트/신세계 공동 개인정보 수집 및 이용동의
            </p>
          </label>
        </li>
      </ul>
      <div className="border-l-2 border-gray-400">
      <p className="text-[15px] pl-5 pt-5">신세계포인트 광고정보 수신동의</p>
      <ul className="w-80 first:flex-col flex justify-between pl-5 relative">
        <li className="flex absolute pt-5">
          <input 
            type="checkbox"
            name="allAgree"
            className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
            />
            <label  
              className="pl-2 text-[14px]"             
              htmlFor="allAgree"
            >
              <p>
                전체 동의
              </p>
            </label>  
        </li>       
      {
        wayMarketingList.map(item => (
          <li className="flex pt-16 pb-5">
            <input 
              type="checkbox"
              name={item.name}
              key={item.id}
              className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
              />
              <label className="pl-2 text-[12px]" htmlFor={item.name}>
            <p>
              {item.name}
            </p>
          </label>
          </li>
        ))
      }
        </ul>
      </div>
      <div className="mt-5 mb-10  border-t-[1px] border-gray-200">
        <p className="pt-5 text-[15px]">앱 푸쉬 광고 알람</p>
        <li className="flex mt-5">
          <input
            type="checkbox"
            name="pushAlarm"
            className="box-content w-5 h-5 rounded-full checked:bg-black appearance-none border border-black cursor-pointer checked:bg-[url('/assets/images/login/check.png')] checked:bg-[length:12px_10px] checked:bg-no-repeat checked:bg-center"
          />
          <label htmlFor="pushAlarm">
            <p className="text-[14px] pl-2">APP PUSH</p>
          </label>
        </li>
      </div>
      <span className="text-xs text-gray-500">
        당사,관계사,신세계포인트 제휴사가 제공하는 상품 및 서비스 홍보, 소식지<br/>
        제공,이벤트 정보 제공(할인 쿠폰,포인트 추가 적립,상품 할인 포함),<br/>
        제휴행사를 안내해 드립니다.수신동의 변경은 신세계포인트 고객센터 및<br/>
        홈페이지(www.shinsegaepoint.com)에서 가능합니다.<br/>
        ※ 서비스 주요 정책 및 공지사항 안내 등은 수신동의 여부와 관계없이<br/>
        발송됩니다.
      </span>
      <button
        className="w-full"
        type='button'
        onClick={handleOnFecth}
        >
        <p className='p-4 my-[50px] text-center text-black text-sm rounded-lg bg-ssg-linear'>
          확인
        </p>
      </button>
      </div>
    </form>
    </>
  );
}

export default ProfileInputBody;