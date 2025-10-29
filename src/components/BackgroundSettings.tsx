import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  {
    name: "Тёмный градиент",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    description: "Самый сложен",
  },
  {
    name: "Синий океан",
    value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
    description: "Отменный",
  },
  {
    name: "Закат",
    value: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)",
    description: "Закат",
  },
  {
    name: "Лес",
    value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)",
    description: "Лес",
  },
  {
    name: "Огненный",
    value: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
    description: "Ответный",
  },
  {
    name: "Ночное небо",
    value: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
    description: "Ночное небо",
  },
];

// Функция для применения фона
const applyBackground = (background: string) => {
  console.log("Применение фона:", background);

  // Попробуем разные элементы
  const elements = [
    document.body,
    document.querySelector("main"),
    document.querySelector("#root"),
    document.querySelector(".app"),
    document.querySelector(".layout"),
  ];

  elements.forEach((element) => {
    if (element && element instanceof HTMLElement) {
      if (background.includes("url(")) {
        element.style.background = background;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
        element.style.backgroundAttachment = "fixed";
      } else {
        element.style.background = background;
      }
      console.log("Фон применен к:", element);
    }
  });
};

// Функция для сброса фона
const resetBackground = () => {
  const elements = [
    document.body,
    document.querySelector("main"),
    document.querySelector("#root"),
    document.querySelector(".app"),
    document.querySelector(".layout"),
  ];

  elements.forEach((element) => {
    if (element && element instanceof HTMLElement) {
      element.style.background = "";
      element.style.backgroundSize = "";
      element.style.backgroundPosition = "";
      element.style.backgroundAttachment = "";
    }
  });
};

export default function BackgroundSettings({
  open,
  onOpenChange,
}: BackgroundSettingsProps) {
  const [customGradient, setCustomGradient] = useState(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Загрузка сохраненных настроек при открытии
  useEffect(() => {
    if (open) {
      const savedBackground = localStorage.getItem("app_background");
      const savedImage = localStorage.getItem("app_background_image");

      if (savedBackground) {
        applyBackground(savedBackground);
      } else if (savedImage) {
        applyBackground(`url(${savedImage})`);
      }
    }
  }, [open]);

  const applyPresetBackground = (background: string, name: string) => {
    console.log("Выбран пресет:", name, background);
    localStorage.setItem("app_background", background);
    localStorage.removeItem("app_background_image");
    applyBackground(background);
  };

  const applyCustomGradient = () => {
    if (customGradient.trim()) {
      console.log("Применение кастомного градиента:", customGradient);
      localStorage.setItem("app_background", customGradient);
      localStorage.removeItem("app_background_image");
      applyBackground(customGradient);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("Файл выбран:", file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (imageUrl) {
          localStorage.setItem("app_background_image", imageUrl);
          localStorage.removeItem("app_background");
          applyBackground(`url(${imageUrl}) center/cover fixed`);
          console.log("Изображение применено");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAllBackgrounds = () => {
    localStorage.removeItem("app_background");
    localStorage.removeItem("app_background_image");
    resetBackground();
    setSelectedFile(null);
    console.log("Все фоны сброшены");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Настройки фона
          </DialogTitle>
          <DialogDescription>
            Выберите готовый фон, создайте свой градиент или загрузите
            изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Готовые фоны */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Готовые фоны</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_BACKGROUNDS.map((bg, index) => (
                <Card
                  key={index}
                  className="cursor-pointer border-2 hover:border-blue-500 transition-colors"
                  onClick={() => applyPresetBackground(bg.value, bg.name)}
                >
                  <CardContent className="p-3">
                    <div
                      className="w-full h-20 rounded-md mb-2"
                      style={{ background: bg.value }}
                    />
                    <div>
                      <p className="font-medium">{bg.name}</p>
                      <p className="text-sm text-gray-600">{bg.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Свой градиент */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Свой градиент</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={customGradient}
                  onChange={(e) => setCustomGradient(e.target.value)}
                  placeholder="linear-gradient(135deg, #color1 0%, #color2 100%)"
                  className="flex-1"
                />
                <Button onClick={applyCustomGradient}>Применить</Button>
              </div>
              <div
                className="w-full h-20 rounded-md border"
                style={{ background: customGradient }}
              />
            </div>
          </div>

          {/* Загрузка изображения */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Загрузить изображение
            </h3>
            <div className="space-y-3">
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Выбран файл: {selectedFile.name}
                </p>
              )}
              <Button
                variant="outline"
                onClick={resetAllBackgrounds}
                className="w-full"
              >
                Сбросить фон
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
