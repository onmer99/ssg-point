'use client'
import React, { useContext, useEffect, useState } from 'react'
import { newsAgencyList } from '@/data/newsAgencyList';
import { authenticatedNeedDataType } from '@/types/authenticatedNeedDataType';
import { signUpErrorTypeData } from '@/types/signUpErrorTypeData';
import { genderTypeList } from '@/data/genderTypeList';
import { localForeignerList } from '@/data/localForeignerList';
import AuthBehindTap from './AuthBehindTap';
import CheckStatus from './CheckStatus';
import { signUpAgreeList, signUpAgreeListType } from '@/data/signUpAgreeConditionsList';
import { UserContext } from '@/context/UserContext';


function PhoneAuthBody( props:{pathName: string} ) {

    const user = useContext(UserContext);
    const path = props.pathName;
    const reqUrl = "https://workjo.duckdns.org"

    // const reqUrl = "http://10.10.10.103:8000"

    const [authPhoneNumber,setAuthPhoneNumber] = useState<string>("");;

    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

    const handleAllChecked = () => {
      
      const newAgreeList = [...agreeDataList];
      
      newAgreeList.map((item) => {
      
        item.check = !isAllChecked;
      
        })
      
      setAgreedataList(newAgreeList);

      setIsAllChecked(!isAllChecked);
  }


    const [agreeDataList,setAgreedataList] = useState<signUpAgreeListType[]>(signUpAgreeList);

    const handleChecked = (id:number, isCheck:boolean) => {

      const newAgreeList = [...agreeDataList];

      newAgreeList.map((item) => {
      
        if(item.id === id){
      
          item.check = isCheck;
      
        }
      })

      setAgreedataList(newAgreeList);
  }
    const [isClick,setIsClick] = useState<boolean>(false);

    // const certReq = () => {
    //   const RandomNumber:number = Math.floor(Math.random() * 100000);
      
    //   const num = SmsAuthApi()
    //   // fetch 

    //   // RandomNumber과 인풋 비교

    // }
    // 본인인증 API <- 백엔드와 상의 후 진행예정

    const [reqCertNumber,setReqCertNumber] = useState<boolean>(false);

    const [signUpListData,setSignUpListData] = useState<authenticatedNeedDataType>({
      loginId:'',
      name: '',
      gender: '남자',
      foreigner: '내국인',
      birthday:'',
      agency: 'SKT',
      phone: '',
      allAgree:false,
      agree:0
    });
    
    const [errorText,setErrorText] = useState<signUpErrorTypeData>({
      name: '',
      birthday:'',
      phone: '',
      agree:'',
      reqInfo:''
    });

    const handleOnChange = (e : React.ChangeEvent<HTMLInputElement>) => {

      e.preventDefault();
      
      const {name,value} = e.target;

      console.log(name, value)

        setSignUpListData({
          ...signUpListData,
          [name]:value
          }
        )
      }
    const handleOnSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
      
      e.preventDefault();
      
      const {name,value} = e.target;
      console.log(e.target)

      setSignUpListData({
        ...signUpListData,
        [name]:value
      })
      console.log(signUpListData)
    }

    const handleSignUpFetch = async (e: React.MouseEvent<HTMLButtonElement>) => {

      e.preventDefault();

      let errText: signUpErrorTypeData = {
        name:'',
        birthday:'',
        phone: '',
        agree:'',
        reqInfo:''
      }

      if(signUpListData.name === '' || signUpListData.name === undefined) errText.name = "이름을 입력해주세요."
      if(signUpListData.birthday === '' || signUpListData.birthday === undefined) errText.birthday = "생년월일을 입력해주세요."
      if(signUpListData.birthday.length !== 8) errText.birthday = "생년월일을 다시 입력해주세요."
      if(signUpListData.phone === '' || signUpListData.phone === undefined) errText.phone = "전화번호를 입력해주세요"
      if(signUpListData.phone.length !== 11) errText.phone = "전화번호를 다시 입력해주세요."
      if(!isAllChecked) errText.agree = "필수약관을 동의해주세요."
      if(errText.name !== '' || errText.birthday !== '' || errText.phone !== ''||errText.agree !== '' || errText.agree !== '')
      {
        //약관동의 체크 안되어있다가 전부다 체크하면 인증번호 요청 컴포넌트 호출되어야하는데
        //안됨 이 부분은 차후 수정예정
        //↑추가 완료  
          console.log(errText)
          setErrorText(errText);
            
          return  

      }
      
            user.userName = signUpListData.name;
            user.phone = signUpListData.phone;
            user.birthDay = signUpListData.birthday;
            user.loginId = signUpListData.loginId;

            setIsClick(true);

            let res = await fetch(reqUrl + "/api/v1/cert/phone", {
              method:"POST",
              headers:{
                'Content-type':'application/json'
              },
              body: JSON.stringify({
                phone: signUpListData.phone
              })
            })

            console.log(res.body)
            if(res.status === 200){

              errText.reqInfo=""
              setAuthPhoneNumber(signUpListData.phone)
              setReqCertNumber(true)
              
              return 
            }
            
            errText.reqInfo="입력하신 정보를 다시 확인해주세요."
            

            return 

      
    }

    useEffect(() => {
      if(reqCertNumber){
        console.log(reqCertNumber)
      }
    },[reqCertNumber])
  return (
    <>
      <form className='pt-4'>
          <div className='text-[13px]'>
            <p className='pt-10 pb-2'>
              <b>이름을 입력해주세요.</b>
            </p>
            
              <input
                type='text'
                name='name'
                className='w-full h-[48px] border divide-[#e5e7eb] rounded-[6px] text-sm'
                placeholder='  이름입력'
                onChange={handleOnChange}
              />
              <p className='text-red-500 text-xs'>{errorText.name}</p>  
            <p className='pt-[12px] pb-1'>
              <b>성별을 선택해주세요.</b>
            </p>
            <div className='flex'>
            {
              genderTypeList.map( item => (
                  
                  <div 
                      className={signUpListData.gender === item.gender ? `flex justify-center items-center w-1/2 h-[60px] bg-[#000000] rounded-[6px] text-[white] text-base` : `flex justify-center items-center w-1/2 h-[60px] bg-[#F5F5F5] rounded-[6px] text-base`}
                      key={item.id}
                      onClick = { () => setSignUpListData ({
                  ...signUpListData,
                  gender: item.gender
                })
                  }>
                  {item.gender}
                  </div>
              ))
            }
            </div>
            <p className='pt-[12px] pb-1'>
              <b>외국인 이신가요?</b>
            </p>
            <div className='flex'>
              {
              localForeignerList.map( (item , idx)=> (
                  
                  <div className={signUpListData.foreigner === item.type ? `flex justify-center items-center w-1/2 h-[60px] bg-[#000000] rounded-[6px] text-[white] text-base` : `flex justify-center items-center w-1/2 h-[60px] bg-[#F5F5F5] rounded-[6px] text-base`}
                  key={idx}   
                  onClick = { () => setSignUpListData ({
                  ...signUpListData,
                  foreigner: item.type
                })
                  }>
                  {item.type}
                  </div>
              ))
            }
            </div>
              <p className='pt-[12px] pb-1'>
                <b>생년월일을 입력해주세요.(예:19990101)</b>
              </p>
              <input 
                type='text' 
                className='h-[48px] border w-full rounded-[6px] divide-[#e5e7eb] text-sm'
                placeholder='  법정생년월일 8자리'
                name="birthday"
                onChange={handleOnChange}
                />
                <p className='text-red-500 text-xs'>{errorText.birthday}</p>
              <p className='pt-[12px] pb-1'>
                <b>본인명의의 휴대전화번호를 입력해주세요.</b>
              </p>
              <select 
                name="agency"
                className='h-[48px] mb-2 border w-full rounded-[6px] divide-[#e5e7eb] pr-2'
                onChange={handleOnSelect}
              >
              {
                    newsAgencyList.map( item => (
                  
                    <option
                      key={item.id}
                      value={item.name}
                      // onChange={handleOnOption}  
                    >
                      {item.name}
                    </option>
                  ))
              }   
              </select>
              <input 
                type='text'
                className='h-[48px] border w-full rounded-[6px] divide-[#e5e7eb] text-sm'
                placeholder='  -없이 휴대폰 번호 입력'
                name="phone"
                onChange={handleOnChange}
                />
                <p className='text-red-500 text-xs'>{errorText.phone}</p>
            </div>
            <div className='text-sm border-b-[1px] divide-[#e5e7eb] mt-14 pb-2'>
            <p><b>휴대전화 인증 약관</b></p>
            <CheckStatus
                  checkId={0}
                  label={"모든 약관에 동의합니다."}
                  name={"전체 동의"}
                  checked={agreeDataList.every((item) => item.check)}
                  handler={handleAllChecked}
                  size={20}
                />
            </div>
            <div className='text-xs'>
              {
                signUpAgreeList.map( (item:signUpAgreeListType) => {
                  return(
                    <CheckStatus
                      key={item.id}  
                      checkId={item.id}
                      label={item.title}
                      name={item.title}
                      checked={item.check}
                      handler={handleChecked}
                      size={20}
                    />
                  ) 
                })
              }
            </div>
              <p className='text-red-500 text-xs'>{errorText.agree}</p>
              <button
                className="w-full"
                onClick={handleSignUpFetch}
                type='submit'
              >
                { reqCertNumber === true && isClick === true ? null : <AuthDefaultTap/> } 
              </button>

                { reqCertNumber === true && isClick === true ? 
                <AuthBehindTap 
                authNumber={authPhoneNumber}
                pathName={path}
                /> : null } 

              <p className='text-red-500 text-xs'>{errorText.reqInfo}</p>
            </form>
          </>
  )
}
export default PhoneAuthBody;

const AuthDefaultTap = () => {
  return (  
    <>
      <p className= 'p-4 my-[24px] text-center text-black text-sm rounded-lg bg-ssg-linear'>
        인증번호 요청
      </p>
    </>
  );
}