INSTALLED_APPS = [
    ...
    'rest_framework',
    'django_filters',
    'corsheaders',
    'tickets',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # FIRST in list
    ...
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'tickets_db'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'postgres'),
        'HOST': os.environ.get('DB_HOST', 'db'),
        'PORT': '5432',
    }
}

CORS_ALLOW_ALL_ORIGINS = True  # fine for dev
LLM_API_KEY = os.environ.get('LLM_API_KEY', '')