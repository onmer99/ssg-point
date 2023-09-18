import Image from "next/image";
import React from "react";

function AuthHeaderTop() {

  const iconUrl : string = "/assets/images/signupIcon/";
  
  return (
    <>
      <div className="pb-5 pt-9 flex w-110">
        <Image src={iconUrl + "checkIcon.png"} alt="" width={20} height={20} className="mr-2"/>
        <Image src={iconUrl + "nonCheckicon.png"} alt="" width={20} height={20} className="mr-2"/>
        <Image src={iconUrl + "nonCheckicon.png"} alt="" width={20} height={20} className="mr-2"/>
        <Image src={iconUrl + "nonCheckicon.png"} alt="" width={20} height={20}/>
      </div>
      <div>
        <p className="text-2xl pb-1">
          본인인증
        </p>
      </div>

      <div>
        <b>
          <span className="text-[13px] text-[#767673]">
            본인인증 수단을 선택해주세요.
          </span>
        </b>
      </div>
    </>
    );
}

export default AuthHeaderTop;