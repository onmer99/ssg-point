import React from "react";
import Image from "next/image";
import { PhoneCardBoxType } from "@/types/PhoneCardBoxType";

const AuthHeaderBottom = ( props: {
    typeList: PhoneCardBoxType[];
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => {

const {typeList, selected, setSelected } = props;

const handleClick = (e : any) => {
  setSelected(e.target.id);
  console.log(selected);
};
  
  return(
    <>
        <div className='mt-10 flex'>
          
            {
              typeList.map( item => (
                  <div className={
                    selected === item.id ? "p-[3px] flex justify-center items-center w-3/6 h-[88px] bg-ssg-linear rounded-[8px]":
                    "p-[1px] flex justify-center items-center w-3/6 h-[88px] border-[2px] divide-[#e5e7eb] rounded-[8px]"
                    }
                    onClick={(e) => handleClick(e)}
                  >
                    <a role="tab" className="w-full">
                      <button className='block relative my-[2px] w-full h-[83px] bg-white rounded-[6px]'
                            key={item.id}
                            id={item.id}
                            onClick={(e) => handleClick(e)}
                        >
                          <div className="h-[30px] w-[40px] absolute top-[35%] left-[45%]"
                            style={{transform: "translate(-50%, -50%)"}}
                          >
                            <Image className="ml-[7px]"
                            key={item.id}
                            src={item.url}
                            alt={item.title}
                            id={item.id}
                            onClick={(e) => handleClick(e)}
                            height={50}
                            width={100}
                            />
                            <b className="whitespace-nowrap">
                            <span className='text-[13px]'>{item.title}</span>
                            </b>
                          </div>
                      </button>
                    </a>
                  </div>  
              ))
            }
      </div>
    </>
  )
};


export default AuthHeaderBottom;