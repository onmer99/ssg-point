import React from 'react'

function GiftPointFooter() {
  return (
    <div className='px-5 my-5'>
      <ul className='leading-[22px] text-xs text-gray-500 w-full'>
        <li className='text-black text-sm py-3'>
          [유의사항]
        </li>
        <li className='text-red-500'>- 신세계포인트 본인인증을 완료한 회원에게만 선물하기가 가능합니다.
              (본인인증을 하지 않은 회원, 휴면회원,법인회원은 불가합니다.)
        </li>
        <li>
          - 주소록 서비스는 모바일앱에서만 사용하실 수 있어요.
        </li>
        <li>
          - ID당 1회 최대 10만 포인트,연간 200만 포인트까지 선물하실 수 있어요.
        </li>
        <li>
          - 포인트를 선물하시면 즉시 포인트가 차감되며 받으시는 분이 거절하거나
            15일 이내에 수락하지 않을 경우 차감된 포인트는 자동으로 반환됩니다.
        </li>
        <li>
          - 포인트 선물하기 시 포인트 비밀번호(숫자 4자리)입력이 필요합니다.
        </li>
        <li>
          - 포인트 선물하기 완료 후 선물을 취소할 수 없어요.
        </li>
        <li>
          - 신세계포인트 앱이 설치되어 있어야 선물을 수락할 수 있어요.
        </li>
      </ul>
    </div>
  )
}

export default GiftPointFooter
