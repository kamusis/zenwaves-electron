// 自动更换壁纸间隔
export const INTERVAL_OPTIONS = [
  { label: 'Disable', value: 0 },
  { label: 'Every hour', value: 60 },
  { label: 'Every day', value: 1440 },
  { label: 'Every month', value: 43200 },
]

// 可用字体选项
export const FONT_OPTIONS = [
  { label: '江西拙楷', value: 'JXZhuoKai' },
  { label: '欣意吉祥宋', value: 'XinYiJiXiangSong' },
  { label: '问藏书房', value: 'Wencang' },
  { label: '钟齐志莽行书', value: 'Zhi-Mang-Xing' },
  { label: '黄令东齐伋体', value: 'QIJIFALLBACK' },
  { label: '源云明体', value: 'GenWanMinTW' },
  { label: '站酷庆科黄油体', value: 'ZCOOL-QingKe-HuangYou' },
]

// 诗词列表，当接口出现问题时，使用
export const  DEFAULT_POEM_ARRAY = [
  {
    "id": "5b8b9572e116fb3714e739f8",
    "content": "梦觉春衾，江南依旧远。",
    "popularity": 548000,
    "origin": {
      "title": "清商怨·庭花香信尚浅",
      "dynasty": "宋代",
      "author": "晏几道",
      "content": [
        "庭花香信尚浅，最玉楼先暖。梦觉春衾，江南依旧远。",
        "回纹锦字暗剪，谩寄与、也应归晚。要问相思，天涯犹自短。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:39.170681"
  },
  {
    "id": "5b8b9572e116fb3714e6fa58",
    "content": "乱花渐欲迷人眼，浅草才能没马蹄。",
    "popularity": 734000,
    "origin": {
      "title": "钱塘湖春行",
      "dynasty": "唐代",
      "author": "白居易",
      "content": [
        "孤山寺北贾亭西，水面初平云脚低。",
        "几处早莺争暖树，谁家新燕啄春泥。",
        "乱花渐欲迷人眼，浅草才能没马蹄。",
        "最爱湖东行不足，绿杨阴里白沙堤。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:39.170681"
  },
  {
    "id": "5b8b9572e116fb3714e6fb90",
    "content": "春潮带雨晚来急，野渡无人舟自横。",
    "popularity": 683000,
    "origin": {
      "title": "滁州西涧",
      "dynasty": "唐代",
      "author": "韦应物",
      "content": ["独怜幽草涧边生，上有黄鹂深树鸣。", "春潮带雨晚来急，野渡无人舟自横。"],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:39.170681"
  },
  {
    "id": "5b8b9572e116fb3714e6f9e3",
    "content": "俏也不争春，只把春来报。",
    "popularity": 692000,
    "origin": {
      "title": "卜算子·咏梅",
      "dynasty": "近代",
      "author": "毛泽东",
      "content": [
        "风雨送春归，飞雪迎春到。已是悬崖百丈冰，犹有花枝俏。",
        "俏也不争春，只把春来报。待到山花烂漫时，她在丛中笑。"
      ],
      "translate": [
        "风雨把春天送归这里，飞舞的雪花又在迎接春天的来到。已经是冰封雪冻最寒冷的时候，悬崖边上还盛开着俏丽的梅花。",
        "梅花虽然俏丽，但并不炫耀自己，只是为了向人们报告春天到来的消息。等到百花盛开的时候，她将会感到无比欣慰。"
      ]
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:39.170681"
  },
  {
    "id": "5b8b9572e116fb3714e729b7",
    "content": "扫园林、红香万点，送春归去。",
    "popularity": 773000,
    "origin": {
      "title": "贺新郎",
      "dynasty": "宋代",
      "author": "杨炎正",
      "content": [
        "十日狂风雨。扫园林、红香万点，送春归去。独有荼＿开未到，留得一分春住。早杨柳、趁晴飞絮。可奈暖埃欺昼永，试薄罗衫子轻如雾。惊旧恨，到眉宇。",
        "东风台榭知何处。问燕莺如今，尚有春光几许。可叹一年游赏倦，放得无情露醑。为唤取、扇歌裙舞。乞得风光还两眼，待为君、满把金杯举。扶醉玉，伴挥尘。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:58.607299"
  },
  {
    "id": "5b8b9572e116fb3714e72279",
    "content": "忧喜相寻，风雨过、一江春绿。",
    "popularity": 823000,
    "origin": {
      "title": "满江红·忧喜相寻",
      "dynasty": "宋代",
      "author": "苏轼",
      "content": [
        "董毅夫名钺，自梓漕得罪，罢官东川，归鄱阳，过东坡于齐安。怪其丰暇自得，余问之。曰：“吾再娶柳氏，三日而去官。吾固不戚戚，而优柳氏不能忘怀于进退也。已而欣然，同忧共若处富贵，吾是以益安焉。”命其侍儿歌其所作《满江红》。嗟叹之不足，乃次其韵。",
        "忧喜相寻，风雨过、一江春绿。巫峡梦、至今空有，乱山屏簇。何似伯鸾携德耀，箪瓢未足清欢足。渐粲然、光彩照阶庭，生兰玉。",
        "幽梦里，传心曲。肠断处，凭他续。文君婿知否，笑君卑辱。君不见周南歌汉广，天教夫子休乔木。便相将、左手抱琴书，云间宿。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:58.607299"
  },
  {
    "id": "5b8b9572e116fb3714e72e18",
    "content": "到今来，海角逢春，天涯为客。",
    "popularity": 689000,
    "origin": {
      "title": "帝台春·芳草碧色",
      "dynasty": "宋代",
      "author": "李甲",
      "content": [
        "芳草碧色，萋萋遍南陌。暖絮乱红，也知人、春愁无力。忆得盈盈拾翠侣，共携赏、凤城寒食。到今来，海角逢春，天涯为客。",
        "愁旋释。还似织。泪暗拭。又偷滴。谩伫立、遍倚危阑，尽黄昏，也只是、暮云凝碧。拚则而今已拚了，忘则怎生便忘得。又还问鳞鸿，试重寻消息。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:40:58.607299"
  },
  {
    "id": "5b8b9572e116fb3714e719fe",
    "content": "春风曾不到，汉使亦应稀。",
    "popularity": 1450000,
    "origin": {
      "title": "发临洮将赴北庭留别",
      "dynasty": "唐代",
      "author": "岑参",
      "content": [
        "闻说轮台路，连年见雪飞。",
        "春风曾不到，汉使亦应稀。",
        "白草通疏勒，青山过武威。",
        "勤王敢道远，私向梦中归。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:21.730202"
  },
  {
    "id": "5b8b9572e116fb3714e721c1",
    "content": "忆得前春，有个人人共。",
    "popularity": 1020000,
    "origin": {
      "title": "蝶恋花·海燕双来归画栋",
      "dynasty": "宋代",
      "author": "欧阳修",
      "content": [
        "海燕双来归画栋。帘影无风，花影频移动。半醉腾腾春睡重。绿鬟堆枕香云拥。",
        "翠被双盘金缕凤。忆得前春，有个人人共。花里黄莺时一弄。日斜惊起相思梦。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:21.730202"
  },
  {
    "id": "5b8b9572e116fb3714e7362f",
    "content": "共说春来春去事，多时。",
    "popularity": 1440000,
    "origin": {
      "title": "南乡子·花落未须悲",
      "dynasty": "宋代",
      "author": "晏几道",
      "content": [
        "花落未须悲。红蕊明年又满枝。惟有花间人别后，无期。水阔山长雁字迟。",
        "今日最相思。记得攀条话别离。共说春来春去事，多时。一点愁心入翠眉。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:21.730202"
  },
  {
    "id": "5b8b9572e116fb3714e722a0",
    "content": "弦管，弦管，春草昭阳路断。",
    "popularity": 582000,
    "origin": {
      "title": "宫中调笑·团扇",
      "dynasty": "唐代",
      "author": "王建",
      "content": [
        "团扇，团扇，美人病来遮面。",
        "玉颜憔悴三年，谁复商量管弦。",
        "弦管，弦管，春草昭阳路断。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:21.730202"
  },
  {
    "id": "5b8b9572e116fb3714e6fc30",
    "content": "迟日江山丽，春风花草香。",
    "popularity": 1200000,
    "origin": {
      "title": "绝句二首",
      "dynasty": "唐代",
      "author": "杜甫",
      "content": [
        "迟日江山丽，春风花草香。",
        "泥融飞燕子，沙暖睡鸳鸯。",
        "江碧鸟逾白，山青花欲燃。",
        "今春看又过，何日是归年。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:31.711083"
  },
  {
    "id": "5b8b9572e116fb3714e7294b",
    "content": "过春时，只合安排愁绪送春归。",
    "popularity": 899000,
    "origin": {
      "title": "相见欢·年年负却花期",
      "dynasty": "清代",
      "author": "张惠言",
      "content": [
        "年年负却花期！过春时，只合安排愁绪送春归。",
        "梅花雪，梨花月，总相思。自是春来不觉去偏知。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:31.711083"
  },
  {
    "id": "5b8b9572e116fb3714e72699",
    "content": "燕来晚、飞入西城，似说春事迟暮。",
    "popularity": 680000,
    "origin": {
      "title": "莺啼序·春晚感怀",
      "dynasty": "宋代",
      "author": "吴文英",
      "content": [
        "残寒正欺病酒，掩沉香绣户。燕来晚、飞入西城，似说春事迟暮。画船载、清明过却，晴烟冉冉吴宫树。念羁情、游荡随风，化为轻絮。",
        "十载西湖，傍柳系马，趁娇尘软雾。溯红渐招入仙溪，锦儿偷寄幽素，倚银屏、春宽梦窄，断红湿、歌纨金缕。暝堤空，轻把斜阳，总还鸥鹭。",
        "幽兰旋老，杜若还生，水乡尚寄旅。别后访、六桥无信，事往花委，瘗玉埋香，几番风雨。长波妒盼，遥山羞黛，渔灯分影春江宿。记当时、短楫桃根渡，青楼仿佛，临分败壁题诗，泪墨惨淡尘土。危亭望极，草色天涯，叹鬓侵半苎。暗点检、离痕欢唾，尚染鲛绡，亸凤迷归，破鸾慵舞。殷勤待写，书中长恨，蓝霞辽海沉过雁。漫相思、弹入哀筝柱。伤心千里江南，怨曲重招，断魂在否？"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:31.711083"
  },
  {
    "id": "5b8b9572e116fb3714e6fa35",
    "content": "江天一色无纤尘，皎皎空中孤月轮。",
    "popularity": 543000,
    "origin": {
      "title": "春江花月夜",
      "dynasty": "唐代",
      "author": "张若虚",
      "content": [
        "春江潮水连海平，海上明月共潮生。",
        "滟滟随波千万里，何处春江无月明！",
        "江流宛转绕芳甸，月照花林皆似霰。",
        "空里流霜不觉飞，汀上白沙看不见。",
        "江天一色无纤尘，皎皎空中孤月轮。",
        "江畔何人初见月，江月何年初照人？",
        "人生代代无穷已，江月年年只相似。",
        "不知江月待何人，但见长江送流水。",
        "白云一片去悠悠，青枫浦上不胜愁。",
        "谁家今夜扁舟子，何处相思明月楼？",
        "可怜楼上月徘徊，应照离人妆镜台。",
        "玉户帘中卷不去，捣衣砧上拂还来。",
        "此时相望不相闻，愿逐月华流照君。",
        "鸿雁长飞光不度，鱼龙潜跃水成文。",
        "昨夜闲潭梦落花，可怜春半不还家。",
        "江水流春去欲尽，江潭落月复西斜。",
        "斜月沉沉藏海雾，碣石潇湘无限路。",
        "不知乘月几人归，落月摇情满江树。"
      ],
      "translate": [
        "春天的江潮水势浩荡，与大海连成一片，一轮明月从海上升起，好像与潮水一起涌出来。",
        "月光照耀着春江，随着波浪闪耀千万里，所有地方的春江都有明亮的月光。",
        "江水曲曲折折地绕着花草丛生的原野流淌，月光照射着开遍鲜花的树林好像细密的雪珠在闪烁。",
        "月色如霜，所以霜飞无从觉察。洲上的白沙和月色融合在一起，看不分明。",
        "江水、天空成一色，没有一点微小灰尘，明亮的天空中只有一轮孤月高悬空中。",
        "江边上什么人最初看见月亮，江上的月亮哪一年最初照耀着人？",
        "人生一代代地无穷无尽，只有江上的月亮一年年地总是相像。",
        "不知江上的月亮等待着什么人，只见长江不断地一直运输着流水。",
        "游子像一片白云缓缓地离去，只剩下思妇站在离别的青枫浦不胜忧愁。",
        "哪家的游子今晚坐着小船在漂流？什么地方有人在明月照耀的楼上相思？",
        "可怜楼上不停移动的月光，应该照耀着离人的梳妆台。",
        "月光照进思妇的门帘，卷不走，照在她的捣衣砧上，拂不掉。",
        "这时互相望着月亮可是互相听不到声音，我希望随着月光流去照耀着您。",
        "鸿雁不停地飞翔，而不能飞出无边的月光；月照江面，鱼龙在水中跳跃，激起阵阵波纹。",
        "昨天夜里梦见花落闲潭，可惜的是春天过了一半自己还不能回家。",
        "江水带着春光将要流尽，水潭上的月亮又要西落。",
        "斜月慢慢下沉，藏在海雾里，碣石与潇湘的离人距离无限遥远。",
        "不知有几人能趁着月光回家，唯有那西落的月亮摇荡着离情，洒满了江边的树林。"
      ]
    },
    "matchTags": [],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T07:41:41.696042"
  },
  {
    "id": "5b8b9572e116fb3714e72ca3",
    "content": "好趁春晴连夜赏，雨便一春休。",
    "popularity": 772000,
    "origin": {
      "title": "武陵春·桃李风前多妩媚",
      "dynasty": "宋代",
      "author": "辛弃疾",
      "content": [
        "桃李风前多妩媚，杨柳更温柔。唤取笙歌烂熳游。且莫管闲愁。",
        "好趁春晴连夜赏，雨便一春休。草草杯盘不要收。才晓便扶头。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T09:45:20.024574"
  },
  {
    "id": "5b8b9572e116fb3714e71d4a",
    "content": "绿杨烟外晓寒轻，红杏枝头春意闹。",
    "popularity": 507000,
    "origin": {
      "title": "玉楼春·春景",
      "dynasty": "宋代",
      "author": "宋祁",
      "content": [
        "东城渐觉风光好。縠皱波纹迎客棹。绿杨烟外晓寒轻，红杏枝头春意闹。",
        "浮生长恨欢娱少。肯爱千金轻一笑。为君持酒劝斜阳，且向花间留晚照。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T09:48:42.444276"
  },
  {
    "id": "5b8b9572e116fb3714e6fc69",
    "content": "红豆生南国，春来发几枝。",
    "popularity": 992000,
    "origin": {
      "title": "相思",
      "dynasty": "唐代",
      "author": "王维",
      "content": ["红豆生南国，春来发几枝。", "愿君多采撷，此物最相思。"],
      "translate": [
        "鲜红浑圆的红豆，生长在阳光明媚的南方，春暖花开的季节，不知又生出多少？",
        "希望思念的人儿多多采集，小小红豆引人相思。"
      ]
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T09:48:42.444276"
  },
  {
    "id": "5b8b9572e116fb3714e6fe40",
    "content": "春风得意马蹄疾，一日看尽长安花。",
    "popularity": 1180000,
    "origin": {
      "title": "登科后",
      "dynasty": "唐代",
      "author": "孟郊",
      "content": ["昔日龌龊不足夸，今朝放荡思无涯。", "春风得意马蹄疾，一日看尽长安花。"],
      "translate": [
        "往昔的困顿日子再也不足一提，今日金榜题名令人神采飞扬。",
        "迎着浩荡春风得意地纵马奔驰，好像一日之内赏遍京城名花。"
      ]
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T09:48:42.444276"
  },
  {
    "id": "5b8b9572e116fb3714e73909",
    "content": "年去年来常不老，春比人顽。",
    "popularity": 803000,
    "origin": {
      "title": "卖花声·立春",
      "dynasty": "清代",
      "author": "黄景仁",
      "content": [
        "独饮对辛盘，愁上眉弯。楼窗今夜且休关。前度落红流到海，燕子衔还。",
        "书贴更簪欢，旧例都删。到时风雪满千山。年去年来常不老，春比人顽。"
      ],
      "translate": null
    },
    "matchTags": ["春"],
    "recommendedReason": "",
    "cacheAt": "2019-05-25T09:48:42.444276"
  }
]
