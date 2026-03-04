// Збережи як seedFirestore.mjs в корені проекту, потім: node seedFirestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDO6M25Gd85lCQKsXEofQLeT5hHdgI98XA',
  authDomain: 'unity-volunteer-eb328.firebaseapp.com',
  projectId: 'unity-volunteer-eb328',
  storageBucket: 'unity-volunteer-eb328.firebasestorage.app',
  messagingSenderId: '681346490743',
  appId: '1:681346490743:web:157dbad2158a2ca9344172',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const data = [
  { id:'count-0',  status:'active',    date:'20.03.2026',   dateGroup:'березень', type:'екологія',           place:'Київ',   volunteers:30, title:'Еко-толока: Парк Перемоги',                      description:'Разом прибираємо та озеленюємо парк Перемоги. Принеси рукавиці та гарний настрій — решту підготуємо ми!' },
  { id:'count-1',  status:'active',    date:'25.03.2026',   dateGroup:'березень', type:'допомога тваринам',  place:'Київ',   volunteers:10, title:"Допомога притулку 'Сіріус'",                     description:'Допомагаємо найбільшому притулку для тварин: годуємо, вигулюємо та спілкуємося з пухнастими мешканцями.' },
  { id:'count-2',  status:'active',    date:'Квітень 2026', dateGroup:'квітень',  type:'соціальна підтримка',place:'Львів',  volunteers:5,  title:'IT-курси для літніх людей',                      description:'Навчаємо людей старшого віку користуватися смартфонами, інтернетом та держпослугами онлайн.' },
  { id:'count-3',  status:'completed', date:'10.02.2026',   dateGroup:'лютий',    type:'соціальна підтримка',place:'Харків', volunteers:0,  title:'Збір теплого одягу',                             description:'Зібрали та передали понад 200 одиниць теплого одягу для переселенців і малозабезпечених родин.' },
  { id:'count-4',  status:'active',    date:'05.04.2026',   dateGroup:'квітень',  type:'екологія',           place:'Київ',   volunteers:25, title:'Прибирання узбережжя Дніпра',                    description:'Велика еко-акція з прибирання берегової лінії Дніпра. Забезпечуємо інвентар, чай і сертифікати для учасників.' },
  { id:'count-5',  status:'active',    date:'08.04.2026',   dateGroup:'квітень',  type:'соціальна підтримка',place:'Львів',  volunteers:15, title:'Майстер-клас з першої допомоги',                 description:'Навчаємо надавати першу медичну допомогу: зупинка кровотечі, серцево-легенева реанімація, допомога при опіках.' },
  { id:'count-6',  status:'active',    date:'12.04.2026',   dateGroup:'квітень',  type:'допомога тваринам',  place:'Одеса',  volunteers:8,  title:'Вигул собак з притулку',                         description:'Щотижневий вигул собак з міського притулку. Тваринам потрібне спілкування та рух — будемо раді кожному волонтеру!' },
  { id:'count-7',  status:'active',    date:'19.04.2026',   dateGroup:'квітень',  type:'екологія',           place:'Київ',   volunteers:40, title:'Посадка дерев у Голосіївському парку',           description:'Разом висадимо 500 дерев у Голосіївському парку. Долучайся — кожне дерево це внесок у майбутнє нашого міста.' },
  { id:'count-8',  status:'active',    date:'22.04.2026',   dateGroup:'квітень',  type:'соціальна підтримка',place:'Харків', volunteers:12, title:'Допомога дітям з інвалідністю',                  description:'Організовуємо ігрові та творчі заняття для дітей з особливими потребами. Потрібні люди з терпінням і великим серцем.' },
  { id:'count-9',  status:'active',    date:'26.04.2026',   dateGroup:'квітень',  type:'допомога тваринам',  place:'Дніпро', volunteers:6,  title:'Стерилізація безпритульних котів',               description:'Допомагаємо ветеринарній клініці з програмою стерилізації безпритульних котів. Потрібні волонтери для відлову та транспортування.' },
  { id:'count-10', status:'active',    date:'03.05.2026',   dateGroup:'травень',  type:'екологія',           place:'Київ',   volunteers:20, title:'Суботник у дворах Подолу',                       description:'Прибираємо і облаштовуємо двори історичного Подолу: висаджуємо квіти, фарбуємо лавки, встановлюємо нові урни.' },
  { id:'count-11', status:'active',    date:'06.05.2026',   dateGroup:'травень',  type:'соціальна підтримка',place:'Львів',  volunteers:7,  title:'Безкоштовні уроки англійської для переселенців', description:'Шукаємо волонтерів-викладачів для безкоштовних уроків англійської мови для внутрішньо переміщених осіб.' },
  { id:'count-12', status:'completed', date:'14.01.2026',   dateGroup:'січень',   type:'соціальна підтримка',place:'Одеса',  volunteers:0,  title:'Роздача їжі для бездомних',                      description:'Роздали понад 300 порцій гарячої їжі та необхідних речей для бездомних людей у зимовий період.' },
  { id:'count-13', status:'completed', date:'28.02.2026',   dateGroup:'лютий',    type:'екологія',           place:'Харків', volunteers:0,  title:'Прибирання лісу після пожежі',                   description:'Разом з лісництвом очистили 3 гектари лісу від наслідків пожежі та висадили перші саджанці для відновлення.' },
];

async function seed() {
  console.log('⏳ Завантаження...');
  for (const item of data) {
    await setDoc(doc(collection(db, 'initiatives'), item.id), item);
    console.log(`✅ ${item.id}: ${item.title}`);
  }
  console.log('\n🎉 Готово!');
  process.exit(0);
}

seed().catch(e => { console.error('❌', e); process.exit(1); });