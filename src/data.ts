import { Restaurant } from './types';

const categories = ['粤菜', '川湘菜', '日韩料理', '西式快餐', '奶茶甜品', '面馆', '烧烤', '东南亚菜'];
const tagsPool = ['份量大', '性价比高', '环境好', '上菜快', '地道', '适合聚餐', '一个人吃', '网红打卡', '老字号', '辣', '清淡'];
const scenesPool = ['一个人吃', '朋友约饭', '情侣约会', '深夜夜宵', '生日聚餐', '快速解决'];

const generateRestaurants = (): Restaurant[] => {
  const restaurants: Restaurant[] = [];
  const names = [
    "A大南门肠粉", "B大小吃街烧鹅", "C大逸仙路小笼包", "D大康乐村麻辣烫", "E大下渡路日料", 
    "联盟中心西餐", "地铁口网红奶茶", "A大北门大排档", "B大瑞康路川菜", "C大五乐台湘菜",
    "学子书店咖啡", "联盟后街糖水", "D大食堂二楼", "E大北校园凉茶", "海珠新村火锅",
    "金碧花园早茶", "联盟私房菜", "半岛豪庭粤菜", "珠影星光城韩料", "客村丽影广场泰餐",
    "A大西门面馆", "B大新港西路麦当劳", "C大下渡路肯德基", "D大滨江路必胜客", "E大鹭江星巴克",
    "联盟码头海鲜", "康乐村猪脚饭", "大江苑牛杂", "叠景路烤鱼", "合生广场披萨",
    "A大正门煎饼果子", "B大南门外鸡蛋仔", "C大西门螺蛳粉", "D大北门烤冷面", "E大东门手抓饼",
    "逸仙路隆江猪脚饭", "联盟潮汕牛肉火锅", "下渡路过桥米线", "滨江东路精致法餐", "鹭江路地中海餐厅",
    "A大南校园咖啡馆", "B大新港西路书吧", "C大康乐村重庆小面", "D大下渡路兰州拉面", "E大滨江路东北饺子",
    "鹭江路新疆大盘鸡", "联盟北门砂锅粥", "瑞康路柳州螺蛳粉", "五乐台桂林米粉", "海珠新村麻辣香锅"
  ];

  for (let i = 0; i < 50; i++) {
    const category = categories[i % categories.length];
    const name = names[i] || `美食店 ${i + 1}`;
    const avgPrice = Math.floor(Math.random() * 40) + 10;
    const rating = parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1));
    const distance = Math.floor(Math.random() * 800) + 50;
    
    // Generate relevant keyword for picsum - using specific food keywords
    const keywordMap: Record<string, string> = {
      '粤菜': 'dimsum',
      '川湘菜': 'spicy',
      '日韩料理': 'sushi',
      '西式快餐': 'burger',
      '奶茶甜品': 'dessert',
      '面馆': 'noodles',
      '烧烤': 'bbq',
      '东南亚菜': 'thai'
    };
    const foodKeyword = keywordMap[category] || 'food';
    const seed = `${foodKeyword}-${i}-${Math.random().toString(36).substring(7)}`;

    const dishNames: Record<string, string[]> = {
      '粤菜': ['水晶虾饺', '干炒牛河', '蜜汁叉烧', '白灼菜心'],
      '川湘菜': ['麻婆豆腐', '剁椒鱼头', '小炒肉', '水煮肉片'],
      '日韩料理': ['三文鱼刺身', '石锅拌饭', '照烧鸡排', '豚骨拉面'],
      '西式快餐': ['经典芝士堡', '香脆炸鸡', '意式腊肠披萨', '薯条'],
      '奶茶甜品': ['珍珠奶茶', '杨枝甘露', '舒芙蕾', '提拉米苏'],
      '面馆': ['招牌牛肉面', '老北京炸酱面', '酸辣粉', '重庆小面'],
      '烧烤': ['炭烤羊肉串', '烤生蚝', '蒜香茄子', '烤鸡翅'],
      '东南亚菜': ['冬阴功汤', '菠萝炒饭', '泰式青咖喱', '越式河粉']
    };

    const currentDishNames = dishNames[category] || ['招牌菜A', '特色菜B'];

    restaurants.push({
      id: `res-${i + 1}`,
      name: name,
      category: category,
      location: `距高校联盟中心 ${distance}m`,
      distanceValue: distance,
      avgPrice: avgPrice,
      rating: rating,
      tags: [tagsPool[i % tagsPool.length], tagsPool[(i + 5) % tagsPool.length]],
      scenes: [scenesPool[i % scenesPool.length], scenesPool[(i + 2) % scenesPool.length]],
      hours: "08:00~22:00",
      signatureDishes: [
        { 
          name: currentDishNames[i % currentDishNames.length], 
          price: Math.floor(avgPrice * 0.8), 
          image: `https://picsum.photos/seed/${seed}-dish1/400/300`,
          recommendationRate: Math.floor(Math.random() * 20) + 80 // 80-100%
        },
        { 
          name: currentDishNames[(i + 1) % currentDishNames.length], 
          price: Math.floor(avgPrice * 0.6), 
          image: `https://picsum.photos/seed/${seed}-dish2/400/300`,
          recommendationRate: Math.floor(Math.random() * 30) + 70 // 70-100%
        }
      ],
      image: `https://picsum.photos/seed/${seed}-main/800/600`,
      reviews: [
        { 
          id: `rev-${i}-1`, 
          user: `学生${i}`, 
          avatar: `https://i.pravatar.cc/150?u=${i}`, 
          rating: Math.floor(rating), 
          content: "味道不错，经常来吃。环境也挺好的，适合和朋友一起来。", 
          date: "2024-03-12",
          images: [`https://picsum.photos/seed/${seed}-rev1/400/300`]
        },
        { 
          id: `rev-${i}-2`, 
          user: `美食达人${i}`, 
          avatar: `https://i.pravatar.cc/150?u=${i+100}`, 
          rating: 5, 
          content: "强烈推荐这家的招牌菜，口感层次分明，价格也很公道。", 
          date: "2024-03-10",
          images: [`https://picsum.photos/seed/${seed}-rev2/400/300`, `https://picsum.photos/seed/${seed}-rev3/400/300`]
        }
      ],
      coordinates: { 
        x: Math.floor(Math.random() * 300) + 50, 
        y: Math.floor(Math.random() * 200) + 50 
      },
      phone: `138-0000-${(i + 1000).toString()}`,
      address: `高校联盟城新港西路 ${i + 100} 号`
    });
  }
  return restaurants;
};

export const RESTAURANTS: Restaurant[] = generateRestaurants();

export const UNIVERSITIES = [
  { name: "A大学", x: 100, y: 100 },
  { name: "B大学", x: 250, y: 80 },
  { name: "C大学", x: 320, y: 180 },
  { name: "D大学", x: 150, y: 220 },
  { name: "E大学", x: 50, y: 180 }
];
