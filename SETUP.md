# Инструкции по настройке и запуску

## Быстрый старт

### 1. Установка зависимостей

**Бэкенд (Django):**
```bash
pip install -r requirements.txt
```

**Фронтенд (Next.js):**
```bash
cd frontend
npm install
```

### 2. Настройка базы данных

```bash
# Применение миграций
python manage.py migrate

# Создание суперпользователя (опционально)
python manage.py createsuperuser
```

### 3. Запуск серверов

**Вариант 1: Автоматический запуск**
```bash
# Windows
start_dev.bat

# Linux/Mac
chmod +x start_dev.sh
./start_dev.sh
```

**Вариант 2: Ручной запуск**

Терминал 1 (Django):
```bash
python manage.py runserver
```

Терминал 2 (Next.js):
```bash
cd frontend
npm run dev
```

### 4. Проверка работы

- **Бэкенд:** http://localhost:8000
- **Фронтенд:** http://localhost:3000
- **Админ панель:** http://localhost:8000/admin/
- **API:** http://localhost:8000/api/

### 5. Тестирование API

```bash
python test_api.py
```

## Добавление тестовых данных

### Через админ панель:
1. Откройте http://localhost:8000/admin/
2. Войдите с учетными данными суперпользователя
3. Добавьте данные в разделы:
   - Categories (Категории)
   - News (Новости)
   - Leaders (Лидеры)
   - Debts (Долги)
   - Guides (Гайды)
   - Partners (Партнеры)

### Через Django shell:
```bash
python manage.py shell
```

```python
from news_app.models import *

# Создание категории
category = Category.objects.create(name="Бизнес", slug="biznes")

# Создание новости
news = News.objects.create()
news_translation = NewsTranslation.objects.create(
    news=news,
    lang='uz',
    title='Тестовая новость',
    short_title='Тест',
    description='Описание тестовой новости',
    short_description='Короткое описание',
    category=category,
    image='path/to/image.jpg'
)
```

## Возможные проблемы

### 1. Ошибка CORS
**Проблема:** Фронтенд не может подключиться к бэкенду
**Решение:** Проверьте настройки CORS в `gosnews/settings.py`

### 2. Ошибка 404 на API
**Проблема:** API endpoints не найдены
**Решение:** Убедитесь, что в `gosnews/urls.py` добавлен путь к API

### 3. Ошибка базы данных
**Проблема:** Ошибки миграций
**Решение:** 
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Фронтенд не загружает данные
**Проблема:** API возвращает пустые данные
**Решение:** 
1. Проверьте, что в базе есть данные
2. Проверьте URL API в `frontend/src/lib/api.ts`
3. Проверьте консоль браузера на ошибки

## Структура API

### Основные endpoints:
- `GET /api/home/` - Все данные для главной страницы
- `GET /api/news/` - Список новостей с пагинацией
- `GET /api/news/{id}/detail/` - Детали конкретной новости
- `GET /api/leaders/` - Список лидеров регионов
- `GET /api/debts/` - Список долгов
- `GET /api/guides/` - Список гайдов
- `GET /api/partners/` - Список партнеров
- `GET /api/categories/` - Список категорий

### Параметры запросов:
- `lang` - Язык (uz, ru, kaa)
- `page` - Номер страницы
- `search` - Поиск по тексту
- `category__slug` - Фильтр по категории

## Разработка

### Добавление новых полей в модели:
1. Измените модель в `news_app/models.py`
2. Создайте миграцию: `python manage.py makemigrations`
3. Примените миграцию: `python manage.py migrate`
4. Обновите сериализатор в `news_app/serializers.py`

### Добавление новых API endpoints:
1. Создайте ViewSet в `news_app/views.py`
2. Добавьте в `news_app/api.py`
3. Обновите типы в `frontend/src/lib/api.ts`
4. Создайте хук в `frontend/src/hooks/useApi.ts`

## Производство

Для развертывания в продакшене:

1. **Настройте переменные окружения:**
   ```bash
   export DEBUG=False
   export SECRET_KEY=your-secret-key
   export DATABASE_URL=your-database-url
   ```

2. **Настройте статические файлы:**
   ```bash
   python manage.py collectstatic
   ```

3. **Настройте CORS для конкретных доменов:**
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://yourdomain.com",
   ]
   CORS_ALLOW_ALL_ORIGINS = False
   ```

4. **Используйте production базу данных** (PostgreSQL, MySQL)

5. **Настройте веб-сервер** (Nginx + Gunicorn)




