
import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: Props) {
  const isAdmin = searchParams?.admin === 'true';

  return (
    <div className="flex h-screen max-h-screen">

      {isAdmin && <PassKeyModal />}
     <section className="remove-scrollbar container my-auto overflow-hidden">
        <div className="sub-container max-w-[496px]">
          <Image 
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />

          <div className="text-14-regular mt-1 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
          © 2025 CarePulse
          </p>
          <Link href="/?admin=true" className="text-green-500">
          Admin
          </Link>
          </div>

        </div>
     </section>
     <Image 
      src="/assets/images/onboarding-img.png"
      height={1000}
      width={1000}
      alt="Patiant"
      className="side-img max-w-[50%]"
     />
    </div>
    
  );
}

