import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
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
              Политика конфиденциальности
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Общие положения
              </h2>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта ruprojectgames. Используя наш сайт, вы соглашаетесь с условиями данной политики.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Сбор персональных данных
              </h2>
              <p>Мы собираем следующие данные:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Адрес электронной почты при регистрации</li>
                <li>Данные об использовании сайта (посещаемые страницы, время на сайте)</li>
                <li>Информация о донатах и поддержке проекта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Использование данных
              </h2>
              <p>Ваши данные используются для:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Предоставления доступа к функциям сайта</li>
                <li>Отправки уведомлений о новых русификаторах</li>
                <li>Улучшения качества работы сайта</li>
                <li>Обработки донатов и благодарностей</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Защита данных
              </h2>
              <p>
                Мы применяем современные технологии для защиты ваших персональных данных от несанкционированного доступа, изменения или уничтожения. Данные хранятся в зашифрованном виде на защищённых серверах.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Передача данных третьим лицам
              </h2>
              <p>
                Мы не передаём ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Cookies
              </h2>
              <p>
                Наш сайт использует cookies для обеспечения работы функций авторизации и улучшения пользовательского опыта. Вы можете отключить cookies в настройках браузера, но это может ограничить функциональность сайта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Ваши права
              </h2>
              <p>Вы имеете право:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Запросить доступ к своим персональным данным</li>
                <li>Потребовать исправления неточных данных</li>
                <li>Удалить свою учётную запись и данные</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Контактная информация
              </h2>
              <p>
                По вопросам обработки персональных данных обращайтесь на почту:{' '}
                <a 
                  href="mailto:ruprojectgames@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  ruprojectgames@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Изменения в политике
              </h2>
              <p>
                Мы оставляем за собой право вносить изменения в данную политику. О существенных изменениях мы уведомим вас через email или уведомление на сайте.
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm">
                Дата последнего обновления: 29 октября 2025 года
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
