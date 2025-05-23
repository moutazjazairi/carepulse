import RegisterForm from "@/components/forms/RegisterForm"
import { getUser } from "@/lib/actions/patient.actions"
import Image from "next/image"
import Link from "next/link"
import React from 'react'

interface Props {
  params: {
    userId: string;
  };
}

const Register = async ({ params }: Props) => {
  const user = await getUser(params.userId);

  return (
    <div className="flex h-screen max-h-screen">
     <section className="remove-scrollbar container overflow-hidden">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image 
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
             <RegisterForm  user={user}/>
         
             <p className="copyright py-12">
                © 2025 CarePulse
              </p>

        </div>
     </section>
     <Image 
      src="/assets/images/register-img.png"
      height={1000}
      width={1000}
      alt="Patiant"
      className="side-img max-w-[390px]"
     />
    </div>
  )
}

export default Register