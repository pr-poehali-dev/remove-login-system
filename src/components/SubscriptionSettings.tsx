import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const SUBSCRIPTIONS_API = 'https://functions.poehali.dev/cdb15533-4129-422e-ab35-7c14ae97d39b';

interface SubscriptionSettingsProps {
  userEmail: string;
}

const SubscriptionSettings = ({ userEmail }: SubscriptionSettingsProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [userEmail]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(SUBSCRIPTIONS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'status',
          email: userEmail
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSubscribed(data.subscribed || false);
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async (subscribed: boolean) => {
    setLoading(true);
    
    try {
      const response = await fetch(SUBSCRIPTIONS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: subscribed ? 'subscribe' : 'unsubscribe',
          email: userEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(subscribed);
        toast.success(
          subscribed 
            ? 'Вы подписались на уведомления о новых материалах' 
            : 'Вы отписались от уведомлений'
        );
      } else {
        toast.error(data.error || 'Не удалось изменить настройки подписки');
      }
    } catch (error) {
      toast.error('Произошла ошибка при изменении настроек');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Bell" size={24} className="text-primary" />
          Уведомления
        </CardTitle>
        <CardDescription>
          Управляйте подпиской на email-уведомления о новых русификаторах
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Новые материалы
            </h3>
            <p className="text-sm text-muted-foreground">
              Получайте уведомления на почту при выходе новых русификаторов и обновлений
            </p>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggleSubscription}
            disabled={loading}
          />
        </div>

        {isSubscribed && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Подписка активна
                </p>
                <p className="text-sm text-muted-foreground">
                  Вы будете получать уведомления на {userEmail}. 
                  Вы можете отписаться в любой момент здесь или по ссылке в письме.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Icon name="Shield" size={16} className="text-green-500" />
            Защита данных
          </h4>
          <p className="text-sm text-muted-foreground">
            Ваш email используется только для отправки уведомлений о новых материалах. 
            Мы <span className="font-semibold text-red-600">строго запрещаем</span> передачу 
            персональных данных третьим лицам. Никакого спама.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
