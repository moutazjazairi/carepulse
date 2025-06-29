'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { FileUploader } from "../FileUploader";


 
const RegisterForm = ({user}: {user: User}) =>  {
    const router = useRouter();
const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    
    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }
    try{
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
        //const userData = {name, email, phone}

       //const user = await createUser(userData);

        //if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header font-bold text-xl">
                Welcome 👋
            </h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>     
        </section>

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Ex:John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email" 
            label="Email Address"
            placeholder="Ex:JohnDoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone" 
            label="Phone Number"
            placeholder="(+971) 512345678"
        />  
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate" 
            label="Date Of Birth"

        />

        <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address" 
            label="Address"
            placeholder="Buisness Bay, Dubai, UAE"
        />
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation" 
            label="Occupation"
            placeholder="Software Enginner"

        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName" 
            label="Emergency Contact Name"
            placeholder="John Doe"
        />

        <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber" 
            label="Emergency Contact Number"
            placeholder="(+971) 512345678"
        />  
        </div>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
            </div>     
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician" 
            label="Primary Physician"
            placeholder="Select a Physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image 
                    src={doctor.image}
                    height={32}
                    width={32}
                    alt="doctor image"
                    className="rounded-full border border-dark-500"
                    
                  />
                  <p>{doctor.name}</p>
                </div>
            </SelectItem>
          ))}
          </CustomFormField>  

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider" 
            label="Insurance Provider"
            placeholder="Orient"
        />
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber" 
            label="Insurance Policy Number"
            placeholder="ABC-123123-123123"

        />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies" 
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillian, Pollen"
        />
        <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication" 
            label="Current Medication"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"

        />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory" 
            label="Family Medical History"
            placeholder="Mother, Father"
        />
        <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory" 
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"

        />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification and Verification</h2>
            </div>     
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType" 
            label="Identification Type"
            placeholder="Select Identification Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
             {type}
            </SelectItem>
          ))}
          </CustomFormField>

          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber" 
            label="Identification Number"
            placeholder="1234512345"
        />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned copy of
              identification document"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>     
          </section>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        
       <SubmitButton isLoading={isLoading}>
        Get Started
       </SubmitButton>
        
      </form>
    </Form>
  )
}

export default RegisterForm