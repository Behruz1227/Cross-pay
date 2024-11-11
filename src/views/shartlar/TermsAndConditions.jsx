// src/components/TermsAndConditions.jsx
import React from 'react';
import { Box, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const TermsAndConditions = () => {
  return (
    <Box p={5}>
      <Heading as="h2" size="xl" mb={4}>
        Shartlar (T&C)
      </Heading>
      <Text mb={2}><strong>Oxirgi yangilangan:</strong> 14/10/2024</Text>

      <List spacing={3} mt={4}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>1. Umumiy ma'lumot</strong>
          <Text>
            Ushbu hujjat SBP QRPay ilovasidan foydalanishni boshqaradi. Bizning ilovamizdan foydalanish orqali foydalanuvchilar quyidagi shartlar va shartlarga rozilik bildiradilar.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>2. Foydalanish bo'yicha ko'rsatmalar</strong>
          <Text>
            Sotuvchilar QR kodlarini faqat o'z xizmatlari yoki mahsulotlari bilan bog'liq qonuniy tranzaktsiyalar uchun yaratish uchun javobgardir. Uzrli sabablarsiz QR kodlarini yaratish qat'iyan man etiladi.
            Foydalanuvchilar barcha toʻlov tranzaksiyalari toʻgʻri bajarilishini taʼminlashi kerak va har qanday xatoliklar darhol xabar qilinishi kerak.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>3. To'lovni bekor qilish</strong>
          <Text>
            Foydalanuvchilar tranzaktsiyadan keyin 24 soat ichida to'lovni bekor qilishlari mumkin. Ushbu muddatdan keyin bekor qilish mumkin bo'lmaydi va xaridor va sotuvchi o'rtasidagi nizolarni hal qilish kerak bo'ladi.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>4. To'lovlar va to'lovlar</strong>
          <Text>
            QR toʻlov ishlab chiqarish xizmatidan foydalanish uchun sotuvchilardan oylik abonent toʻlovi olinishi mumkin. Obuna tafsilotlari, jumladan, narxlar sotuvchilar roʻyxatdan oʻtgandan soʻng ular bilan baham koʻriladi.
            To'lovlar qaytarilmaydi, biz tomonimizdagi muammolar tufayli xizmat ko'rsatishda uzilishlar yuzaga kelgan hollar bundan mustasno.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>5. Ma'lumotlarning maxfiyligi </strong>
          <Text>
            Biz Maxfiylik siyosatimizda tavsiflanganidek, foydalanuvchi ma'lumotlari, to'lov statistikasi va tranzaksiya ma'lumotlari kabi ma'lum ma'lumotlarni to'playmiz. Ushbu ilovadan foydalanish orqali foydalanuvchilar o'z ma'lumotlarini to'plash va ulardan foydalanishga rozilik bildiradilar.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>6. Mas'uliyatni cheklash </strong>
          <Text>
            SBP QRPay sotuvchilar va xaridorlar o'rtasidagi ruxsatsiz bitimlar yoki kelishmovchiliklar uchun javobgar emas. Bizning rolimiz QR-ga asoslangan to'lovlar uchun platformani taqdim etish bilan cheklangan va tranzaksiyani amalga oshirishdagi har qanday xatolar ishtirokchilarning javobgarligidir.
            Biz texnik nosozliklar, xizmat ko'rsatishdagi uzilishlar yoki ilovamizdan foydalanish natijasida yuzaga keladigan yo'qotishlar uchun javobgar emasmiz.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>7. Shartlarga o'zgartirishlar </strong>
          <Text>
            Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqini saqlab qolamiz. O'zgartirishlar ilovada e'lon qilinadi va xizmatdan doimiy foydalanish yangi shartlarni qabul qilishni anglatadi.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <strong>8. Amaldagi qonun</strong>
          <Text>
            Ushbu Shartlar va shartlar O'zbekistan qonunlari bilan tartibga solinadi, uning qonun hujjatlari ziddiyatidan qat'i nazar.
          </Text>
        </ListItem>
      </List>
    </Box>
  );
};

export default TermsAndConditions;
