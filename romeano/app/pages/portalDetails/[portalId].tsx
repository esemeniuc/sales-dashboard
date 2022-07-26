import "tailwindcss/tailwind.css"
import LineChart from "app/core/components/portalDetails/LineChart"
import { useParam, useQuery } from "blitz"
import getPortalDetail from "../../portal-details/queries/getPortalDetail"
import { ContactsCard } from "app/core/components/ContactsCard"
import DocumentsCard from "app/core/components/portalDetails/DocumentsCard"
import { CardDivider } from "app/core/components/generic/Card"
import { Footer } from "app/core/components/Footer"
import { StakeholderEngagementCard } from "app/core/components/portalDetails/StakeholderEngagementCard"
import { StakeholderActivityLogCard } from "app/core/components/portalDetails/StakeholderActivityLogCard"
import OpportunityOverview from "app/core/components/portalDetails/OpportunityOverview"
import { Header } from "app/core/components/portalDetails/Header"

function PortalDetails() {
  const portalId = useParam("portalId", "number")
  const [portal, { refetch }] = useQuery(
    getPortalDetail,
    { portalId },
    { refetchOnWindowFocus: false, enabled: !!portalId }
  )

  //container: https://tailwindui.com/components/application-ui/layout/containers
  if (!portalId || !portal) return <>Loading!</>
  return (
    <div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <Header
          portalId={portalId}
          vendorLogo={portal.header.vendorLogo}
          customerName={portal.header.customerName}
          customerLogo={portal.header.customerLogo}
          refetchHandler={refetch}
        />
        <div className="py-3">
          <CardDivider />
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <OpportunityOverview {...portal.opportunityOverview} />
            <ContactsCard data={portal.contacts} numContactsToDisplay={1} narrowLayout />
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
    </div>
  )
}

PortalDetails.authenticate = true
export default PortalDetails
