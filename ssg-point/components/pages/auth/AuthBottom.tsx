import React from "react";

function AuthBottom() {
  return (  
    <>
    <div className="bg-[#FBFBFB] flex justify-center pt-8 pb-10">
      <p className="text-xs text-gray-500 leading-loose">
        <p className="text-sm pb-3">[유의사항]</p>
        - 본인명의의 인증 수단 정보를 정확히 입력해 주세요.<br/>
        - 법인명의 휴대전화(법인폰)는 통신사에서 본인인증 서비스 신청 후<br/>
          휴대폰 인증을 하실 수 있습니다.<br/>
        - 개명하신 회원님의 경우 통신사 등에 등록된 본인인증 정보가 개명<br/>  
          하신 이름으로 바뀐 이후부터 자동으로 변경됩니다.<br/>
        - 인증 오류 시 코리아크레딧뷰로 고객센터 02-708-1000에 문의해주세요.
      </p>
    </div>
    </>
  );
}

export default AuthBottom;