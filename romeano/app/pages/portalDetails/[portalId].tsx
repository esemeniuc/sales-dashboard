import { Suspense } from "react"
import "tailwindcss/tailwind.css"
import LineChart from "app/core/components/portalDetails/LineChart"
import { useParam, useQuery } from "blitz"
import getPortalDetail from "../../portal-details/queries/getPortalDetail"
import { ContactsCard } from "../../core/components/ContactsCard"
import DocumentsCard from "../../core/components/portalDetails/DocumentsCard"
import { CardDivider } from "../../core/components/generic/Card"
import { Footer } from "../../core/components/Footer"
import { StakeholderEngagementCard } from "../../core/components/portalDetails/StakeholderEngagementCard"
import { StakeholderActivityLogCard } from "../../core/components/portalDetails/StakeholderActivityLogCard"
import OpportunityOverview from "../../core/components/portalDetails/OpportunityOverview"
import { Header } from "../../core/components/portalDetails/Header"

export default function PortalDetails() {
  const portalId = useParam("portalId", "number")
  const [portal] = useQuery(getPortalDetail, { portalId },
    { refetchOnWindowFocus: false, enabled: !!portalId })

  //container: https://tailwindui.com/components/application-ui/layout/containers
  if (!portalId || !portal) return <>Loading!</>
  return <Suspense fallback={<>Loading!</>}>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header portalId={portalId} />
      <div className="py-3"><CardDivider /></div>
    </div>

    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <OpportunityOverview {...portal.opportunityOverview} />
          <ContactsCard data={portal.contacts}
                        numContactsToDisplay={1}
                        narrowLayout />
        </div>
        <div className="flex flex-col gap-4">
          <LineChart data={portal.overallEngagement} />
        </div>
      </div>
      <CardDivider />
      <DocumentsCard portalId={portalId} data={portal.documents} />
      <CardDivider />
      <StakeholderEngagementCard data={portal.stakeholderEngagement} />
      <StakeholderActivityLogCard data={portal.stakeholderActivityLog} />
      <Footer />
    </div>
  </Suspense>
}

PortalDetails.authenticate = true
PortalDetails.suppressFirstRenderFlicker = true
