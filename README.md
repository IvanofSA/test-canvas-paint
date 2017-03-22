#Установка

*При первой установке следует установить gulp глобально для удобства работы*

`sudo npm i -g gulp`

*Все зависимости прописаны в package.json-файле*

`npm i`

#Использование

`build:symfony` - компиляция js/css/images/static с учетом структуры symfony-проекта

`serve:symfony` - создание билда для symfony-проекта + вотчер изменений

`dist` - таск для CI (codeship), отличается от build:symfony опцией сжатия картинок

`build:local` - старый dist, компиляция js/css/images/static + pug в локальную папку public

`serve:local` - старый serve, создание локального билда + вотчер изменений

В случае локальной сборки сайт будет доступен по адресу http://localhost:3000/ (или по иному, указанному в секции Access URLs лога Gulp)


____