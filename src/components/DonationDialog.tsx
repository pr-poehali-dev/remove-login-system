import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { authService, type DonationStatus } from '@/lib/auth';

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DonationDialog({ open, onOpenChange, onSuccess }: DonationDialogProps) {
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [donationStatus, setDonationStatus] = useState<DonationStatus | null>(null);

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
      console.error('Failed to load donation status:', err);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Введите корректную сумму');
      }

      await authService.createDonation(amountNum);
      await loadDonationStatus();
      onSuccess();
      setAmount('100');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
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
            Ваша поддержка помогает развивать проект и добавлять новые русификаторы
          </DialogDescription>
        </DialogHeader>

        {donationStatus && donationStatus.has_donated && (
          <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle2" size={20} />
              <span className="font-semibold">Спасибо за поддержку!</span>
            </div>
            <p className="text-sm">
              Вы уже поддержали проект на сумму {donationStatus.total} ₽
            </p>
          </div>
        )}

        <form onSubmit={handleDonate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма доната (₽)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount('50')}
            >
              50 ₽
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount('100')}
            >
              100 ₽
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount('500')}
            >
              500 ₽
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="Heart" size={16} />
                Поддержать на {amount} ₽
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            После доната вы сможете скачивать файлы русификаторов
          </p>
        </form>

        {donationStatus && donationStatus.donations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">История донатов</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {donationStatus.donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between text-sm text-muted-foreground"
                >
                  <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                  <span className="font-medium">{donation.amount} ₽</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
