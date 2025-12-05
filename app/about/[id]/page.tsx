import Member from "@/components/user/about/members/member"

export default function MemberDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <Member id={parseInt(params.id)} />
}