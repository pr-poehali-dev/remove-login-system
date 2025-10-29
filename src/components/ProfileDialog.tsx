import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SubscriptionSettings from './SubscriptionSettings';
import { authService, type User } from '@/lib/auth';
import { toast } from 'sonner';

const ACCOUNT_API = 'https://functions.poehali.dev/12df7939-ec61-45a4-ba67-eebba4072d8c';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onAccountDeleted?: () => void;
}

type TabType = 'profile' | 'notifications' | 'security';

const ProfileDialog = ({ open, onOpenChange, user, onAccountDeleted }: ProfileDialogProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Требуется авторизация');
        return;
      }

      const response = await fetch(ACCOUNT_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Аккаунт успешно удалён');
        authService.logout();
        onOpenChange(false);
        if (onAccountDeleted) {
          onAccountDeleted();
        }
      } else {
        toast.error(data.error || 'Не удалось удалить аккаунт');
      }
    } catch (error) {
      toast.error('Произошла ошибка при удалении аккаунта');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const menuItems = [
    { id: 'profile' as TabType, icon: 'User', label: 'Моя страница' },
    { id: 'notifications' as TabType, icon: 'Bell', label: 'Уведомления' },
    { id: 'security' as TabType, icon: 'Shield', label: 'Безопасность' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 gap-0">
        <div className="flex h-[90vh]">
          <div className="w-64 bg-muted/30 border-r flex flex-col">
            <div className="p-6 border-b">
              <h2 className="font-semibold text-lg">Настройки</h2>
            </div>
            
            <nav className="flex-1 p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  authService.logout();
                  onOpenChange(false);
                }}
              >
                <Icon name="LogOut" size={20} />
                Выйти
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="p-8 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Моя страница</h1>
                  <p className="text-muted-foreground">Информация о вашем аккаунте</p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={40} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{user.email.split('@')[0]}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="text-muted-foreground">Статус email</span>
                        <span>
                          {user.email_verified ? (
                            <span className="flex items-center gap-2 text-green-600 font-medium">
                              <Icon name="CheckCircle2" size={18} />
                              Подтверждён
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-yellow-600 font-medium">
                              <Icon name="AlertCircle" size={18} />
                              Не подтверждён
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b">
                        <span className="text-muted-foreground">Дата регистрации</span>
                        <span className="font-medium">
                          {new Date(user.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Уведомления</h1>
                  <p className="text-muted-foreground">Настройте, какие уведомления вы хотите получать</p>
                </div>
                <SubscriptionSettings userEmail={user.email} />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Безопасность</h1>
                  <p className="text-muted-foreground">Управление безопасностью аккаунта</p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon name="Key" size={24} className="text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Пароль</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Регулярно меняйте пароль для защиты вашего аккаунта
                        </p>
                        <Button variant="outline" className="gap-2">
                          <Icon name="Lock" size={16} />
                          Изменить пароль
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon name="AlertTriangle" size={24} className="text-red-500 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">Опасная зона</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Удаление аккаунта необратимо. Все ваши данные, включая донаты и настройки, будут удалены навсегда.
                        </p>
                        <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                          <li className="flex items-center gap-2">
                            <Icon name="X" size={14} className="text-red-500" />
                            История донатов
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon name="X" size={14} className="text-red-500" />
                            Настройки подписки
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon name="X" size={14} className="text-red-500" />
                            Все персональные данные
                          </li>
                        </ul>
                        <Button 
                          variant="destructive" 
                          onClick={() => setShowDeleteDialog(true)}
                          className="gap-2"
                        >
                          <Icon name="Trash2" size={16} />
                          Удалить аккаунт
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Icon name="AlertTriangle" size={24} />
              Вы уверены?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Ваш аккаунт и все связанные данные будут удалены навсегда:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>История донатов</li>
                <li>Настройки подписки</li>
                <li>Все персональные данные</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Да, удалить аккаунт
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ProfileDialog;
