// src/components/PrivacyPolicy.jsx
import React from 'react';
import { Box, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

const PrivacyPolicy = () => {
  return (
    <Box p={5}>
      <Heading as="h2" size="xl" mb={4}>
        Maxfiylik siyosati
      </Heading>
      <Text mb={2}><strong>Oxirgi yangilangan:</strong> 14.10.2024</Text>

      <List spacing={3} mt={4}>
        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>1. Umumiy ko‘rinish</strong>
          <Text>
            SBP QRPay da biz sizning maxfiyligingizni himoya qilishga sodiqmiz. Ushbu Maxfiylik siyosati sizning ma'lumotlaringizni qanday yig'ishimiz, ishlatishimiz va saqlashimizni tushuntiradi.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>2. Biz to'playdigan ma'lumotlar</strong>
          <Text>
            Biz quyidagi turdagi ma'lumotlarni yig'amiz:
          </Text>
          <List styleType="disc" pl={5} mt={2}>
            <ListItem>Kompaniya tafsilotlari: Kompaniya nomlari, soliq identifikatsiya raqamlari (INN) va sotuvchi bilan bog'lanish ma'lumotlari kabi ma'lumotlar.</ListItem>
            <ListItem>Tranzaksiya ma'lumotlari: to'lov summalari, to'lov usullari va to'lov summalariga oid statistik ma'lumotlar.</ListItem>
            <ListItem>Ilovadan foydalanish maʼlumotlari: Foydalanuvchilarning ilova bilan qanday aloqada boʻlishlari, jumladan login va QR yaratish faoliyati haqida maʼlumot.</ListItem>
          </List>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>3. Ma'lumotlarni almashish</strong>
          <Text>
            Ha, biz sizning maʼlumotlaringizni toʻlovlarni qayta ishlash uchun foydalanayotgan Rossiya toʻlov tizimlari kabi uchinchi tomon xizmat koʻrsatuvchi provayderlari bilan baham koʻrishimiz mumkin. Ular o'zlarining ma'lumotlar maxfiyligi amaliyotiga ega va ma'lumotlar bazalarida to'lov bilan bog'liq ma'lumotlarni saqlash uchun javobgardirlar.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>4. Ma'lumotlarni saqlash</strong>
          <Text>
            Biz to'plagan ma'lumotlar bizning xavfsiz ma'lumotlar bazalarimizda saqlanadi. Rossiya toʻlov tizimlari bilan baham koʻrilgan maʼlumotlar ham ularning tegishli xavfsiz tizimlarida saqlanadi. Biz barcha saqlash tizimlari ma'lumotlarni himoya qilish qoidalariga muvofiqligini va ruxsatsiz kirishdan himoyalanganligini ta'minlash uchun choralar ko'ramiz.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>5. Ma'lumotlar xavfsizligi</strong>
          <Text>
            Ma'lumotlaringizni ruxsatsiz kirish yoki oshkor qilishdan himoya qilish uchun biz sanoat standartidagi shifrlash va kirishni boshqarish vositalaridan foydalanamiz. Barcha tranzaktsiyalar xavfsiz tarzda qayta ishlanadi va biz tizimimizni zaifliklar uchun doimiy ravishda kuzatib boramiz.
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>6. Foydalanuvchi huquqlari</strong>
          <Text>
            Foydalanuvchilar o'zlarining shaxsiy ma'lumotlariga kirishni talab qilish yoki ma'lumotlarini o'chirishni so'rash huquqiga ega. Bunday so'rovlar Sfera yechimlari orqali bizning qo'llab-quvvatlash guruhimizga yuborilishi kerak
          </Text>
        </ListItem>

        <ListItem>
          <ListIcon as={LockIcon} color="blue.500" />
          <strong>7. Maxfiylik siyosatiga yangilanishlar</strong>
          <Text>
            Bu siyosat vaqti-vaqti bilan yangilanishi mumkin. Biz foydalanuvchilarni har qanday muhim o'zgarishlar haqida xabardor qilamiz va yangilanishlardan keyin xizmatdan foydalanishni davom ettirish sizning qayta ko'rib chiqilgan siyosatni qabul qilganingizni anglatadi.
          </Text>
        </ListItem>
      </List>
    </Box>
  );
};

export default PrivacyPolicy;
