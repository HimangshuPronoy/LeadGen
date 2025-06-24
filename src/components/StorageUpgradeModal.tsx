
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, CreditCard } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface StorageUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StorageUpgradeModal = ({ open, onOpenChange }: StorageUpgradeModalProps) => {
  const { createStorageUpgrade, subscription } = useSubscription();

  const handleUpgrade = async () => {
    await createStorageUpgrade();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            Storage Limit Reached
          </DialogTitle>
          <DialogDescription className="text-left pt-4">
            You've reached your storage limit of {subscription?.max_storage_packages} packages. 
            To save more lead packages, you can either delete some existing packages or upgrade your storage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Additional Storage</h4>
              <span className="text-2xl font-light text-gray-900">$14.99</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Get 200 additional package slots for one year
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 200 additional lead packages</li>
              <li>• Valid for 12 months</li>
              <li>• One-time payment</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Storage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorageUpgradeModal;
