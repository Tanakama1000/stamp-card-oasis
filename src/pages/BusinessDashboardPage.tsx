
import Layout from "@/components/Layout";
import BusinessManagement from "@/components/admin/BusinessManagement";

const BusinessDashboardPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BusinessManagement />
      </div>
    </Layout>
  );
};

export default BusinessDashboardPage;
