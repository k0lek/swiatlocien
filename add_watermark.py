from PIL import Image, ImageDraw, ImageFont
import os
import piexif
from datetime import datetime

def add_watermark(input_path, output_path, text="© Światłocień", opacity=0.45):
    # Otwórz obraz
    image = Image.open(input_path).convert('RGBA')
    
    # Utwórz warstwę dla watermarka
    watermark = Image.new('RGBA', image.size, (0, 0, 0, 0))
    
    # Utwórz obiekt do rysowania
    draw = ImageDraw.Draw(watermark)
    
    # Ustaw czcionkę (możesz zmienić na inną)
    try:
        # Próba użycia czcionki z polskimi znakami
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 100)
    except:
        try:
            # Alternatywna czcionka
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 100)
        except:
            font = ImageFont.load_default()
    
    # Pobierz rozmiar tekstu
    text_width, text_height = draw.textsize(text, font)
    
    # Oblicz pozycję tekstu (środek obrazu)
    x = (image.width - text_width) // 2
    y = (image.height - text_height) // 2
    
    # Dodaj tekst z przezroczystością
    draw.text((x, y), text, font=font, fill=(255, 255, 255, int(255 * opacity)))
    
    # Połącz obraz z watermarkem
    watermarked = Image.alpha_composite(image, watermark)
    
    # Przygotuj dane EXIF
    exif_dict = {
        "0th": {
            piexif.ImageIFD.Artist: "Światłocień".encode('utf-8'),
            piexif.ImageIFD.Copyright: "© Światłocień - Wszelkie prawa zastrzeżone".encode('utf-8'),
            piexif.ImageIFD.Software: "Światłocień".encode('utf-8'),
            piexif.ImageIFD.DateTime: datetime.now().strftime("%Y:%m:%d %H:%M:%S").encode('utf-8'),
        },
        "Exif": {
            piexif.ExifIFD.UserComment: "Zdjęcie chronione prawem autorskim. Własność Światłocień".encode('utf-8'),
            piexif.ExifIFD.DateTimeOriginal: datetime.now().strftime("%Y:%m:%d %H:%M:%S").encode('utf-8'),
            piexif.ExifIFD.DateTimeDigitized: datetime.now().strftime("%Y:%m:%d %H:%M:%S").encode('utf-8'),
        }
    }
    
    # Konwertuj dane EXIF do formatu binarnego
    exif_bytes = piexif.dump(exif_dict)
    
    # Zapisz wynik w formacie WebP z EXIF i dobrą jakością
    watermarked.save(output_path, "WEBP", quality=85, exif=exif_bytes)

def process_directory(input_dir, output_dir):
    # Utwórz katalog wyjściowy jeśli nie istnieje
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Przetwórz wszystkie pliki w katalogu
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', ".webp")):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename.split('.')[0] + ".webp")
            
            try:
                add_watermark(input_path, output_path)
                print(f"Przetworzono: {filename}")
            except Exception as e:
                print(f"Błąd przy przetwarzaniu {filename}: {str(e)}")

if __name__ == "__main__":
    # Ścieżki do katalogów
    input_directory = "img"  # Katalog ze zdjęciami źródłowymi
    output_directory = "img_watermarked"  # Katalog na zdjęcia z watermarkem
    
    # Przetwórz wszystkie zdjęcia
    process_directory(input_directory, output_directory) 