from django.shortcuts import render
from django.http import FileResponse
import os
from django.conf import settings

def index(request):
    # Serve React's build index.html from staticfiles
    file_path = os.path.join(settings.STATIC_ROOT, 'index.html')
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    return render(request, '404.html', status=404)