import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const ProfileDialog = ({ open, onOpenChange, user, onAccountDeleted }: ProfileDialogProps) => {
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="User" size={24} className="text-primary" />
            Настройки профиля
          </DialogTitle>
          <DialogDescription>
            Управляйте вашим аккаунтом и настройками уведомлений
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Email</label>
                  <p className="text-lg font-medium text-foreground mt-1">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Статус</label>
                  <p className="text-lg font-medium text-foreground mt-1">
                    {user.email_verified ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <Icon name="CheckCircle2" size={18} />
                        Подтверждён
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-yellow-600">
                        <Icon name="AlertCircle" size={18} />
                        Не подтверждён
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Дата регистрации</label>
                  <p className="text-lg font-medium text-foreground mt-1">
                    {new Date(user.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Icon name="AlertTriangle" size={24} className="text-red-500 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Опасная зона</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Удаление аккаунта необратимо. Все ваши данные, включая донаты и настройки, будут удалены навсегда.
                    </p>
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
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <SubscriptionSettings userEmail={user.email} />
          </TabsContent>
        </Tabs>
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