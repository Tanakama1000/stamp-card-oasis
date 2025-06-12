
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerNameFormProps {
  customerName: string;
  onNameChange: (name: string) => void;
  onSaveName: () => void;
}

const CustomerNameForm = ({ customerName, onNameChange, onSaveName }: CustomerNameFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
      <Card className="p-4 bg-white card-shadow">
        <h3 className="font-semibold text-coffee-dark mb-3">Update Your Name</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your name (optional)"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            className="border-coffee-light"
          />
          <Button
            onClick={onSaveName}
            className="bg-coffee-medium hover:bg-coffee-dark"
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerNameForm;
