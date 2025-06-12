
import Layout from "@/components/Layout";
import LoyaltyCard from "@/components/LoyaltyCard";
import CookieConsent from "@/components/CookieConsent";
import WelcomeHeader from "@/components/index/WelcomeHeader";
import RewardsOverview from "@/components/index/RewardsOverview";
import CustomerNameForm from "@/components/index/CustomerNameForm";
import TestStampButton from "@/components/index/TestStampButton";
import { useIndexLogic } from "@/hooks/useIndexLogic";

const Index = () => {
  const {
    customerName,
    setCustomerName,
    stamps,
    cardStyle,
    maxStamps,
    businessId,
    businessData,
    cooldownInfo,
    handleStampCollected,
    handleCardReset,
    handleSaveName,
  } = useIndexLogic();

  const miniRewards = cardStyle?.rewards || [];
  const sortedRewards = [...(miniRewards || [])].sort((a, b) => a.stampNumber - b.stampNumber);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <WelcomeHeader businessId={businessId} />

        <RewardsOverview
          maxStamps={maxStamps}
          stamps={stamps}
          sortedRewards={sortedRewards}
        />

        <CustomerNameForm
          customerName={customerName}
          onNameChange={setCustomerName}
          onSaveName={handleSaveName}
        />

        <TestStampButton
          businessData={businessData}
          cooldownInfo={cooldownInfo}
          onStampCollected={handleStampCollected}
        />

        <div className="mb-8">
          <LoyaltyCard
            customerName={customerName}
            maxStamps={maxStamps}
            currentStamps={stamps}
            cardStyle={cardStyle || undefined}
            onStampCollected={handleStampCollected}
            onReset={handleCardReset}
            businessId={businessId}
          />
        </div>
      </div>
      <CookieConsent />
    </Layout>
  );
};

export default Index;
