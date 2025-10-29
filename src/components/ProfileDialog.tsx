import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import SubscriptionSettings from './SubscriptionSettings';
import type { User } from '@/lib/auth';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const ProfileDialog = ({ open, onOpenChange, user }: ProfileDialogProps) => {
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
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <SubscriptionSettings userEmail={user.email} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
