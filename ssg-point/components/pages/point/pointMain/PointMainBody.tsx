'use client'
import { pointHistoryMenuList, pointHistoryMenuListType } from "@/data/pointHistoryMenuList";
import { timeFilter } from "@/data/timeFilter";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState} from "react";
import CreatePointComponent from "./CreatePointComponent";
import { pointDataType } from "@/types/pointDataType";

function PointMainBody() {

  const reqUrl ='https://workjo.duckdns.org'
  // const reqLocalUrl = "http://10.10.10.116:8000"
  const sessionData = useSession().data;
  const token = sessionData?.user.data.token;

  //날짜 설정 
  let nowDate = new Date();

  //useSession
  const [savePoint,setSavePoint] = useState<number>(0);
  const [usedPoint,setUsedPoint] = useState<number>(0);
  const [selectDate,setSelectDate] = useState<string>("1주일");
  const [emptyPointHistory,setEmptyPointHistory] = useState<boolean>(false);
  const [selectPointHistory,setSelectPointHistory] = useState<string>("1");
  const [pointList,setPointList] = useState<pointDataType[]>({} as pointDataType[]);
  
  const getDates = (date : Date) => {
    
    let Dates = ""
    let year = date.getFullYear()
    let month = ""
    let day = ""
    
    console.log(date)

    if( date.getMonth() < 10 ) {
      month = "-0" + (date.getMonth() + 1)
    }else{
      month = "-" + (date.getMonth() + 1)
    }
    if( date.getDate() < 10 ){
      day = "-0" + date.getDate();
    }else{
      day = "-" + date.getDate();
    }
    Dates = year + month + day
    console.log(Dates)
    return Dates;
  }
  
  const handleOnSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  
    setSelectDate(e.target.value)

    // let res = fetch(reqUrl + '/api/v1/point/history',{
    //   method:"POST",
    //   headers:{
    //     'Content-type':'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({
    //     "historyStartDate": getStartDate(),
    //     "historyEndDate": getDates(nowDate),
    //     "pointTypesToSearch": pointListType?.pointType
    //   })
    // })
  }

  const getStartDate = () => {

    let dates;
    
    let startDate = new Date();
    
    switch(selectDate){
      case '1주일':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '1개월':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case '3개월':
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case '6개월':
        startDate.setMonth(startDate.getMonth() - 6)
    }

    console.log(startDate)
    dates = getDates(startDate)

    return dates
}
async function pointDataFetch() {
      
  let pointListType = pointHistoryMenuList.find((item) => item.id === selectPointHistory )

  const req = {
    method:"POST",
    headers:{
      'Content-type':'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      "historyStartDate": getStartDate(),
      "historyEndDate": getDates(nowDate),
      "pointTypesToSearch": pointListType?.pointType
    })    
  }


  let res = await fetch(reqUrl + '/api/v1/point/history', req)

    console.log(req)
    console.log( pointListType?.pointType)

    if (res.ok) {

      const data = await res.json();

      const pointDataList = data.data.pointList;
      console.log(pointDataList)

      if(pointDataList.length === 0) {

        console.log("length = ")
        console.log(pointDataList.length)
        setEmptyPointHistory(false)
        return
      }
      setEmptyPointHistory(true)
      setPointList(pointDataList);

    } else {
      console.error('HTTP 오류 발생:', res.status);
    }
  }

  function handleOnChange(e: any) {

    setSelectPointHistory(e.target.id);
    pointDataFetch()
    console.log(`id ${e.target.id}`)
    
  }
  useEffect(() => 
  {
    pointDataFetch()
  },[selectPointHistory,selectDate])
    return (
      <>
        <div>
        {/* <p>{myDate.toLocaleDateString('ko-KR', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'})}</p> */}

        <ul className="flex mb-2 w-full border-b-[1px]">
          {
            pointHistoryMenuList.map((item:pointHistoryMenuListType) => (
              <li 
                key={item.id}
                id={item.id}
                onClick={handleOnChange}
                className={
                  selectPointHistory === item.id ? 'border-b-[3px] border-[#EA035C] pb-5 text-sm w-1/4 flex justify-center' :'text-sm w-1/4 pb-6 flex justify-center'
                }
              >
                {item.name}
              </li>
            ))
          }
          </ul>
          <div className="px-5 py-3">
            <select
              name="searchRangeTime"
              className="w-1/4 text-xs"
              onChange={handleOnSelect}
              >
              {
                timeFilter.map(item => (    
                  <option
                    key={item.id}
                    value={item.name}
                    >
                      {item.name}
                    </option>
                    ))
                  }
              </select> 
            </div>
              <div className="w-full mt-2 pt-1 h-6 bg-gray-100">
                <div className="mx-2 h-4 flex">
                  <Image
                    alt="포인트 플러스 아이콘"
                    src="/assets/images/point/pointPlusIcon.png"
                    height={2}
                    width={16}
                    />
                      <p className="ml-3 mr-8 text-[#EA035C] text-xs"><b>적립 {savePoint}P</b></p>
                  <Image
                    alt="포인트 마이너스 아이콘"
                    src="/assets/images/point/pointMinusIcon.png"
                    height={2}
                    width={16}
                    />
                  <p className="mx-2 text-xs">사용 {usedPoint}P</p>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              
              { 
                emptyPointHistory ? 
                <div className="w-full flex justify-center h-full">
                  <CreatePointComponent
                    id={selectPointHistory}
                    data={pointList}
                  />
                </div>

                :
                <div className="w-full h-[350px] relative">
                  <div className="h-[60px] w-[60px] absolute top-[50%] left-[50%]" style={{transform: "translate(-50%, -50%)"}}>
                    <Image
                      alt="빈 내역창 아이콘"
                      height={100}
                      width={100}
                      src="/assets/images/point/noPointIcon.png"/>
                </div>
                </div>
              }
          </div>
        </div>
      </>
    );
  }

export default PointMainBody;