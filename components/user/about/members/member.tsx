"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Image, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { removeSpaces } from "@/utils/formatters";
import {
  LuBriefcaseBusiness,
  LuFacebook,
  LuMail,
  LuPhone,
  LuGlobe,
  LuArrowLeft,
} from "react-icons/lu";
import { FaViber } from "react-icons/fa";
import { RiTelegram2Line } from "react-icons/ri";
import { toast } from "sonner";

interface MemberType {
  id: number;
  name: string;
  position: string;
  image: string;
  image_url?: string;
  email: string;
  phone: string;
  facebookname?: string;
  facebooknames?: string;
  href?: string;
  hrefs?: string;
  company?: string;
  telegram?: { title?: string; href?: string };
  viber?: { title?: string; href?: string };
  order?: number;
  is_active: boolean;
}

const Member = ({ id }: { id: number }) => {
  const [member, setMember] = useState<MemberType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/members/${id}`);

      if (!response.ok) {
        throw new Error("Member not found");
      }

      const data = await response.json();
      const memberData = data.success ? data.data : data;
      setMember(memberData);
    } catch (error) {
      console.error("Error fetching member:", error);
      toast.error("Failed to load member details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = () => {
    if (!member) return;

    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${member.name || ""}
EMAIL;TYPE=INTERNET:${member.email || ""}
TEL;TYPE=CELL:${member.phone || ""}
URL:${member.company?.toLowerCase().includes("abic realty") ? "https://abicrealtyph.com" : ""}
ADR;TYPE=WORK:;;Unit 311, Campos Rueda Building, 101 Urban Ave, Makati, Metro Manila;;;
`;

    if (member.facebookname)
      vcard += `X-SOCIALPROFILE;TYPE=facebook:${member.href || ""}\n`;
    if (member.facebooknames)
      vcard += `X-SOCIALPROFILE;TYPE=facebook:${member.hrefs || ""}\n`;
    if (member.telegram)
      vcard += `X-SOCIALPROFILE;TYPE=telegram:${member.telegram.href || ""}\n`;
    if (member.viber)
      vcard += `X-SOCIALPROFILE;TYPE=viber:${member.viber.href || ""}\n`;

    vcard += "END:VCARD";

    const blob = new Blob([vcard.trim()], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${member.name?.replace(/\s+/g, "_") || "contact"}.vcf`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success(`${member.name} saved to your contacts!`);
  };

  if (loading) {
    return (
      <section className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-64 2xl:px-[20rem] mt-24 mb-12">
        <div className="w-full max-w-6xl text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member details...</p>
        </div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-64 2xl:px-[20rem] mt-24 mb-12">
        <div className="w-full max-w-6xl text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">Member Not Found</h3>
          <Button color="primary" onPress={() => router.push("/about")}>
            Back to About
          </Button>
        </div>
      </section>
    );
  }

  // --- Company detection from comma-separated string ---
  const companies = member.company
    ?.split(",")
    .map((c) => c.trim().toLowerCase());

  const hasAbic = companies?.some((c) =>
    c.includes("abic realty")
  );

  const hasInfinitech = companies?.some((c) =>
    c.includes("infinitech advertising")
  );

  return (
    <section className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-64 2xl:px-[20rem] mt-24 mb-12">
      <div className="w-full max-w-6xl">
        <Button
          variant="light"
          className="mb-4"
          startContent={<LuArrowLeft />}
          onPress={() => router.back()}
        >
          Back to Team
        </Button>

        <Card className="p-4">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              <div className="flex justify-center sm:justify-start items-center sm:w-[40%]">
                <Image
                  src={member.image_url || `/images/members/${member.image}`}
                  alt={member.name}
                  className="w-full h-auto sm:h-[20rem] max-h-[24rem] object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col justify-start gap-4 w-full sm:w-[60%]">
                <div className="text-center sm:text-left uppercase mb-4">
                  <h3 className="text-2xl font-semibold text-accent">{member.name}</h3>
                  <h3 className="text-xl font-semibold text-primary">{member.position}</h3>
                </div>

                <div className="grid grid-cols-[40px_1fr] gap-y-3 gap-x-3 items-start text-sm text-blue-700">

                  {(hasAbic || hasInfinitech) && (
                    <>
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <LuGlobe size={20} />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {hasAbic && (
                          <a
                            href="https://abicrealtyph.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            www.abicrealtyph.com
                          </a>
                        )}

                        {hasAbic && hasInfinitech && (
                          <span className="text-gray-400">|</span>
                        )}

                        {hasInfinitech && (
                          <a
                            href="https://infinitechphil.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            www.infinitechphil.com
                          </a>
                        )}
                      </div>
                    </>
                  )}

                  <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <LuBriefcaseBusiness size={20} />
                  </div>
                  <div>
                    <a
                      href="https://www.google.com/maps?q=Unit+311,+Campos+Rueda+Building,+101+Urban+Ave,+Makati,+Metro+Manila"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Unit 311, Campos Rueda Building, 101 Urban Ave, Makati, Metro Manila
                    </a>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <LuMail size={20} />
                  </div>
                  <div>
                    <a href={`mailto:${member.email}`} className="hover:underline">
                      {member.email}
                    </a>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                    <LuPhone size={20} />
                  </div>
                  <div>
                    <a href={`tel:${removeSpaces(member.phone)}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </div>

                  {member.telegram && (
                    <>
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <RiTelegram2Line size={20} />
                      </div>
                      <div>
                        <a href={member.telegram.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {member.telegram.title}
                        </a>
                      </div>
                    </>
                  )}

                  {member.viber && (
                    <>
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <FaViber size={20} />
                      </div>
                      <div>
                        <a href={member.viber.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {member.viber.title}
                        </a>
                      </div>
                    </>
                  )}

                  {member.facebookname && (
                    <>
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <LuFacebook size={20} />
                      </div>
                      <div>
                        <a href={member.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {member.facebookname}
                        </a>
                      </div>
                    </>
                  )}

                  {member.facebooknames && (
                    <>
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <LuFacebook size={20} />
                      </div>
                      <div>
                        <a href={member.hrefs || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {member.facebooknames}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardBody>

          <div className="mt-4 flex justify-end">
            <Button
              color="primary"
              className="bg-[#1D2F7C] text-white hover:bg-[#9A3160] rounded-lg shadow-md transition"
              onPress={handleSaveContact}
            >
              Save Contact
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Member;
