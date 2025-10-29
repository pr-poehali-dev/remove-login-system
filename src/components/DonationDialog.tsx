import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { authService, type DonationStatus } from "@/lib/auth";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DonationDialog({
  open,
  onOpenChange,
  onSuccess,
}: DonationDialogProps) {
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [donationStatus, setDonationStatus] = useState<DonationStatus | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      loadDonationStatus();
    }
  }, [open]);

  const loadDonationStatus = async () => {
    try {
      const status = await authService.getDonationStatus();
      setDonationStatus(status);
    } catch (err) {
      console.error("Failed to load donation status:", err);
    }
  };

  const handleBoostyRedirect = () => {
    window.open("https://boosty.to/dlightru", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Heart" size={24} className="text-red-500" />
            Поддержать проект
          </DialogTitle>
          <DialogDescription>
            Все файлы доступны бесплатно. Донаты помогают развивать проект и
            добавлять новые русификаторы.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Поддержать через Boosty</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Стабильная платформа для донатов с удобными способами оплаты
                </p>
                <Button
                  onClick={handleBoostyRedirect}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Icon name="ExternalLink" size={16} />
                  Открыть Boosty
                </Button>
              </div>
            </div>
          </div>

          {donationStatus && donationStatus.has_donated && (
            <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle2" size={20} />
                <span className="font-semibold">Спасибо за поддержку!</span>
              </div>
              <p className="text-sm">
                Вы поддержали проект на сумму {donationStatus.total} ₽
              </p>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>💝 Ваша поддержка вдохновляет создавать больше переводов</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
