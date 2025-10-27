import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const modsList: any[] = [];

const newsList: any[] = [];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');

  const filteredMods = modsList.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         mod.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || mod.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">ruprojectgames</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
                Главная
              </a>
              <a href="#mods" className="text-foreground hover:text-primary transition-colors font-medium">
                Русификаторы
              </a>
              <a href="#instructions" className="text-foreground hover:text-primary transition-colors font-medium">
                Инструкции
              </a>
              <a href="#news" className="text-foreground hover:text-primary transition-colors font-medium">
                Новости
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section id="home" className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-foreground">
            Русификация модов для RPG
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            База переводов для модов TES V SKYRIM и The Witcher Wild Hunt
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2" onClick={() => document.getElementById('mods')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Download" size={20} />
              Скачать русификатор
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('instructions')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="BookOpen" size={20} />
              Инструкции
            </Button>
          </div>
        </div>
      </section>

      <section id="mods" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию или автору..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedGame} onValueChange={setSelectedGame} className="w-auto">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="skyrim">TES V SKYRIM</TabsTrigger>
                  <TabsTrigger value="witcher">The Witcher Wild Hunt</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              {filteredMods.length === 0 ? (
                {filteredMods.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="FolderOpen" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-lg">
                      Здесь будут отображаться все доступные переводы модов
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {filteredMods.map((mod) => (
                      <Card key={mod.id} className="hover:shadow-lg transition-shadow hover:border-primary/50">
                        <CardHeader>
                          <div className="mb-2">
                            <Badge variant={mod.game === 'skyrim' ? 'default' : 'secondary'}>
                              {mod.game === 'skyrim' ? 'TES V SKYRIM' : 'The Witcher Wild Hunt'}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{mod.title}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                              <Icon name="User" size={14} />
                              <span>{mod.author}</span>
                              <span className="text-muted-foreground/50">•</span>
                              <span>{new Date(mod.date).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{mod.description}</p>
                          <div className="flex gap-2">
                            <Button className="flex-1 gap-2" onClick={() => document.getElementById('instructions')?.scrollIntoView({ behavior: 'smooth' })}>
                              <Icon name="BookOpen" size={16} />
                              Инструкция
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      <section id="instructions" className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading font-bold mb-8 text-foreground text-center">
            Как установить русификатор?
          </h3>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="skyrim" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-heading hover:text-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="Swords" size={24} className="text-primary" />
                    <span>TES V SKYRIM</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Скачайте архив с русификатором</h4>
                      <p className="text-muted-foreground">Нажмите кнопку "Скачать русификатор" у выбранного мода</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Откройте папку с игрой</h4>
                      <p className="text-muted-foreground">Обычно находится по пути: C:\Program Files (x86)\Steam\steamapps\common\Skyrim</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Распакуйте файлы из архива</h4>
                      <p className="text-muted-foreground">Скопируйте содержимое архива в папку Data с заменой файлов</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="witcher" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-heading hover:text-primary">
                  <div className="flex items-center gap-3">
                    <Icon name="Flame" size={24} className="text-secondary" />
                    <span>The Witcher Wild Hunt</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Скачайте русификатор мода</h4>
                      <p className="text-muted-foreground">Загрузите файл перевода для нужного мода</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Найдите папку Mods</h4>
                      <p className="text-muted-foreground">Откройте: Documents\The Witcher 3\Mods</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Установите перевод</h4>
                      <p className="text-muted-foreground">Скопируйте папку с русификацией в директорию Mods</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="news" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading font-bold mb-8 text-foreground text-center">
            Новости
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {newsList.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(news.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{news.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Gamepad2" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">ruprojectgames</span>
          </div>
          <p className="text-muted-foreground mb-2">
            База переводов модов для RPG игр
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 ruprojectgames. Все переводы распространяются бесплатно
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;