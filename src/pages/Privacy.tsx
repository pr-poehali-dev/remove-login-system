import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
              Политика конфиденциальности
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Общие положения
              </h2>
              <p>
                Настоящая Политика конфиденциальности разработана в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных» и определяет порядок обработки и защиты персональных данных пользователей сайта ruprojectgames.ru (далее — Сайт).
              </p>
              <p className="mt-2">
                Оператором персональных данных является администрация Сайта. Используя Сайт, вы даёте согласие на обработку персональных данных в соответствии с настоящей Политикой.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Персональные данные, которые обрабатываются
              </h2>
              <p>В рамках использования Сайта обрабатываются следующие персональные данные:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Адрес электронной почты (при регистрации и подписке на уведомления)</li>
                <li>Информация о действиях на Сайте (просмотренные страницы, загруженные материалы)</li>
                <li>Данные, предоставленные при осуществлении донатов</li>
                <li>Настройки подписки на уведомления о новых материалах</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Цели обработки персональных данных
              </h2>
              <p>Персональные данные обрабатываются в следующих целях:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Предоставление доступа к функционалу Сайта</li>
                <li>Идентификация пользователя и предоставление персональных настроек</li>
                <li>Отправка уведомлений о новых русификаторах и материалах (при наличии согласия)</li>
                <li>Обработка платежей и донатов</li>
                <li>Техническая поддержка и улучшение качества работы Сайта</li>
                <li>Обеспечение безопасности и предотвращение мошенничества</li>
              </ul>
              <p className="mt-2 font-semibold text-foreground">
                Вы можете подписаться на уведомления о новых материалах и в любой момент отписаться через настройки аккаунта или по ссылке в письме.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Правовые основания обработки персональных данных
              </h2>
              <p>
                Обработка персональных данных осуществляется на основании:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Согласия субъекта персональных данных на обработку его данных (ст. 9 Федерального закона №152-ФЗ)</li>
                <li>Необходимости исполнения договора, стороной которого является субъект персональных данных</li>
                <li>Осуществления прав и законных интересов оператора</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Условия обработки и передачи персональных данных
              </h2>
              <p className="font-semibold text-foreground">
                Обработка персональных данных осуществляется с применением жёстких мер безопасности в соответствии с законодательством Российской Федерации. Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования, распространения.
              </p>
              <p className="mt-2 font-semibold text-red-600">
                ПЕРЕДАЧА ПЕРСОНАЛЬНЫХ ДАННЫХ ТРЕТЬИМ ЛИЦАМ СТРОГО ЗАПРЕЩЕНА.
              </p>
              <p className="mt-2">
                Единственные исключения:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Прямое письменное согласие субъекта персональных данных</li>
                <li>Требования уполномоченных государственных органов в случаях, предусмотренных законодательством РФ</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Примечание: Платёжные системы и хостинг-провайдеры не получают доступ к вашим персональным данным. Обработка платежей происходит на стороне платёжных систем без передачи личной информации.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Меры по защите персональных данных
              </h2>
              <p>
                Оператор применяет следующие меры по защите персональных данных:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Хранение паролей в зашифрованном виде</li>
                <li>Ограничение доступа к персональным данным</li>
                <li>Регулярное резервное копирование данных</li>
                <li>Контроль доступа к серверам и базам данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Права субъекта персональных данных
              </h2>
              <p>
                В соответствии со статьями 14, 15, 16, 20 Федерального закона №152-ФЗ субъект персональных данных имеет право:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Получать информацию о наличии и содержании своих персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения неверных или неполных данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Требовать удаления персональных данных (право на забвение)</li>
                <li>Обжаловать действия или бездействие оператора в уполномоченном органе по защите прав субъектов персональных данных или в судебном порядке</li>
              </ul>
              <p className="mt-2">
                Для реализации указанных прав направьте запрос на адрес электронной почты: ruprojectgames@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Cookies и технологии отслеживания
              </h2>
              <p>
                Сайт использует файлы cookies и аналогичные технологии для обеспечения функционирования, аналитики посещаемости и улучшения пользовательского опыта. Используя Сайт, вы соглашаетесь с использованием cookies. Вы можете отключить cookies в настройках браузера, однако это может ограничить функциональность Сайта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Срок хранения персональных данных
              </h2>
              <p>
                Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, либо до отзыва согласия субъектом персональных данных. После достижения целей обработки или получения требования об удалении данные уничтожаются в срок, не превышающий 30 дней.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Изменение Политики конфиденциальности
              </h2>
              <p>
                Оператор вправе вносить изменения в настоящую Политику конфиденциальности. Новая редакция вступает в силу с момента размещения на Сайте, если иное не предусмотрено новой редакцией. Действующая редакция всегда доступна на данной странице.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11. Авторские права и интеллектуальная собственность
              </h2>
              <p className="font-semibold text-foreground">
                Копирование и дальнейшее распространение материалов с сайта ruprojectgames.ru без разрешения администрации сайта запрещено.
              </p>
              <p className="mt-2">
                Все материалы, размещённые на Сайте, включая тексты, изображения, русификаторы и другие объекты интеллектуальной собственности, защищены законодательством Российской Федерации об авторском праве. Любое использование материалов без письменного согласия администрации запрещено.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                12. Контактная информация оператора
              </h2>
              <p>
                По вопросам обработки персональных данных, реализации прав субъектов персональных данных, а также по вопросам использования материалов Сайта обращайтесь:
              </p>
              <p className="mt-2">
                Email:{' '}
                <a 
                  href="mailto:ruprojectgames@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  ruprojectgames@gmail.com
                </a>
              </p>
            </section>

            <div className="pt-4 border-t border-border">
              <p className="text-sm">
                Дата последнего обновления: 29 октября 2025 года
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Настоящая Политика конфиденциальности разработана в соответствии с требованиями Федерального закона от 27.07.2006 №152-ФЗ (ред. от 24.06.2025) «О персональных данных».
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;