import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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
              Пользовательское соглашение
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Общие положения
              </h2>
              <p>
                Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между администрацией сайта ruprojectgames.ru (далее — Сайт) и пользователями Сайта.
              </p>
              <p className="mt-2">
                Используя Сайт, вы соглашаетесь с условиями настоящего Соглашения в полном объёме. Если вы не согласны с какими-либо условиями, пожалуйста, не используйте Сайт.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Предмет соглашения
              </h2>
              <p>Сайт предоставляет пользователям доступ к следующим услугам:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Скачивание русификаторов для модов игр TES V SKYRIM и The Witcher Wild Hunt</li>
                <li>Получение инструкций по установке русификаторов</li>
                <li>Доступ к новостям и обновлениям проекта</li>
                <li>Возможность поддержать проект через донаты</li>
                <li>Подписка на уведомления о новых материалах</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Регистрация и учётная запись
              </h2>
              <p>
                Для доступа к некоторым функциям Сайта требуется регистрация. При регистрации вы обязуетесь:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Предоставить достоверную и актуальную информацию</li>
                <li>Обеспечить конфиденциальность пароля от вашей учётной записи</li>
                <li>Немедленно уведомить администрацию о любом несанкционированном доступе к вашему аккаунту</li>
                <li>Не передавать свою учётную запись третьим лицам</li>
              </ul>
              <p className="mt-2">
                Вы несёте полную ответственность за все действия, совершённые под вашей учётной записью.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Права и обязанности пользователя
              </h2>
              <p className="font-semibold text-foreground">Пользователь имеет право:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Скачивать и использовать русификаторы для личных некоммерческих целей</li>
                <li>Обращаться в службу поддержки по вопросам работы Сайта</li>
                <li>Подписаться на уведомления о новых материалах</li>
                <li>Отписаться от уведомлений в любой момент</li>
                <li>Удалить свою учётную запись</li>
              </ul>

              <p className="font-semibold text-foreground mt-4">Пользователь обязуется:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Не использовать материалы Сайта в коммерческих целях без письменного разрешения</li>
                <li>Не распространять русификаторы от своего имени</li>
                <li>Соблюдать авторские права и не нарушать права третьих лиц</li>
                <li>Не предпринимать действий, направленных на нарушение работы Сайта</li>
                <li>Не использовать автоматизированные средства для массового скачивания</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Интеллектуальная собственность
              </h2>
              <p className="font-semibold text-red-600">
                Копирование и дальнейшее распространение материалов с сайта ruprojectgames.ru без разрешения администрации сайта запрещено.
              </p>
              <p className="mt-2">
                Все русификаторы, тексты, изображения и другие материалы, размещённые на Сайте, являются объектами интеллектуальной собственности и защищены законодательством Российской Федерации об авторском праве.
              </p>
              <p className="mt-2">
                Пользователь может использовать русификаторы исключительно для личных некоммерческих целей. Любое коммерческое использование, распространение, модификация материалов Сайта без письменного согласия администрации запрещены.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Ограничение ответственности
              </h2>
              <p>
                Администрация Сайта не несёт ответственности за:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Возможные неполадки в работе игр после установки русификаторов</li>
                <li>Несовместимость русификаторов с определёнными версиями модов</li>
                <li>Потерю данных пользователя при использовании материалов Сайта</li>
                <li>Временную недоступность Сайта по техническим причинам</li>
                <li>Действия третьих лиц, направленные на нарушение работы Сайта</li>
              </ul>
              <p className="mt-2">
                Все материалы предоставляются на условиях "как есть" (as is) без каких-либо гарантий.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Уведомления и подписка
              </h2>
              <p>
                При регистрации на Сайте вы можете подписаться на email-уведомления о новых русификаторах и обновлениях. 
              </p>
              <p className="mt-2 font-semibold text-foreground">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Управлять настройками подписки в личном кабинете</li>
                <li>Отписаться от уведомлений по ссылке в любом письме</li>
                <li>Отписаться, отправив запрос на ruprojectgames@gmail.com</li>
              </ul>
              <p className="mt-2">
                Мы не отправляем спам и не передаём ваш email третьим лицам. Уведомления отправляются только о важных обновлениях проекта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Донаты и поддержка проекта
              </h2>
              <p>
                Пользователи могут добровольно поддержать проект финансово (донаты). Все донаты являются добровольными пожертвованиями и не подлежат возврату.
              </p>
              <p className="mt-2">
                Донаты не предоставляют никаких дополнительных прав или привилегий, за исключением отображения специального значка "Донатер" в профиле пользователя.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Изменение условий соглашения
              </h2>
              <p>
                Администрация Сайта оставляет за собой право в любое время изменять условия настоящего Соглашения. Новая редакция Соглашения вступает в силу с момента её размещения на Сайте.
              </p>
              <p className="mt-2">
                Продолжение использования Сайта после внесения изменений означает ваше согласие с новыми условиями.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Прекращение доступа
              </h2>
              <p>
                Администрация Сайта вправе заблокировать или удалить учётную запись пользователя без предварительного уведомления в случае:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Нарушения условий настоящего Соглашения</li>
                <li>Предоставления недостоверной информации при регистрации</li>
                <li>Попыток несанкционированного доступа к Сайту</li>
                <li>Распространения материалов Сайта в нарушение авторских прав</li>
                <li>Других действий, наносящих ущерб Сайту или другим пользователям</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11. Разрешение споров
              </h2>
              <p>
                Все споры и разногласия, возникающие в связи с настоящим Соглашением, разрешаются путём переговоров. При невозможности достижения согласия спор подлежит рассмотрению в суде по месту нахождения администрации Сайта в соответствии с законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                12. Контактная информация
              </h2>
              <p>
                По всем вопросам, связанным с настоящим Соглашением, обращайтесь:
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
                Принимая условия настоящего Соглашения, вы подтверждаете, что ознакомились с{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Политикой конфиденциальности
                </a>
                {' '}и согласны с её условиями.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
