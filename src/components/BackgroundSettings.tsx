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
import Icon from "@/components/ui/icon";

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  {
    name: "Темный градиент",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Синий океан",
    value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
  },
  {
    name: "Закат",
    value: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)",
  },
  {
    name: "Огненный",
    value: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
  },
  { name: "Лес", value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)" },
  {
    name: "Ночное небо",
    value: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  },
];

export default function BackgroundSettings({
  open,
  onOpenChange,
}: BackgroundSettingsProps) {
  const [customBackground, setCustomBackground] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("custom_background");
    if (saved) {
      setCustomBackground(saved);
      document.body.style.background = saved; // Сразу применяем сохранённый градиент
    }
    const savedImage = localStorage.getItem("background_image");
    if (savedImage) {
      setUploadedImage(savedImage);
      document.body.style.background = `url(${savedImage}) center/cover fixed`; // Применяем сохранённое изображение
    }
  }, [open]);

  const applyPreset = (value: string) => {
    localStorage.setItem("custom_background", value);
    localStorage.removeItem("background_image");
    document.body.style.background = value;
    setCustomBackground(value);
    setUploadedImage(null);
  };

  const applyCustom = () => {
    if (customBackground.trim()) {
      // Проверяем, что строка не пустая
      localStorage.setItem("custom_background", customBackground);
      localStorage.removeItem("background_image");
      document.body.style.background = customBackground;
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          // Проверяем, что результат не пустой
          localStorage.setItem("background_image", result);
          localStorage.removeItem("custom_background");
          document.body.style.background = `url(${result}) center/cover fixed`;
          setUploadedImage(result);
          setCustomBackground("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    localStorage.removeItem("custom_background");
    localStorage.removeItem("background_image");
    document.body.style.background = ""; // Очищаем стиль фона
    setCustomBackground("");
    setUploadedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Palette" size={24} />
            Настройки фона
          </DialogTitle>
          <DialogDescription>
            Выберите готовый фон, создайте свой градиент или загрузите
            изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ... остальной код интерфейса без изменений */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
