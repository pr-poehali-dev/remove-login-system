import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SUBSCRIPTIONS_API = 'https://functions.poehali.dev/cdb15533-4129-422e-ab35-7c14ae97d39b';

const Unsubscribe = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Неверная ссылка для отписки');
      return;
    }

    handleUnsubscribe(token);
  }, [searchParams]);

  const handleUnsubscribe = async (token: string) => {
    try {
      const response = await fetch(SUBSCRIPTIONS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unsubscribe',
          token: token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Вы успешно отписались от уведомлений');
      } else {
        setStatus('error');
        setMessage(data.error || 'Не удалось отписаться');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Произошла ошибка при отписке');
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                ruprojectgames
              </h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              {status === 'loading' && <Icon name="Loader2" size={32} className="animate-spin text-primary" />}
              {status === 'success' && <Icon name="CheckCircle2" size={32} className="text-green-500" />}
              {status === 'error' && <Icon name="XCircle" size={32} className="text-red-500" />}
              Отписка от рассылки
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Обрабатываем ваш запрос...'}
              {status === 'success' && 'Операция выполнена успешно'}
              {status === 'error' && 'Произошла ошибка'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              {message}
            </p>

            {status === 'success' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Вы больше не будете получать уведомления о новых русификаторах и обновлениях. 
                  Вы всегда можете подписаться снова в настройках вашего аккаунта.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Если проблема повторяется, пожалуйста, свяжитесь с нами по адресу{' '}
                  <a 
                    href="mailto:ruprojectgames@gmail.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    ruprojectgames@gmail.com
                  </a>
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1"
              >
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
              {status === 'success' && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/support')}
                  className="flex-1"
                >
                  <Icon name="Mail" size={16} className="mr-2" />
                  Связаться с нами
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Unsubscribe;
