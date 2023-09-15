'use client'
import Link from 'next/link'
import React, { useEffect, useState,useContext } from 'react'
import HeaderUserStatus from './HeaderUserStatus'
import SideMenu from '../widget/SideMenu'
import Logo from '../ui/header/Logo'
import { usePathname } from 'next/navigation'
import { pageTitle } from '@/data/pageTitle'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Swal from 'sweetalert2'
import { signOut, useSession } from 'next-auth/react'
import CustomBarcode from '../ui/CustomBarcode'


function HeaderTop() {
  const [isOpened, setIsOpened] = useState<Boolean>(false)
  const [title, setTitle] = useState<String>('')
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  console.log(session)

  const handleSideMenu = () => {
    setIsOpened(!isOpened)
    console.log(isOpened)
  }

  const handleLogout = () => {
    Swal.fire({
      text: "로그아웃 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니요",
      customClass: {
        confirmButton: 'mySwalConfirmButton',
        cancelButton: 'mySwalCancelButton',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(
          {callbackUrl: 'http://localhost:3000/'}
        )
      }
    })
  }

  useEffect(() => {
    const PathName = pathname.split('/').length
    console.log(pathname.split('/'))
    
    const getTitle = () => {
      const result = pageTitle.find((item) => item.path === pathname.split('/')[PathName -1] )?.title

      if(result === undefined) return setTitle('신세계 포인트')
      setTitle(result)
    }
    getTitle()
    if (isOpened) {
      setIsOpened(!isOpened)
    }
  },[pathname])

  return (
    <>
    <SideMenu isOpened={isOpened} setIsOpened={setIsOpened}/>
    <div className='header_top w-full pr-5 box-border relative [z-index:2] flex justify-between items-center'>
    <nav className={pathname==='/' ? 'flex relative justify-center items-center ml-5 mt-3' : 'flex relative justify-center items-center'}>
      <ul>
      { pathname === '/' ? null :
      <button
      className='w-[48px] h-[56px] left-0 top-0 indent-[-999em] bg-[url(/assets/images/etc/back.png)] bg-no-repeat bg-[50%] [background-size:8px]'
      onClick={() => router.back()}
      >
      </button>
      }
      </ul>
      <ul>
      { pathname === '/' ? <Logo url={'/'} imgAlt={'신세계포인트 로고'}/> 
      : <HeaderUserStatus title={title}/>}
      </ul>
    </nav>
      <nav className='header_menu'>
        <ul className='flex relative gap-4 justify-center items-center'>
          <li className='text-sm font-medium flex items-center whitespace-nowrap' >
            {session.data?.user.data?.uuid !== undefined?
                <>
                <CustomBarcode value={session.data?.user.data?.uuid} options={{ width: 0.1, height: 10, displayValue:false}}/>
                <p className='inline-block text-xs' onClick={handleLogout}>
                </p>
                
                <span className='inline-block'>
                  <Image src="/assets/images/etc/point.png" alt="포인트" height={15} width={15}/>
                </span>
                </>
              : <Link href='/login'>로그인</Link> }
            </li>
          <li onClick={handleSideMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 5H20" stroke="#121212" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 12L20 12" stroke="#121212" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 19H20" stroke="#121212" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </li>
        </ul>
      </nav>
    </div>
  </>
  )
}

export default HeaderTop