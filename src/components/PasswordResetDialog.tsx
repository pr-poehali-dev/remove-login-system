import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const ACCOUNT_API = 'https://functions.poehali.dev/12df7939-ec61-45a4-ba67-eebba4072d8c';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(ACCOUNT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_reset',
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Код для восстановления отправлен на вашу почту');
        setStep('code');
      } else {
        toast.error(data.error || 'Не удалось отправить код');
      }
    } catch (error) {
      toast.error('Произошла ошибка при отправке кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(ACCOUNT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify_reset_code',
          email: email,
          code: code
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Код подтверждён, введите новый пароль');
        setStep('password');
      } else {
        toast.error(data.error || 'Неверный код');
      }
    } catch (error) {
      toast.error('Произошла ошибка при проверке кода');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(ACCOUNT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset_password',
          email: email,
          code: code,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Пароль успешно изменён! Войдите с новым паролем');
        onOpenChange(false);
        setStep('email');
        setEmail('');
        setCode('');
        setPassword('');
      } else {
        toast.error(data.error || 'Не удалось изменить пароль');
      }
    } catch (error) {
      toast.error('Произошла ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="KeyRound" size={24} className="text-primary" />
            Восстановление пароля
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Введите email для отправки кода восстановления'}
            {step === 'code' && 'Введите код из письма'}
            {step === 'password' && 'Введите новый пароль'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Mail" size={16} className="mr-2" />
                  Отправить код
                </>
              )}
            </Button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Код отправлен на <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Код подтверждения
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep('email')}
                disabled={loading}
              >
                Назад
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  'Подтвердить'
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-500" />
                Код подтверждён
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Новый пароль
              </label>
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Изменить пароль
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
