import React from "react"
import { poetsen_one } from "@/config/fonts"
import InquiryForm from "@/components/user/contact/inquiryForm"
import { Divider } from "@heroui/react"
import Links from "@/components/user/contact/links"

const Contact = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:mt-16">
      {/* Left side */}
      <div className="flex justify-center items-center container mx-auto py-8 lg:py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="pb-4 space-y-4 text-center lg:text-left">
            <h1 className={`text-3xl sm:text-4xl lg:text-6xl text-primary ${poetsen_one.className}`}>Get in touch</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700">
              Reach out to <strong>Infinitech Advertising Corporation</strong> for inquiries about web and system development solutions.
            </p>
          </div>

          <div className="space-y-4">
            <Links />

            <Divider className="my-4" />

            <InquiryForm />
          </div>
        </div>
      </div>

      {/* Right side (map) */}
      <div className="w-full my-auto h-64 sm:h-80 md:h-[calc(100vh-64px)]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6855119607444!2d121.01129607577312!3d14.559968178068823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9df6c047e17%3A0x12957e8fd785f26f!2sinfinitech%20advertising%20corporation!5e0!3m2!1sen!2sph!4v1742883768973!5m2!1sen!2sph"
          width="100%"
          height="100%"
          className="rounded-lg shadow-lg border-0"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

export default Contact
