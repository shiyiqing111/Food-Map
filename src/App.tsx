/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  Grid, 
  User, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronLeft, 
  Heart, 
  Share2,
  Filter,
  Navigation,
  X,
  ChevronRight,
  ShoppingBag,
  Info,
  ArrowRight,
  ChevronDown,
  Dices,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Zap,
  Send,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RESTAURANTS, UNIVERSITIES } from './data';
import { Restaurant, Address } from './types';

// --- Types ---

interface LiveActivity {
  id: string;
  type: 'favorite' | 'review';
  restaurantId: string;
  restaurantName: string;
  userName: string;
  rating?: number;
}

const MOCK_ACTIVITIES: LiveActivity[] = [
  { id: '1', type: 'favorite', restaurantId: 'res-1', restaurantName: 'A大南门肠粉', userName: '小王' },
  { id: '2', type: 'review', restaurantId: 'res-2', restaurantName: 'B大小吃街烧鹅', userName: '阿强', rating: 5 },
  { id: '3', type: 'favorite', restaurantId: 'res-3', restaurantName: 'C大逸仙路小笼包', userName: '小李' },
  { id: '4', type: 'review', restaurantId: 'res-4', restaurantName: 'D大康乐村麻辣烫', userName: '大刘', rating: 4.5 },
  { id: '5', type: 'favorite', restaurantId: 'res-5', restaurantName: 'E大下渡路日料', userName: '小美' },
];

// --- Sub-components ---

