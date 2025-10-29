import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const navigate = useNavigate();

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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Поддержка и контакты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Связь с нами
              </h2>
              <p className="text-muted-foreground mb-4">
                Если у вас возникли вопросы, проблемы или предложения по улучшению проекта, мы всегда рады помочь!
              </p>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <span className="text-lg font-semibold text-foreground">
                    Электронная почта
                  </span>
                </div>
                <a 
                  href="mailto:ruprojectgames@gmail.com"
                  className="text-primary hover:underline text-xl font-medium"
                >
                  ruprojectgames@gmail.com
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Частые вопросы
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Как установить русификатор?
                  </h3>
                  <p className="text-muted-foreground">
                    Подробные инструкции по установке доступны в разделе "Инструкции" на главной странице. Для каждой игры предоставлено пошаговое руководство.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Русификатор не работает, что делать?
                  </h3>
                  <p className="text-muted-foreground">
                    Убедитесь, что вы установили правильную версию для вашего мода. Проверьте, что все файлы скопированы в нужные папки. Если проблема сохраняется, напишите нам на почту с подробным описанием ошибки.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Можно ли поддержать проект?
                  </h3>
                  <p className="text-muted-foreground">
                    Да! Авторизуйтесь на сайте и нажмите кнопку "Поддержать проект". Ваши донаты помогают нам создавать новые качественные русификаторы.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Будут ли новые русификаторы?
                  </h3>
                  <p className="text-muted-foreground">
                    Мы постоянно работаем над новыми переводами. Следите за новостями на главной странице сайта.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Сообщить о проблеме
              </h2>
              <p className="text-muted-foreground mb-4">
                При обращении по email укажите, пожалуйста:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                <li>Название игры и мода</li>
                <li>Версию русификатора</li>
                <li>Описание проблемы</li>
                <li>Скриншоты (если применимо)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Мы стараемся отвечать на все письма в течение 24-48 часов.
              </p>
            </section>

            <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Heart" size={24} className="text-primary" />
                Спасибо за поддержку!
              </h2>
              <p className="text-muted-foreground">
                Мы благодарим всех, кто использует наши русификаторы и поддерживает проект. Ваши отзывы и предложения помогают нам становиться лучше!
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;