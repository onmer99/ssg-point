"use client";
import React, { useContext, useState } from "react";
import styles from "./SideMenu.module.css";
import Logo from "../ui/header/Logo";
import Link from "next/link";
import Image from "next/image";
import {
  MenuListType,
  favList,
  loginMenuList,
  menuList,
} from "@/data/SideMenuData";
import { signOut, useSession } from "next-auth/react";

const favUrl =
  "https://mycloudmembership-prd.s3.amazonaws.com/shinsegaepoint/public/shinsegaepoint-ext/images/menu-images-renewal/menu_big_";

function SideMenu(props: {
  isOpened: Boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
  const session = useSession();
  console.log(session.data)
  const { isOpened, setIsOpened } = props;

  /** 참고: Back에서 받아오는 나의 즐겨찾기 목록 state */ 
  // const [myFav, setMyFav] = useState<>()
  return (
    <>
    
      <div
        className={
          isOpened
            ? `${styles.sidemenuwrap} ${styles.open}`
            : `${styles.sidemenuwrap}`
        }
      >
        <div className="side_header pt-5 pl-5">
          <Logo
            url={"/"}
            imgUrl={"/assets/images/logo/logo_header.gif"}
            imgAlt={"신세계포인트 로고"}
          ></Logo>
        </div>
        {/* 로그인 박스 */}
        <div className={styles.login_signup}>
          { session.data?.user.data?.uuid !== undefined? (
            <>
              <div>
                <p className="text-[18px] leading-[26px] inline">
                  <strong
                    className="relative inline font-extrabold 
                after:bg-[#ffdfb5] after:absolute
                after:w-[100%] after:inline-block after:h-[15px] after:z-[-1] after:left-0 after:bottom-0"
                  >
                    {/* {user.name} 참고 : 나중에 session에서 유저정보 불러오면 이름 표시 */}
                    {session.data?.user.data?.name}
                  </strong> 님 반갑습니다.
                </p>
              </div>
              <p className="flex itmes-center mt-[16px] text-[20px] font-bold leading-6">
                {/* {user.point} 참고 : 유저의 포인트 정보 불러온 후 표시 */}
                {/* {point.totalPoint} */}
                <Image
                  alt="point"
                  src={
                    "https://m.shinsegaepoint.com/img/point_gradi.d5d9bfaf.png"
                  }
                  width={27}
                  height={24}
                  style={{ display: "inline-block", marginLeft: "7px" }}
                >
                </Image>
              </p>
            </>
          ) : (
            <div>
              <p className={styles.login_txt}>로그인해 주세요</p>
            </div>
          )}

          <div className={styles.btn_box}>
            {session.data?.user.data?.uuid !== undefined? (
              <div className="flex w-full relative">
                <button className={styles.btn_outbox} onClick={()=>signOut({
                  callbackUrl: 'http://localhost:3000/'
                })}>
                  로그아웃
                </button>
                <Link className={styles.btn_mybox} href={"/mypage"}>
                  마이페이지
                </Link>
              </div>
            ) : (
              <>
                <Link className={styles.btn_primary} href={"/login"}>
                  로그인
                </Link>
                <Link className={styles.btn_sub} href={"/signup"}>
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 즐겨찾기 메뉴 리스트 */}
        <FavList favList={favList}></FavList>
            
        {/* 로그인 시 마이 포인트, 마이 라운지 등의 바로가기 메뉴 */}
        {session.data?.user.data?.uuid !== undefined? <MyPage></MyPage> : null}

        {/* 바로가기 메뉴 박스 */}
        <MenuBox menuList={menuList}></MenuBox>
        
        {/* 사이드메뉴 Footer */}
        <ul className="sidemenu_terms mt-[50px] mb-[80px] ml-[20px]">
          <li className="inline-block">
            <Link
              href="/stplat/terms"
              className="block text-[12px] text-[#767676] leading-[13px] py-[5px] font-semibold"
            >
              서비스 이용약관
            </Link>
          </li>
          <li className="inline-block relative ml-[24px]">
            <Link
              href="/stplat/policy"
              className="block text-[#eb0000] text-[12px] leading-3 py-[5px] font-semibold"
            >
              개인정보 처리방침
            </Link>
          </li>
        </ul>
        
        {/* 사이드 메뉴 열고 닫는 X 버튼 */}
        <button
          className={styles.close_btn}
          onClick={() => setIsOpened(false)}
        ></button>
      </div>
      <div
        className={isOpened ? styles.overlay : ""}
        onClick={() => setIsOpened(false)}
      ></div>
    </>
  );
}

export default SideMenu;

/** 즐겨찾기 메뉴 컴포넌트 */
function FavList(props: { favList: any }) {
  return (
    <div className={styles.side_fav}>
      <div className={styles.side_fav_list}>
        {props.favList.map((fav: string, idx: number) => (
          <p className={styles.fav_menu_box} key={idx}>
            <Link href={fav[0]}>
              <img src={`${favUrl}${fav[1]}`} />
            </Link>
            {fav[0]}
          </p>
        ))}
      </div>

      <div className={styles.select_fav_box}>
        <button className={styles.ico_btn}></button>
        <span className={styles.select_txt}>
          <button className={styles.fav_sel_txt}>즐겨찾기 메뉴 선택</button>
          에서
          <br />
          나만의 즐겨찾기 메뉴를 설정할 수 있어요!
        </span>
      </div>
    </div>
  );
}

const menu_tit =
  "pb-[8px] text-base font-bold leading-7 border-b border-black ";
const acco_btn =
  "relative block w-[100%] h-[48px] text-left text-[14px] leading-6";

/** 로그인 시 보이는 메뉴 컴포넌트 (마이포인트, 마이혜택 등) */
function MyPage() {
  // 마이 페이지 요소 숨기기
  const handleClick = (e: any) => {
    const val = e.target.value;

    // 클릭 시 토글
    const changeHidden = document.getElementById(val);
    if (changeHidden?.classList.contains("hidden")) {
      changeHidden.classList.remove("hidden");
      e.target.children[0].style.backgroundPosition = "0  -7px";
    } else {
      changeHidden?.classList.add("hidden");
      e.target.children[0].style.backgroundPosition = "0  1px";
    }
  };
  "2023-08-31"
  return (
    <div className="pt-[24px] px-[20px] ">
      <h3 className={menu_tit}>마이 페이지</h3>
      <div className="">
        {/* loginMenuList의  */}
        {loginMenuList.map((item, idx) => (
          <div className="border-b" key={idx}>
            <button
              value={idx}
              className={acco_btn}
              onClick={(e) => handleClick(e)}
            >
              {item.main}
              <span className={styles.acco_arrow}></span>
            </button>
            <div id={`${idx}`} className="ul_box">
              <ul className="pb-[34px] mt-[-10px]">
                {item.menu.map((mm, idx) => (
                  <li
                    key={idx}
                    className="w-1/2 sm:w-1/3 inline-block align-top pt-[20px] "
                  >
                    <Link
                      className="flex items-center text-[11px]"
                      href={mm.url}
                    >
                      <Image
                        src={mm.img_url}
                        width={20}
                        height={20}
                        alt="메뉴 이미지"
                        className="mr-1"
                      ></Image>
                      {mm.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 메뉴 박스
function MenuBox(props: { menuList: MenuListType[] }) {
  const { menuList } = props;

  return (
    <div className={styles.shortcut_wrap}>
      <div className={styles.shortcut_menu_box}>
        {menuList.map((item, idx) => (
          <MenuItem item={item} idx={idx} key={idx}></MenuItem>
        ))}
      </div>
    </div>
  );
}

// 세부 아이템
function MenuItem(props: { item: MenuListType; idx: number }) {
  const { item, idx } = props;
  return (
    <div className={`${idx > 0 ? "mt-[40px]" : ""}`} key={idx}>
      <h3 className={menu_tit}>{item.main}</h3>
      <ul className={styles.menu_list}>
        {item.menu.map((mm, idxx) => (
          <li key={idxx} className="w-1/2 sm:w-1/3">
            <Link href={mm.url}>
              <Image
                className="mr-1"
                src={mm.img_url}
                width={20}
                height={20}
                alt="메뉴 이미지"
              ></Image>
              {mm.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