const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange,
  icon: Icon
}: { 
  label: string; 
  options: { name: string; icon?: string }[] | string[]; 
  value: string; 
  onChange: (val: string) => void;
  icon?: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{label}</h3>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 hover:border-primary transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <span>{value}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[95]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] overflow-hidden py-2"
            >
              {options.map((opt) => {
                const name = typeof opt === 'string' ? opt : opt.name;
                const icon = typeof opt === 'string' ? null : opt.icon;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors flex items-center gap-3 ${value === name ? 'bg-primary text-black' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    {icon && <span className="text-lg">{icon}</span>}
                    {name}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DANMAKU_DATA = [
  { id: 1, user: "阿强", text: "A大南门肠粉 绝了！加辣绝配", restaurantId: "res-1", dish: "招牌肠粉" },
  { id: 2, user: "小美", text: "兄弟们今天吃什么？求推荐", restaurantId: null },
  { id: 3, user: "吃货学长", text: "联盟中心西餐 今天的披萨太香了", restaurantId: "res-6", dish: "经典披萨" },
  { id: 4, user: "深夜诗人", text: "下渡路日料 氛围感拉满，适合约会", restaurantId: "res-5", dish: "三文鱼刺身" },
  { id: 5, user: "减肥中", text: "有没有清淡点的？在线等", restaurantId: null },
  { id: 6, user: "路人甲", text: "B大小吃街烧鹅 真的排队也值得", restaurantId: "res-2", dish: "烧鹅饭" },
  { id: 7, user: "代码诗人", text: "康乐村猪脚饭 程序员的浪漫", restaurantId: "res-27", dish: "猪脚饭" },
  { id: 8, user: "奶茶控", text: "地铁口网红奶茶 出了新品，冲！", restaurantId: "res-7", dish: "新品奶茶" },
  { id: 9, user: "早起星人", text: "金碧花园早茶 这里的虾饺我能吃三笼", restaurantId: "res-16", dish: "水晶虾饺" },
  { id: 10, user: "联盟老饕", text: "客村丽影广场泰餐 冬阴功汤很正宗", restaurantId: "res-20", dish: "冬阴功汤" },
  { id: 11, user: "大一萌新", text: "食堂二楼的麻辣烫居然涨价了😭", restaurantId: null },
  { id: 12, user: "考研党", text: "图书馆旁边的咖啡馆，续命神器", restaurantId: "res-11", dish: "冰美式" },
  { id: 13, user: "运动男孩", text: "打完球来份黄焖鸡，爽歪歪", restaurantId: "res-15", dish: "黄焖鸡米饭" },
  { id: 14, user: "甜品屋", text: "后街的舒芙蕾，入口即化", restaurantId: "res-18", dish: "原味舒芙蕾" },
  { id: 15, user: "火锅之王", text: "这天气不吃顿火锅说不过去吧？", restaurantId: "res-3", dish: "麻辣锅底" },
  { id: 16, user: "面条爱好者", text: "兰州拉面，加肉加蛋，yyds", restaurantId: "res-22", dish: "招牌拉面" },
  { id: 17, user: "孤独的美食家", text: "一个人也要好好吃饭，螺蛳粉走起", restaurantId: "res-25", dish: "经典螺蛳粉" },
  { id: 18, user: "健身达人", text: "鸡胸肉沙拉，为了腹肌我忍了", restaurantId: "res-14", dish: "健身沙拉" },
  { id: 19, user: "熬夜冠军", text: "凌晨两点的烧烤，才是灵魂", restaurantId: "res-12", dish: "烤羊肉串" },
  { id: 20, user: "水果大王", text: "西瓜切半直接挖着吃，夏天标配", restaurantId: null },
  { id: 21, user: "广东仔", text: "早茶的一盅两件，是生活的仪式感", restaurantId: "res-16", dish: "干蒸烧卖" },
  { id: 22, user: "川妹子", text: "不辣不欢，这家的冒菜够味", restaurantId: "res-21", dish: "招牌冒菜" },
  { id: 23, user: "汉堡狂魔", text: "双层牛肉堡，热量爆炸但快乐", restaurantId: "res-8", dish: "双层芝士堡" },
  { id: 24, user: "粥铺老板", text: "生滚鱼片粥，暖心又暖胃", restaurantId: "res-19", dish: "生滚鱼片粥" },
  { id: 25, user: "日料迷", text: "鳗鱼饭，酱汁浓郁，太下饭了", restaurantId: "res-5", dish: "鳗鱼饭" },
  { id: 26, user: "炸鸡少女", text: "韩式炸鸡配啤酒，绝配！", restaurantId: "res-28", dish: "蜂蜜芥末炸鸡" },
  { id: 27, user: "素食主义", text: "发现一家超好吃的素食餐厅", restaurantId: "res-30", dish: "素小炒" },
  { id: 28, user: "撸串专家", text: "烤脑花有人吃吗？人间美味", restaurantId: "res-12", dish: "烤脑花" },
  { id: 29, user: "奶酪控", text: "芝士就是力量！", restaurantId: "res-6", dish: "芝士披萨" },
  { id: 30, user: "路边摊粉丝", text: "校门口的煎饼果子，永远的神", restaurantId: null },
];

const DanmakuItem: React.FC<{ 
  data: any; 
  onOrderSame: (rid: string, dish: string) => void;
  onGoToRestaurant: (rid: string) => void;
  trackIndex: number;
}> = ({ 
  data, 
  onOrderSame, 
  onGoToRestaurant,
  trackIndex
}) => {
  const isHot = data.id % 7 === 0;
  const colors = [
    'bg-white/90',
    'bg-primary/90',
    'bg-slate-900/90',
    'bg-emerald-500/90',
    'bg-rose-500/90'
  ];
  const textColor = trackIndex % 3 === 2 ? 'text-white' : 'text-slate-900';
  const bgColor = colors[trackIndex % colors.length];

  return (
    <motion.div 
      initial={{ x: '100vw' }}
      animate={{ x: '-150%' }}
      transition={{ 
        duration: 60 + Math.random() * 40, // Much slower: 60-100 seconds
        repeat: Infinity, 
        ease: "linear",
        delay: (trackIndex * 5) % 60 // Staggered delay
      }}
      className={`absolute whitespace-nowrap flex items-center gap-3 ${bgColor} backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl border border-white/20 pointer-events-auto hover:z-50 hover:scale-110 transition-transform cursor-default`}
      style={{ top: `${10 + (trackIndex * 8) % 80}%` }}
    >
      <div className={`w-9 h-9 rounded-full ${isHot ? 'bg-rose-500 animate-pulse' : 'bg-primary'} flex items-center justify-center text-[10px] font-black text-black shadow-inner`}>
        {data.user[0]}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${trackIndex % 3 === 2 ? 'text-white/60' : 'text-slate-500'}`}>{data.user}</span>
          {isHot && <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-black animate-bounce">HOT</span>}
        </div>
        <span className={`text-sm font-black ${textColor}`}>{data.text}</span>
      </div>
      
      {data.restaurantId && (
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
          <button 
            onClick={() => onGoToRestaurant(data.restaurantId!)}
            className={`p-1.5 rounded-lg hover:bg-white/20 ${textColor} transition-colors`}
            title="查看餐厅"
          >
            <MapPin className="w-4 h-4" />
          </button>
          {data.dish && (
            <button 
              onClick={() => onOrderSame(data.restaurantId!, data.dish!)}
              className="flex items-center gap-1 bg-white text-black px-2.5 py-1 rounded-lg text-[10px] font-black hover:bg-primary transition-colors shadow-sm"
            >
              <Zap className="w-3 h-3 fill-current" />
              来份同款
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

const DanmakuOverlay = ({ 
  isOpen, 
  onClose,
  onOrderSame,
  onGoToRestaurant,
  danmakuList,
  onAddDanmaku
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onOrderSame: (rid: string, dish: string) => void;
  onGoToRestaurant: (rid: string) => void;
  danmakuList: any[];
  onAddDanmaku: (text: string) => void;
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddDanmaku(inputText);
      setInputText("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
          
          {/* Danmaku Layer (Background) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {danmakuList.map((item, idx) => (
              <DanmakuItem 
                key={item.id} 
                data={item} 
                onOrderSame={onOrderSame}
                onGoToRestaurant={onGoToRestaurant}
                trackIndex={idx}
              />
            ))}
          </div>

          {/* Card-style Exploration Sharing (Foreground) */}
          <div className="relative flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-6 lg:px-8 no-scrollbar">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">吃货圈 · 探店分享</h2>
                  <p className="text-white/60 font-bold">发现校友眼中的宝藏美食</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {danmakuList.map((item, idx) => {
                  const restaurant = RESTAURANTS.find(r => r.id === item.restaurantId);
                  return (
                    <motion.div 
                      key={`card-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white/10 backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/10 hover:border-primary/50 transition-all group shadow-2xl"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={restaurant?.image || `https://picsum.photos/seed/${item.id}/400/400`} 
                          alt="探店图" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-black">
                              {item.user[0]}
                            </div>
                            <span className="text-white text-xs font-bold">{item.user}</span>
                          </div>
                          {item.restaurantId && (
                            <button 
                              onClick={() => onGoToRestaurant(item.restaurantId)}
                              className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black border border-white/20 hover:bg-primary hover:text-black transition-all"
                            >
                              查看店铺
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-white font-bold leading-relaxed mb-4 line-clamp-3">
                          {item.text}
                        </p>
                        {item.dish && (
                          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-3 border border-white/5">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] text-white/40 font-bold uppercase">推荐单品</p>
                              <p className="text-xs text-white font-black">{item.dish}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
            <div className="max-w-xl mx-auto">
              <form 
                onSubmit={handleSubmit}
                className="w-full bg-white/10 backdrop-blur-2xl p-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-2"
              >
                <input 
                  type="text"
                  placeholder="分享你的探店心得..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-6 py-3 font-bold text-white placeholder:text-white/30"
                />
                <button 
                  type="submit"
                  className="bg-primary text-black p-4 rounded-full hover:bg-primary-dark transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const LiveActivityTicker = ({ onSelectRestaurant }: { onSelectRestaurant: (r: Restaurant) => void }) => {
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isExpanded || isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOCK_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isExpanded, isHovered]);

  const activity = MOCK_ACTIVITIES[index];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-14 overflow-hidden bg-white border-2 rounded-2xl shadow-sm transition-all duration-300 group min-w-[340px] cursor-pointer ${isExpanded || isHovered ? 'border-primary shadow-xl scale-[1.02]' : 'border-slate-100 hover:border-primary'}`}
      >
        <AnimatePresence mode="wait">
          {!isHovered && !isExpanded ? (
            <motion.div
              key={activity.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="h-full flex items-center gap-4 px-6"
            >
              <div className="flex items-center gap-2 flex-shrink-0">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live</span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate flex-1">
                <span className="text-primary-dark">{activity.userName}</span>
                {activity.type === 'favorite' ? ' 刚刚收藏了 ' : ` 刚刚给出了 ${activity.rating}星好评: `}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const res = RESTAURANTS.find(r => r.id === activity.restaurantId);
                    if (res) onSelectRestaurant(res);
                  }}
                  className="underline decoration-primary/30 underline-offset-2 font-black hover:text-primary transition-colors"
                >
                  {activity.restaurantName}
                </button>
              </p>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all" />
            </motion.div>
          ) : (
            <motion.div
              key="hover-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex items-center justify-between px-6 bg-slate-50/50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-bounce" />
                <span className="text-sm font-black text-slate-900">大家都在看什么？</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{isExpanded ? '点击收起' : '点击展开'}</span>
                <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className="fixed top-10 right-10 bottom-10 w-[420px] bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.3)] border border-slate-100 z-[120] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 bg-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Live Feed</p>
                  <h3 className="text-xl font-black text-slate-900">实时校园美食动态</h3>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-3 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="flex flex-col gap-2">
                  {MOCK_ACTIVITIES.map((act, i) => {
                    const res = RESTAURANTS.find(r => r.id === act.restaurantId);
                    return (
                      <motion.div 
                        key={act.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 hover:bg-slate-50 rounded-[24px] transition-all border-b border-dashed border-slate-100 last:border-none group/item"
                      >
                        <div className="flex items-start gap-5">
                          <div className={`mt-2 w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${act.type === 'favorite' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                          <div className="flex-1">
                            <p className="text-base text-slate-600 leading-relaxed font-medium">
                              <span className="font-black text-slate-900">{act.userName}</span>
                              {act.type === 'favorite' ? ' 收藏了 ' : ` 评价了 ${act.rating}星: `}
                              <br />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (res) {
                                    onSelectRestaurant(res);
                                    setIsExpanded(false);
                                  }
                                }}
                                className="inline-flex items-center gap-2 text-primary-dark font-black text-lg hover:text-black transition-colors relative mt-1"
                              >
                                <span className="relative z-10">{act.restaurantName}</span>
                                <div className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 group-hover/item:h-full transition-all -z-0 rounded-sm" />
                                <ArrowRight className="w-4 h-4 group-hover/item:translate-x-1 transition-transform" />
                              </button>
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">刚刚发布</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">正在实时更新中...</p>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  收起动态面板
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const RandomPicker = ({ restaurants, onSelect }: { restaurants: Restaurant[], onSelect: (r: Restaurant) => void }) => {
  const [isPicking, setIsPicking] = useState(false);
  const [currentRes, setCurrentRes] = useState<Restaurant | null>(null);

  const startPicking = () => {
    if (restaurants.length === 0) return;
    setIsPicking(true);
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      setCurrentRes(restaurants[Math.floor(Math.random() * restaurants.length)]);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const final = restaurants[Math.floor(Math.random() * restaurants.length)];
        setCurrentRes(final);
        setTimeout(() => {
          onSelect(final);
          setIsPicking(false);
          setCurrentRes(null);
        }, 1000);
      }
    }, 80);
  };

  return (
    <div className="relative inline-block ml-6 align-middle">
      <button 
        onClick={startPicking}
        disabled={isPicking}
        className="group relative flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-black transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50 overflow-hidden"
      >
        <motion.div
          animate={isPicking ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
        >
          <Dices className="w-6 h-6 text-primary" />
        </motion.div>
        <span>帮我选</span>
        
        {/* Eye-catching background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>

      <AnimatePresence>
        {isPicking && currentRes && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white p-12 rounded-[40px] shadow-2xl border-4 border-primary text-center max-w-md w-full mx-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="mb-8"
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">正在为你挑选...</h3>
              <p className="text-4xl font-black text-slate-900 mb-6">{currentRes.name}</p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileView = ({ 
  favorites, 
  onSelectRestaurant 
}: { 
  favorites: string[]; 
  onSelectRestaurant: (r: Restaurant) => void;
}) => {
  const [activeSubView, setActiveSubView] = useState('我的收藏');
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', name: '张三', phone: '13800138000', detail: 'A大学南校区3号楼405', isDefault: true },
    { id: '2', name: '李四', phone: '13911112222', detail: 'B大学西校区图书馆旁', isDefault: false },
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', detail: '' });

  const favoriteRestaurants = RESTAURANTS.filter(r => favorites.includes(r.id));

  const sidebarItems = [
    { name: '个人资料', icon: User },
    { name: '我的收藏', icon: Heart },
    { name: '我的分享', icon: Share2 },
    { name: '地址管理', icon: MapPin },
    { name: '系统设置', icon: Info },
  ];

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.phone && newAddress.detail) {
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, address]);
      setNewAddress({ name: '', phone: '', detail: '' });
      setShowAddAddress(false);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-50 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img src="https://i.pravatar.cc/300?u=student" className="w-full h-full rounded-full border-4 border-primary shadow-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-white">
                <Star className="w-4 h-4 text-black fill-current" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">美食探店达人</h2>
            <p className="text-slate-400 font-bold text-sm mb-8">高校联盟 · 资深吃货</p>
            
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
              <div>
                <p className="text-xl font-black text-slate-900">{favorites.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">收藏餐厅</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">42</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">探店足迹</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {sidebarItems.map(item => (
              <button 
                key={item.name} 
                onClick={() => setActiveSubView(item.name)}
                className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-between group ${activeSubView === item.name ? 'bg-primary text-black' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${activeSubView === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          {activeSubView === '我的收藏' && (
            <>
              <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                我收藏的餐厅
              </h3>
              
              {favoriteRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {favoriteRestaurants.map(r => (
                    <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelectRestaurant(r)} />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Heart className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-900 font-bold mb-2">还没有收藏任何餐厅</p>
                  <p className="text-slate-400 text-sm">快去首页发现心仪的美食吧</p>
                </div>
              )}
            </>
          )}

          {activeSubView === '我的分享' && (
            <>
              <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Share2 className="w-8 h-8 text-primary" />
                我的探店分享
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={`https://picsum.photos/seed/share${i}/200`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 mb-1">今天在A大学食堂发现宝藏！</h4>
                        <p className="text-xs text-slate-400 mb-2">2024-03-14 12:30</p>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary-dark rounded-md">#校园美食</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">#宝藏店铺</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                      这家店的招牌红烧肉真的绝了，入口即化，肥而不腻。而且价格非常亲民，学生党必冲！
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> 128</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> 24</span>
                      </div>
                      <button className="text-primary-dark text-xs font-black hover:underline">查看详情</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSubView === '地址管理' && (
            <>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                  <MapPin className="w-8 h-8 text-emerald-500" />
                  地址管理
                </h3>
                <button 
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  新增地址
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-xl ${address.isDefault ? 'bg-primary/10 text-primary-dark' : 'bg-slate-50 text-slate-400'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-black text-slate-900">{address.name}</span>
                          <span className="text-slate-400 font-bold">{address.phone}</span>
                          {address.isDefault && (
                            <span className="text-[10px] font-black px-2 py-0.5 bg-primary text-black rounded-md">默认</span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm">{address.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {!address.isDefault && (
                        <button 
                          onClick={() => setDefaultAddress(address.id)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary-dark transition-colors"
                        >
                          设为默认
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {showAddAddress && (
                  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAddAddress(false)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="relative bg-white w-full max-w-md p-8 rounded-[32px] shadow-2xl"
                    >
                      <h4 className="text-2xl font-black text-slate-900 mb-6">新增收货地址</h4>
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">联系人</label>
                          <input 
                            type="text" 
                            value={newAddress.name}
                            onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                            placeholder="您的姓名"
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">手机号码</label>
                          <input 
                            type="tel" 
                            value={newAddress.phone}
                            onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                            placeholder="您的手机号"
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">详细地址</label>
                          <textarea 
                            value={newAddress.detail}
                            onChange={e => setNewAddress({...newAddress, detail: e.target.value})}
                            placeholder="学校、楼栋、门牌号等"
                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-slate-900 h-32 resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setShowAddAddress(false)}
                          className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
                        >
                          取消
                        </button>
                        <button 
                          onClick={handleAddAddress}
                          className="flex-1 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                          保存地址
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </>
          )}

          {(activeSubView === '个人资料' || activeSubView === '系统设置') && (
            <div className="py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Info className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-slate-900 font-bold mb-2">{activeSubView} 模块正在开发中</p>
              <p className="text-slate-400 text-sm">敬请期待更多精彩功能</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    onClick={onClick}
    className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary/50 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-xl"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
        <Clock className="w-3 h-3 text-primary-dark" />
        25-35 min
      </div>
      <div className="absolute bottom-3 right-3 bg-primary text-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
        <Star className="w-3.5 h-3.5 fill-black" />
        <span className="text-xs font-bold">{restaurant.rating}</span>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-dark transition-colors truncate pr-2">{restaurant.name}</h3>
      </div>
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <span>{restaurant.category}</span>
        <span>•</span>
        <span className="font-bold text-slate-900">¥{restaurant.avgPrice}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {restaurant.tags.slice(0, 2).map(tag => (
          <span key={tag} className="bg-slate-50 text-slate-500 text-[10px] px-2.5 py-1 rounded-full border border-slate-100 font-medium">
            {tag}
          </span>
        ))}
        {restaurant.distanceValue < 1000 && (
          <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2.5 py-1 rounded-full border border-emerald-100 font-bold">
            距离近
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const DetailModal = ({ 
  restaurant, 
  onClose, 
  isFavorite,
  onToggleFavorite
}: { 
  restaurant: Restaurant; 
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-900 hover:bg-primary transition-all shadow-xl border border-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Image & Visuals */}
        <div className="w-full md:w-5/12 h-64 md:h-auto relative">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-black">
                {restaurant.rating} ★
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold">
                {restaurant.category}
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2 leading-tight">{restaurant.name}</h1>
            <p className="text-white/70 text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {restaurant.address}
            </p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-7/12 p-10 overflow-y-auto no-scrollbar bg-white">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">人均</p>
                <p className="text-xl font-black text-slate-900">¥{restaurant.avgPrice}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">距离</p>
                <p className="text-xl font-black text-slate-900">{restaurant.distanceValue}m</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">评分</p>
                <p className="text-xl font-black text-slate-900">{restaurant.rating}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onToggleFavorite}
                className={`p-3 rounded-2xl border transition-all ${isFavorite ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-100' : 'bg-white border-slate-200 text-slate-400 hover:border-primary'}`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:border-primary transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-black" />
                </div>
                招牌必点 & 推荐指数
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {restaurant.signatureDishes.map((dish, idx) => (
                  <div key={idx} className="group bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-primary/20 transition-all">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-black text-slate-900">{dish.name}</p>
                      <p className="text-primary-dark font-black">¥{dish.price}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-primary fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">高评价</span>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-black">
                        {dish.recommendationRate}% 校友推荐
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                  </div>
                  学生评价
                </h2>
                <span className="text-sm font-bold text-slate-400">{restaurant.reviews.length} 条评论</span>
              </div>

              <div className="space-y-8">
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} className="w-10 h-10 rounded-full border-2 border-slate-100" />
                        <div>
                          <p className="text-sm font-black text-slate-900">{review.user}</p>
                          <p className="text-[10px] font-bold text-slate-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-primary fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {review.images.map((img, i) => (
                          <img key={i} src={img} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-sm" referrerPolicy="no-referrer" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="mt-10 bg-slate-50 rounded-3xl p-6">
                <h3 className="text-sm font-black text-slate-900 mb-4">发表你的评价</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star className={`w-6 h-6 ${s <= rating ? 'text-primary fill-current' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="味道如何？环境怎么样？快来分享你的探店心得吧..."
                  className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-primary h-32 resize-none mb-4"
                />
                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg">
                  提交评价
                </button>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 left-0 right-0 pt-8 bg-gradient-to-t from-white via-white to-transparent">
            <button className="w-full bg-primary hover:bg-primary-dark text-black font-black py-5 rounded-[20px] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 text-lg group">
              <Navigation className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              立即导航前往
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'map' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedScene, setSelectedScene] = useState('全部');
  const [sortConfig, setSortConfig] = useState<{ field: 'distance' | 'rating' | 'avgPrice', order: 'asc' | 'desc' }>({ field: 'distance', order: 'asc' });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDanmakuOpen, setIsDanmakuOpen] = useState(false);
  const [danmakuList, setDanmakuList] = useState(DANMAKU_DATA);

  const handleAddDanmaku = (text: string) => {
    const newDanmaku = {
      id: `user-${Date.now()}`,
      user: "我",
      text,
      restaurantId: null
    };
    setDanmakuList(prev => [...prev, newDanmaku]);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleOrderSame = (restaurantId: string, dishName: string) => {
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
    if (!restaurant) return;
    setSelectedRestaurant(restaurant);
    setIsDanmakuOpen(false);
  };

  const handleGoToRestaurant = (restaurantId: string) => {
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setIsDanmakuOpen(false);
    }
  };

  const categories = [
    { name: '全部', icon: '🍽️' },
    { name: '粤菜', icon: '🥟' },
    { name: '川湘菜', icon: '🌶️' },
    { name: '日韩料理', icon: '🍣' },
    { name: '西式快餐', icon: '🍔' },
    { name: '奶茶甜品', icon: '🧋' },
    { name: '面馆', icon: '🍜' },
    { name: '烧烤', icon: '🍢' },
    { name: '东南亚菜', icon: '🍛' }
  ];

  const scenes = [
    { name: '全部', icon: '✨' },
    { name: '一个人吃', icon: '👤' },
    { name: '朋友约饭', icon: '👥' },
    { name: '情侣约会', icon: '❤️' },
    { name: '深夜夜宵', icon: '🌙' },
    { name: '生日聚餐', icon: '🎂' },
    { name: '快速解决', icon: '⚡' }
  ];

  const filteredRestaurants = useMemo(() => {
    let result = RESTAURANTS.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.category.includes(searchQuery);
      const matchesCategory = selectedCategory === '全部' || r.category === selectedCategory;
      const matchesScene = selectedScene === '全部' || (typeof selectedScene === 'string' && r.scenes.includes(selectedScene));
      return matchesSearch && matchesCategory && matchesScene;
    });

    result.sort((a, b) => {
      const { field, order } = sortConfig;
      const factor = order === 'asc' ? 1 : -1;
      
      if (field === 'distance') return (a.distanceValue - b.distanceValue) * factor;
      if (field === 'rating') return (b.rating - a.rating) * factor; // Default rating high to low
      if (field === 'avgPrice') return (a.avgPrice - b.avgPrice) * factor;
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, selectedScene, sortConfig]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-3' : 'bg-white/80 backdrop-blur-md py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => { setActiveView('home'); setSelectedCategory('全部'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                <ShoppingBag className="w-6 h-6 text-black" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black tracking-tighter text-slate-900">CAMPUS<span className="text-primary-dark">EATS</span></span>
                <span className="text-[9px] font-black text-primary-dark tracking-[0.2em] uppercase">University Alliance</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-10">
              <button 
                onClick={() => setActiveView('home')}
                className={`text-sm font-black transition-all relative py-2 ${activeView === 'home' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
              >
                发现美食
                {activeView === 'home' && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />}
              </button>
              <button 
                onClick={() => setActiveView('map')}
                className={`text-sm font-black transition-all relative py-2 ${activeView === 'map' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
              >
                地图探索
                {activeView === 'map' && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className={`hidden lg:flex relative transition-all duration-500 ${isScrolled ? 'w-[400px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索联盟周边美食…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-0 focus:border-primary focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDanmakuOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-black transition-all shadow-lg shadow-slate-200 group"
              >
                <Zap className="w-4 h-4 text-primary fill-current group-hover:scale-125 transition-transform" />
                🔥 吃货圈
              </button>
              <button 
                onClick={() => setActiveView('profile')}
                className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl border transition-all ${activeView === 'profile' ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100 hover:border-primary'}`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden border border-white/50">
                  <img src="https://i.pravatar.cc/100?u=student" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-black text-slate-900 hidden sm:inline">我的主页</span>
              </button>
            </div>
          </div>
        </div>
      </header>

        {activeView === 'profile' && (
          <ProfileView 
            favorites={favorites} 
            onSelectRestaurant={(r) => {
              setSelectedRestaurant(r);
              setActiveView('home');
            }} 
          />
        )}

        {activeView === 'home' && (
          <main className="pt-0">
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex items-center bg-white pt-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-full lg:w-7/12 h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80" 
                alt="Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-dark px-4 py-2 rounded-full text-xs font-black mb-8">
                    <Star className="w-4 h-4 fill-current" />
                    高校联盟学子首选美食平台
                  </div>
                  <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
                    <h1 className="text-7xl md:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter drop-shadow-sm">
                      今天<br/>
                      <span className="text-primary-dark underline decoration-8 decoration-primary/30 underline-offset-8">吃什么。</span>
                    </h1>
                    <div className="pb-2">
                      <RandomPicker restaurants={RESTAURANTS} onSelect={setSelectedRestaurant} />
                    </div>
                  </div>
                  <p className="text-2xl text-slate-500 font-bold mb-14 max-w-xl leading-relaxed">
                    解决你的世纪难题。我们为你提供 <span className="text-slate-900">n+</span> 针对学生群体的本地化美食指南。
                  </p>
                  
                  <div className="bg-white p-4 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col md:flex-row gap-4 max-w-3xl">
                    <div className="flex-[1.2] relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                      <input 
                        type="text" 
                        readOnly
                        value="高校联盟中心"
                        className="w-full bg-slate-50 border-none rounded-[24px] py-6 pl-16 pr-4 font-black text-xl outline-none cursor-default group-hover:bg-slate-100 transition-colors"
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="想吃点什么？"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-[24px] py-6 pl-16 pr-4 font-bold text-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <button className="bg-primary text-black font-black px-12 py-6 rounded-[24px] hover:bg-primary-dark transition-all text-xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95">
                      开始探索
                    </button>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-8">
                    <div className="flex -space-x-4">
                      {[1, 2, 3, 4].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-slate-400">
                      已有 <span className="text-slate-900">2,000+</span> 联盟学子在这里分享美食
                    </p>
                    <LiveActivityTicker onSelectRestaurant={setSelectedRestaurant} />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Category & Scene Section */}
          <section className="bg-white py-6 border-b border-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">热门分类</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">探索你最喜爱的美食种类</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex flex-col items-center gap-2 group transition-all ${selectedCategory === cat.name ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-2xl shadow-sm transition-all ${selectedCategory === cat.name ? 'bg-primary shadow-lg shadow-primary/20 rotate-6' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-md'}`}>
                        {cat.icon}
                      </div>
                      <span className={`text-[10px] font-black transition-colors ${selectedCategory === cat.name ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">用餐场景</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">根据你的当下心情选择</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {scenes.map((scene) => (
                    <button
                      key={scene.name}
                      onClick={() => setSelectedScene(scene.name)}
                      className={`flex flex-col items-center gap-2 group transition-all ${selectedScene === scene.name ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-2xl shadow-sm transition-all ${selectedScene === scene.name ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 -rotate-6' : 'bg-slate-50 group-hover:bg-white group-hover:shadow-md'}`}>
                        {scene.icon}
                      </div>
                      <span className={`text-[10px] font-black transition-colors ${selectedScene === scene.name ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {scene.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Main Content with Sidebar */}
          <section id="restaurant-list" className="py-20 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                  <div className="sticky top-32 space-y-10">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">美食分类</h3>
                      <div className="flex flex-col gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group ${selectedCategory === cat.name ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{cat.icon}</span>
                              <span className="font-bold text-sm">{cat.name}</span>
                            </div>
                            {selectedCategory === cat.name && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/10 p-6 rounded-[24px] border border-primary/20">
                      <h4 className="font-black text-slate-900 mb-2">地图模式</h4>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">想看看餐厅都在哪？切换到地图模式直观探索。</p>
                      <button 
                        onClick={() => setActiveView('map')}
                        className="w-full bg-white text-black font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <MapIcon className="w-4 h-4" /> 开启地图
                      </button>
                    </div>
                  </div>
                </aside>

                {/* Restaurant List */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                      <div className="flex items-center gap-2 text-primary-dark font-black text-sm mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary-dark animate-pulse" />
                        高校联盟周边
                      </div>
                      <h2 className="text-4xl font-black text-slate-900">
                        {selectedCategory === '全部' ? '所有推荐餐厅' : `${selectedCategory}美食`}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {[
                        { id: 'distance', label: '距离' },
                        { id: 'rating', label: '评分' },
                        { id: 'avgPrice', label: '价格' }
                      ].map(opt => (
                        <button 
                          key={opt.id}
                          onClick={() => {
                            if (sortConfig.field === opt.id) {
                              setSortConfig({ ...sortConfig, order: sortConfig.order === 'asc' ? 'desc' : 'asc' });
                            } else {
                              setSortConfig({ field: opt.id as any, order: opt.id === 'rating' ? 'desc' : 'asc' });
                            }
                          }}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${sortConfig.field === opt.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {opt.label}
                          {sortConfig.field === opt.id ? (
                            sortConfig.order === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-30" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredRestaurants.map(r => (
                        <RestaurantCard key={r.id} restaurant={r} onClick={() => setSelectedRestaurant(r)} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-40 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Search className="w-10 h-10 text-slate-200" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-3">哎呀，没找到餐厅</h3>
                      <p className="text-slate-500 max-w-xs mx-auto font-medium">换个关键词或者重置筛选条件试试看吧</p>
                      <button 
                        onClick={() => { setSelectedCategory('全部'); setSelectedScene('全部'); setSearchQuery(''); }}
                        className="mt-10 bg-primary text-black font-black px-10 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        重置所有筛选
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeView === 'map' && (
        <main className="h-screen pt-20 relative bg-slate-50 flex">
          {/* Map Sidebar */}
          <aside className="w-96 h-full bg-white border-r border-slate-100 z-10 flex flex-col shadow-2xl">
            <div className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-black text-slate-900">地图探索</h2>
                <button onClick={() => setActiveView('home')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
                <p className="text-slate-400 text-sm font-medium">直观查看联盟周边的美食分布</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="在地图中搜索…" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">图例说明</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-100" /> 川湘火辣
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/20" /> 奶茶甜品
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-100" /> 粤菜/其他
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-blue-600 shadow-lg shadow-blue-100" /> 高校联盟
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">附近餐厅 ({filteredRestaurants.length})</h3>
                <div className="space-y-3">
                  {filteredRestaurants.slice(0, 10).map(res => (
                    <button 
                      key={res.id}
                      onClick={() => setSelectedRestaurant(res)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all text-left group"
                    >
                      <img src={res.image} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:text-primary-dark">{res.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{res.category} • ¥{res.avgPrice}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* SVG Map Area */}
          <div className="flex-1 h-full relative overflow-hidden bg-slate-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-auto max-w-5xl drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)]">
                <defs>
                  <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                  </pattern>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                  </filter>
                </defs>
                <rect width="400" height="300" fill="url(#grid-map)" rx="32" />

                {/* Universities */}
                {UNIVERSITIES.map((uni, idx) => (
                  <g key={idx} transform={`translate(${uni.x}, ${uni.y})`}>
                    <circle r="22" fill="#2563eb" fillOpacity="0.1" />
                    <circle r="8" fill="#2563eb" filter="url(#shadow)" />
                    <text y="35" textAnchor="middle" className="text-[11px] font-black fill-blue-700 tracking-tighter">{uni.name}</text>
                  </g>
                ))}

                {/* Restaurants */}
                {RESTAURANTS.map((res) => (
                  <g 
                    key={res.id} 
                    transform={`translate(${res.coordinates.x}, ${res.coordinates.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedRestaurant(res)}
                  >
                    <motion.circle 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.6 }}
                      r="10" 
                      fill={res.category === '川湘菜' ? '#ef4444' : res.category === '奶茶甜品' ? '#FFD200' : '#10b981'} 
                      className="transition-all stroke-white stroke-2"
                      filter="url(#shadow)"
                    />
                    <g className="opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                      <rect x="-45" y="-40" width="90" height="24" rx="8" fill="white" className="shadow-2xl" />
                      <text y="-24" textAnchor="middle" className="text-[9px] font-black fill-slate-900">
                        {res.name}
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Map Controls */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-3">
              <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-900 font-black text-xl hover:bg-primary transition-all">+</button>
              <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-900 font-black text-xl hover:bg-primary transition-all">-</button>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-black" />
                </div>
                <span className="text-3xl font-black tracking-tighter">CAMPUS<span className="text-primary">EATS</span></span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                连接高校联盟学子与周边美食的桥梁。我们致力于打造最真实、最便捷的校园美食导航系统，让每一次用餐都成为美好的回忆。
              </p>
              <div className="flex gap-4">
                {['WeChat', 'Weibo', 'Xiaohongshu'].map(social => (
                  <button key={social} className="px-6 py-3 rounded-xl bg-slate-900 text-slate-400 font-bold text-sm hover:bg-primary hover:text-black transition-all">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">关于项目</h4>
              <ul className="space-y-4 text-slate-300 font-bold">
                <li><a href="#" className="hover:text-primary transition-colors">开发团队</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">加入我们</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">品牌故事</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">联系我们</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">商家中心</h4>
              <ul className="space-y-4 text-slate-300 font-bold">
                <li><a href="#" className="hover:text-primary transition-colors">餐厅入驻</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">广告合作</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">商家后台</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">规则中心</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">订阅动态</h4>
              <p className="text-slate-400 text-sm mb-6 font-medium">获取高校联盟周边最新的餐厅开业信息和限时优惠。</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="你的邮箱地址" 
                  className="w-full bg-slate-900 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary text-black px-4 rounded-xl font-black text-xs hover:bg-primary-dark transition-all">
                  订阅
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold">
            <p>© 2026 高校联盟美食地图项目组. 粤ICP备12345678号</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">Cookie设置</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DanmakuOverlay 
        isOpen={isDanmakuOpen} 
        onClose={() => setIsDanmakuOpen(false)}
        onOrderSame={handleOrderSame}
        onGoToRestaurant={handleGoToRestaurant}
        danmakuList={danmakuList}
        onAddDanmaku={handleAddDanmaku}
      />
      <AnimatePresence>
        {selectedRestaurant && (
          <DetailModal 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)}
            isFavorite={favorites.includes(selectedRestaurant.id)}
            onToggleFavorite={() => toggleFavorite(selectedRestaurant.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
