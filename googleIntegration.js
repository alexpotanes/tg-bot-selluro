export async function googleIntegration(sheet, dataTask, chatId, name, username) {
  const {
    articles,
    photo,
    fashion,
    product,
    references,
    hair,
    race,
    productImg,
    acceptResult,
    acceptQuantity,
  } = dataTask;
  const price = (articles * 600) + ((articles * photo) * 40);

  await sheet.addRow({
    "Отметка времени": new Date(),
    "ID ТЗ": chatId,
    "ФИО": name,
    "TgUsername": username,
    "Кол-во артикулов": articles ,
    "Кол-во фото": photo,
    "Цена": price,
    "Есть ли пожелания по фону или образу?": fashion,
    "Какой товар?": product,
    "Если есть ссылки на референсы - прикрепите.": references,
    "волосы модели": hair,
    "расса модели": race,
    "Загрузить фото  товара": productImg,
    "Я подтверждаю что мои фото сделаны качественно, текстуру видно хорошо, фон однородный.  Чем лучше исходник - тем точнее результат.": acceptResult,
    "Я осведомлен с тем, что фото и артикулы с большим кол-вом деталей, сложными принтами- не будут переданы в точности.": acceptQuantity
  });
}