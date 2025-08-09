from django.utils.translation import gettext_lazy as _
from django.utils.translation.trans_real import LANG_INFO

# Добавляем каракалпакский язык в LANG_INFO
LANG_INFO['kaa'] = {
    'bidi': False,  # Направление письма слева направо
    'code': 'kaa',
    'name': 'Karakalpak',
    'name_local': 'Qaraqalpaqsha',
}