'use client';

import { useMembers } from '@/hooks/useMembers';
import Image from 'next/image';

export default function MembersList() {
  const { members, loading, error } = useMembers();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
                <Image
                  src={`/images/team/${member.image}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-2">
                {member.name}
              </h3>
              
              <p className="text-gray-600 text-center mb-4">
                {member.position}
              </p>

              {member.company && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  {member.company}
                </p>
              )}

              <div className="w-full space-y-2">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                >
                  📧 {member.email}
                </a>
                
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                >
                  📱 {member.phone}
                </a>

                <div className="flex justify-center gap-3 mt-4">
                  {member.href && (
                    <a
                      href={member.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.telegram && (
                    <a
                      href={member.telegram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                      title="Telegram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.093.036.306.02.472z"/>
                      </svg>
                    </a>
                  )}
                  
                  {member.viber && (
                    <a
                      href={member.viber.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                      title="Viber"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.172 1.957-1.77 5.475-2.01 7.11-2.02zm.36 2.6a.299.299 0 00-.3.299.3.3 0 00.3.3 5.631 5.631 0 014.03 1.59A5.402 5.402 0 0117.5 10.5a.3.3 0 00.3.3.3.3 0 00.3-.3 5.994 5.994 0 00-1.762-4.238 6.24 6.24 0 00-4.513-1.763zm-3.954 2.05a1.04 1.04 0 00-.471.14c-.3.15-.677.473-.782.574-.401.399-.713.849-.713 1.55 0 .96.386 1.94 1.144 2.94 1.128 1.49 2.607 2.756 4.17 3.57.81.42 1.52.68 2.13.83.24.06.43.11.59.13.39.07.75.06 1.03.03.41-.04 1.28-.17 1.73-.63.23-.24.39-.5.39-.5.13-.17.29-.42.29-.7 0-.26-.13-.49-.35-.63l-1.55-.93c-.23-.14-.47-.09-.65.1l-.622.64c-.17.18-.44.21-.65.09-.04-.02-.09-.04-.15-.07-.51-.24-1.17-.59-1.83-1.21a7.04 7.04 0 01-1.62-1.95c-.07-.11-.11-.2-.13-.24a.65.65 0 01.14-.67l.55-.56c.1-.11.18-.24.21-.39.03-.14 0-.28-.11-.42l-.85-1.81c-.13-.26-.35-.4-.57-.4zm3.674 1.158a.3.3 0 00-.121.008.299.299 0 00-.179.38c.25.73.85 1.328 1.582 1.578a.3.3 0 00.378-.179.299.299 0 00-.179-.378c-.58-.2-1.063-.682-1.263-1.262a.3.3 0 00-.218-.147zm1.261.003a.3.3 0 00-.11.008.3.3 0 00-.179.379c.14.422.58.865 1.002 1.005a.3.3 0 00.378-.18.299.299 0 00-.18-.378 1.094 1.094 0 01-.703-.703.3.3 0 00-.208-.131z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}