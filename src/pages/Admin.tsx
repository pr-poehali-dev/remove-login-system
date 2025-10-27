import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  
  const [modForm, setModForm] = useState({
    title: '',
    author: '',
    game: 'skyrim',
    description: '',
    fileUrl: '',
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
  });

  const handleModSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Русификатор добавлен',
      description: `Мод "${modForm.title}" успешно опубликован`,
    });
    setModForm({ title: '', author: '', game: 'skyrim', description: '', fileUrl: '' });
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Новость опубликована',
      description: `"${newsForm.title}" добавлена в ленту`,
    });
    setNewsForm({ title: '', excerpt: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Админ-панель</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="Home" size={20} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="mods" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
            <TabsTrigger value="mods">Русификаторы</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
          </TabsList>

          <TabsContent value="mods">
            <Card>
              <CardHeader>
                <CardTitle>Добавить русификатор</CardTitle>
                <CardDescription>
                  Заполните информацию о новом переводе мода
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleModSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mod-title">Название мода</Label>
                    <Input
                      id="mod-title"
                      placeholder="Например: Immersive Armors - Полная русификация"
                      value={modForm.title}
                      onChange={(e) => setModForm({ ...modForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mod-author">Автор перевода</Label>
                    <Input
                      id="mod-author"
                      placeholder="Ваш никнейм"
                      value={modForm.author}
                      onChange={(e) => setModForm({ ...modForm, author: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mod-game">Игра</Label>
                    <Select value={modForm.game} onValueChange={(value) => setModForm({ ...modForm, game: value })}>
                      <SelectTrigger id="mod-game">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skyrim">TES V SKYRIM</SelectItem>
                        <SelectItem value="witcher">The Witcher Wild Hunt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mod-description">Описание</Label>
                    <Textarea
                      id="mod-description"
                      placeholder="Краткое описание перевода и его особенностей"
                      value={modForm.description}
                      onChange={(e) => setModForm({ ...modForm, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mod-file">Ссылка на файл</Label>
                    <Input
                      id="mod-file"
                      type="url"
                      placeholder="https://example.com/file.zip"
                      value={modForm.fileUrl}
                      onChange={(e) => setModForm({ ...modForm, fileUrl: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Загрузите файл на облачное хранилище и вставьте прямую ссылку
                    </p>
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Icon name="Plus" size={20} />
                    Опубликовать русификатор
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Добавить новость</CardTitle>
                <CardDescription>
                  Создайте новую запись в разделе новостей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Заголовок новости</Label>
                    <Input
                      id="news-title"
                      placeholder="Например: Обновление русификатора SkyUI"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="news-excerpt">Краткое описание</Label>
                    <Textarea
                      id="news-excerpt"
                      placeholder="Краткое содержание новости (1-2 предложения)"
                      value={newsForm.excerpt}
                      onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Icon name="Plus" size={20} />
                    Опубликовать новость
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
