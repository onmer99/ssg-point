'use client'
import AuthBottom from "@/components/pages/auth/AuthBottom";
import AuthHeaderBottom from "@/components/pages/auth/AuthHeaderBottom";
import AuthHeaderTop from "@/components/pages/auth/AuthHeaderTop";
import CardAuthBody from "@/components/pages/auth/CardAuthBody";
import PhoneAuthBody from "@/components/pages/auth/PhoneAuthBody";
import { PhoneCardSelectBoxData } from "@/data/PhoneCardSelectBoxData";
import { useState } from "react";

function Page(){

    const [selected,setSelected] = useState<string>("0");
    const path = "signUpAuth"

    return(
        <>
            <section className="pt-20 px-7">
                <AuthHeaderTop/>
                <AuthHeaderBottom
                    typeList={PhoneCardSelectBoxData}
                    selected={selected}
                    setSelected={setSelected}
                />
                {
                    selected === "0" ? 
                    <PhoneAuthBody
                    pathName={path}/> : <CardAuthBody/>

                }
                <AuthBottom/>
            </section>
        </>
    )
}
export default Page;
