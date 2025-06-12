
import BonusTimeAlert from "@/components/BonusTimeAlert";

interface WelcomeHeaderProps {
  businessId: string;
}

const WelcomeHeader = ({ businessId }: WelcomeHeaderProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-coffee-dark mb-2">Welcome to Stamp Card Oasis</h1>
        <p className="text-coffee-light">Collect stamps and earn rewards from your favorite businesses</p>
      </div>

      {businessId && <BonusTimeAlert businessId={businessId} />}
    </>
  );
};

export default WelcomeHeader;
