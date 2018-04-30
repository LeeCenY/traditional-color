;(function(window, undefined){

  "use strict";

  function rgbStrToArr(str) {
    // from text "rgb(4,8,16)" to arr [4, 8, 16]
    var result = /([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})/i.exec(str);
    return result ? [ parseInt(result[1]), parseInt(result[2]), parseInt(result[3]) ] : null;
  }

  function distance3D(a, b) {
    return (Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2) + Math.pow((a[2] - b[2]), 2))
  }

  function countUpNearColor(colors, rgb, count) {
    const colorsArr = colors.map((color) => {
      return(rgbStrToArr(color.rgb))
    })

    let i = 0,
        approximationIndex = 0,
        minDiff = Math.abs(distance3D(colorsArr[0], rgbStrToArr(rgb))),
        diff;

    while (++i < colorsArr.length) {
      diff = Math.abs(distance3D(colorsArr[i], rgbStrToArr(rgb)));

      if (diff < minDiff) {
        minDiff = diff;
        approximationIndex = i;
      }
    }
    colors[approximationIndex].count += count
    return colors;
  }

  // Helper functions.
  var getContext = function(width, height){
    var canvas = document.createElement("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    return canvas.getContext('2d');
  };

  var getImageData = (img, loaded) => {

    var imgObj = new Image();
    var imgSrc = img.src || img;

    // Can't set cross origin to be anonymous for data url's
    // https://github.com/mrdoob/three.js/issues/1305
    if ( imgSrc.substring(0,5) !== 'data:' )
      imgObj.crossOrigin = "Anonymous";

    imgObj.onload = function(){
      var context = getContext(imgObj.width, imgObj.height);
      context.drawImage(imgObj, 0, 0);

      var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
      loaded && loaded(imageData.data);
    };

    imgObj.src = imgSrc;

  };

  var makeRGB = function(name){
    return ['rgb(', name, ')'].join('');
  };

  var mapPalette = function(palette){
    var arr = [];
    for (var prop in palette) { arr.push( frmtPobj(prop, palette[prop]) ) };
    arr.sort(function(a, b) { return (b.count - a.count) });
    return arr;
  };

  var fitPalette = function(arr, fitSize) {
    if (arr.length > fitSize ) {
      return arr.slice(0,fitSize);
    } else {
      for (var i = arr.length-1 ; i < fitSize-1; i++) { arr.push( frmtPobj('0,0,0', 0) ) };
      return arr;
    };
  };

  var frmtPobj = function(a,b){
    return {name: makeRGB(a), count: b};
  }


  // RGBaster Object
  // ---------------
  //
  var PALETTESIZE = 10;

  var RGBaster = {};

  const traditionalColorsJP = [{"colorName":"桜色","colorRuby":"さくらいろ","rgb":"rgb(254,244,244)","hex":"#fef4f4","count":0},{"colorName":"小豆色","colorRuby":"あずきいろ","rgb":"rgb(150,81,77)","hex":"#96514d","count":0},{"colorName":"萌葱色","colorRuby":"もえぎいろ","rgb":"rgb(0,110,84)","hex":"#006e54","count":0},{"colorName":"古代紫","colorRuby":"こだいむらさき","rgb":"rgb(137,91,138)","hex":"#895b8a","count":0},{"colorName":"枯茶","colorRuby":"からちゃ","rgb":"rgb(141,100,73)","hex":"#8d6449","count":0},{"colorName":"芥子色","colorRuby":"からしいろ","rgb":"rgb(208,175,76)","hex":"#d0af4c","count":0},{"colorName":"水浅葱","colorRuby":"みずあさぎ","rgb":"rgb(128,171,169)","hex":"#80aba9","count":0},{"colorName":"珊瑚色","colorRuby":"さんごいろ","rgb":"rgb(245,177,170)","hex":"#f5b1aa","count":0},{"colorName":"黄橡","colorRuby":"きつるばみ","rgb":"rgb(182,141,76)","hex":"#b68d4c","count":0},{"colorName":"利休鼠","colorRuby":"りきゅうねずみ","rgb":"rgb(136,142,126)","hex":"#888e7e","count":0},{"colorName":"海松茶","colorRuby":"みるちゃ","rgb":"rgb(90,84,75)","hex":"#5a544b","count":0},{"colorName":"浅紫","colorRuby":"あさむらさき","rgb":"rgb(196,163,191)","hex":"#c4a3bf","count":0},{"colorName":"鴇色","colorRuby":"ときいろ","rgb":"rgb(244,179,194)","hex":"#f4b3c2","count":0},{"colorName":"藍鼠","colorRuby":"あいねず","rgb":"rgb(108,132,141)","hex":"#6c848d","count":0},{"colorName":"胡桃色","colorRuby":"くるみいろ","rgb":"rgb(168,111,76)","hex":"#a86f4c","count":0},{"colorName":"舛花色","colorRuby":"ますはないろ","rgb":"rgb(91,126,145)","hex":"#5b7e91","count":0},{"colorName":"朽葉色","colorRuby":"くちばいろ","rgb":"rgb(145,115,71)","hex":"#917347","count":0},{"colorName":"石竹色","colorRuby":"せきちくいろ","rgb":"rgb(229,171,190)","hex":"#e5abbe","count":0},{"colorName":"伽羅色","colorRuby":"きゃらいろ","rgb":"rgb(216,163,115)","hex":"#d8a373","count":0},{"colorName":"鳩羽鼠","colorRuby":"はとばねずみ","rgb":"rgb(158,139,142)","hex":"#9e8b8e","count":0},{"colorName":"江戸茶","colorRuby":"えどちゃ","rgb":"rgb(205,140,92)","hex":"#cd8c5c","count":0},{"colorName":"媚茶","colorRuby":"こびちゃ","rgb":"rgb(113,98,70)","hex":"#716246","count":0},{"colorName":"亜麻色","colorRuby":"あまいろ","rgb":"rgb(214,198,175)","hex":"#d6c6af","count":0},{"colorName":"梅鼠","colorRuby":"うめねず","rgb":"rgb(192,153,160)","hex":"#c099a0","count":0},{"colorName":"狐色","colorRuby":"きつねいろ","rgb":"rgb(195,135,67)","hex":"#c38743","count":0},{"colorName":"灰汁色","colorRuby":"あくいろ","rgb":"rgb(158,148,120)","hex":"#9e9478","count":0},{"colorName":"利休茶","colorRuby":"りきゅうちゃ","rgb":"rgb(165,149,100)","hex":"#a59564","count":0},{"colorName":"水色","colorRuby":"みずいろ","rgb":"rgb(188,226,232)","hex":"#bce2e8","count":0},{"colorName":"瓶覗","colorRuby":"かめのぞき","rgb":"rgb(162,215,221)","hex":"#a2d7dd","count":0},{"colorName":"雀茶","colorRuby":"すずめちゃ","rgb":"rgb(170,79,55)","hex":"#aa4f37","count":0},{"colorName":"梅幸茶","colorRuby":"ばいこうちゃ","rgb":"rgb(136,121,56)","hex":"#887938","count":0},{"colorName":"空色","colorRuby":"そらいろ","rgb":"rgb(160,216,239)","hex":"#a0d8ef","count":0},{"colorName":"柿渋色","colorRuby":"かきしぶいろ","rgb":"rgb(159,86,58)","hex":"#9f563a","count":0},{"colorName":"勿忘草色","colorRuby":"わすれなぐさいろ","rgb":"rgb(137,195,235)","hex":"#89c3eb","count":0},{"colorName":"今様色","colorRuby":"いまよういろ","rgb":"rgb(208,87,107)","hex":"#d0576b","count":0},{"colorName":"浅縹","colorRuby":"あさはなだ","rgb":"rgb(132,185,203)","hex":"#84b9cb","count":0},{"colorName":"鳶色","colorRuby":"とびいろ","rgb":"rgb(149,72,63)","hex":"#95483f","count":0},{"colorName":"納戸色","colorRuby":"なんどいろ","rgb":"rgb(0,136,153)","hex":"#008899","count":0},{"colorName":"浅葱色","colorRuby":"あさぎいろ","rgb":"rgb(0,163,175)","hex":"#00a3af","count":0},{"colorName":"海松色","colorRuby":"みるいろ","rgb":"rgb(114,109,64)","hex":"#726d40","count":0},{"colorName":"鶯色","colorRuby":"うぐいすいろ","rgb":"rgb(146,140,54)","hex":"#928c36","count":0},{"colorName":"新橋色","colorRuby":"しんばしいろ","rgb":"rgb(89,185,198)","hex":"#59b9c6","count":0},{"colorName":"褐色","colorRuby":"かっしょく","rgb":"rgb(138,59,0)","hex":"#8a3b00","count":0},{"colorName":"天色","colorRuby":"あまいろ","rgb":"rgb(44,169,225)","hex":"#2ca9e1","count":0},{"colorName":"紅","colorRuby":"くれない","rgb":"rgb(215,0,58)","hex":"#d7003a","count":0},{"colorName":"鶸色","colorRuby":"ひわいろ","rgb":"rgb(215,207,58)","hex":"#d7cf3a","count":0},{"colorName":"若草色","colorRuby":"わかくさいろ","rgb":"rgb(195,216,37)","hex":"#c3d825","count":0},{"colorName":"唐茶","colorRuby":"からちゃ","rgb":"rgb(120,60,29)","hex":"#783c1d","count":0},{"colorName":"縹色","colorRuby":"はなだいろ","rgb":"rgb(39,146,195)","hex":"#2792c3","count":0},{"colorName":"煎茶色","colorRuby":"せんちゃいろ","rgb":"rgb(140,100,80)","hex":"#8c6450","count":0},{"colorName":"栗色","colorRuby":"くりいろ","rgb":"rgb(118,47,7)","hex":"#762f07","count":0},{"colorName":"若菜色","colorRuby":"わかないろ","rgb":"rgb(216,230,152)","hex":"#d8e698","count":0},{"colorName":"錆色","colorRuby":"さびいろ","rgb":"rgb(108,53,36)","hex":"#6c3524","count":0},{"colorName":"若苗色","colorRuby":"わかなえいろ","rgb":"rgb(199,220,104)","hex":"#c7dc68","count":0},{"colorName":"煤竹色","colorRuby":"すすたけいろ","rgb":"rgb(111,81,76)","hex":"#6f514c","count":0},{"colorName":"茜色","colorRuby":"あかねいろ","rgb":"rgb(183,40,46)","hex":"#b7282e","count":0},{"colorName":"焦茶","colorRuby":"こげちゃ","rgb":"rgb(111,75,62)","hex":"#6f4b3e","count":0},{"colorName":"苔色","colorRuby":"こけいろ","rgb":"rgb(105,130,27)","hex":"#69821b","count":0},{"colorName":"涅色","colorRuby":"くりいろ","rgb":"rgb(85,71,56)","hex":"#554738","count":0},{"colorName":"苗色","colorRuby":"なえいろ","rgb":"rgb(176,202,113)","hex":"#b0ca71","count":0},{"colorName":"金茶","colorRuby":"きんちゃ","rgb":"rgb(243,152,0)","hex":"#f39800","count":0},{"colorName":"深縹","colorRuby":"こきはなだ","rgb":"rgb(42,64,115)","hex":"#2a4073","count":0},{"colorName":"柳色","colorRuby":"やなぎいろ","rgb":"rgb(168,201,127)","hex":"#a8c97f","count":0},{"colorName":"白茶","colorRuby":"しらちゃ","rgb":"rgb(221,187,153)","hex":"#ddbb99","count":0},{"colorName":"柿色","colorRuby":"かきいろ","rgb":"rgb(237,109,61)","hex":"#ed6d3d","count":0},{"colorName":"生成り色","colorRuby":"きなりいろ","rgb":"rgb(251,250,245)","hex":"#fbfaf5","count":0},{"colorName":"老竹色","colorRuby":"おいたけいろ","rgb":"rgb(118,145,100)","hex":"#769164","count":0},{"colorName":"橙色","colorRuby":"だいだいいろ","rgb":"rgb(238,120,0)","hex":"#ee7800","count":0},{"colorName":"藤色","colorRuby":"ふじいろ","rgb":"rgb(187,188,222)","hex":"#bbbcde","count":0},{"colorName":"朱色","colorRuby":"しゅいろ","rgb":"rgb(235,97,1)","hex":"#eb6101","count":0},{"colorName":"深川鼠","colorRuby":"ふかがわねずみ","rgb":"rgb(151,167,145)","hex":"#97a791","count":0},{"colorName":"銀鼠","colorRuby":"ぎんねず","rgb":"rgb(175,175,176)","hex":"#afafb0","count":0},{"colorName":"薄墨色","colorRuby":"うすずみいろ","rgb":"rgb(163,163,162)","hex":"#a3a3a2","count":0},{"colorName":"青鈍","colorRuby":"あおにび","rgb":"rgb(107,123,110)","hex":"#6b7b6e","count":0},{"colorName":"桔梗色","colorRuby":"ききょういろ","rgb":"rgb(86,84,162)","hex":"#5654a2","count":0},{"colorName":"鼠色","colorRuby":"ねずみいろ","rgb":"rgb(148,148,149)","hex":"#949495","count":0},{"colorName":"灰色","colorRuby":"はいいろ","rgb":"rgb(125,125,125)","hex":"#7d7d7d","count":0},{"colorName":"千歳緑","colorRuby":"ちとせみどり","rgb":"rgb(49,103,69)","hex":"#316745","count":0},{"colorName":"鉛色","colorRuby":"なまりいろ","rgb":"rgb(123,124,125)","hex":"#7b7c7d","count":0},{"colorName":"菜の花色","colorRuby":"なのはないろ","rgb":"rgb(255,236,71)","hex":"#ffec47","count":0},{"colorName":"若竹色","colorRuby":"わかたけいろ","rgb":"rgb(104,190,141)","hex":"#68be8d","count":0},{"colorName":"鈍色","colorRuby":"にびいろ","rgb":"rgb(114,113,113)","hex":"#727171","count":0},{"colorName":"黄檗色","colorRuby":"きはだいろ","rgb":"rgb(254,242,99)","hex":"#fef263","count":0},{"colorName":"常磐色","colorRuby":"ときわいろ","rgb":"rgb(0,123,67)","hex":"#007b43","count":0},{"colorName":"消炭色","colorRuby":"けしずみいろ","rgb":"rgb(82,78,77)","hex":"#524e4d","count":0},{"colorName":"曙色","colorRuby":"あけぼのいろ","rgb":"rgb(241,144,114)","hex":"#f19072","count":0},{"colorName":"刈安色","colorRuby":"かりやすいろ","rgb":"rgb(245,229,107)","hex":"#f5e56b","count":0},{"colorName":"千草色","colorRuby":"ちぐさいろ","rgb":"rgb(146,181,169)","hex":"#92b5a9","count":0},{"colorName":"江戸紫","colorRuby":"えどむらさき","rgb":"rgb(116,83,153)","hex":"#745399","count":0},{"colorName":"青磁色","colorRuby":"せいじいろ","rgb":"rgb(126,190,165)","hex":"#7ebea5","count":0},{"colorName":"羊羹色","colorRuby":"ようかんいろ","rgb":"rgb(56,60,60)","hex":"#383c3c","count":0},{"colorName":"青竹色","colorRuby":"あおたけいろ","rgb":"rgb(126,190,171)","hex":"#7ebeab","count":0},{"colorName":"葡萄色","colorRuby":"ぶどういろ","rgb":"rgb(82,47,96)","hex":"#522f60","count":0},{"colorName":"木賊色","colorRuby":"とくさいろ","rgb":"rgb(59,121,96)","hex":"#3b7960","count":0},{"colorName":"山吹色","colorRuby":"やまぶきいろ","rgb":"rgb(248,181,0)","hex":"#f8b500","count":0},{"colorName":"遠州茶","colorRuby":"えんしゅうちゃ","rgb":"rgb(202,130,105)","hex":"#ca8269","count":0},{"colorName":"鬱金色","colorRuby":"うこんいろ","rgb":"rgb(250,191,20)","hex":"#fabf14","count":0}]

  RGBaster.colors = function(img, opts){

    opts = opts || {};
    const exclude = opts.exclude || [ ]; // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
    const paletteSize = opts.paletteSize || PALETTESIZE;
    const TRADITIONAL_COLORS = opts.colors || traditionalColorsJP;
    const traditionalColors = TRADITIONAL_COLORS.slice(0, -1);

    getImageData(img, function(data){

              var colorCounts   = {},
                  rgbString     = '',
                  rgb           = [],
                  traditionalColorsCounts = {};

              console.log(TRADITIONAL_COLORS)
              var i = 0;
              for (; i < data.length; i += 4) {
                rgb[0] = data[i];
                rgb[1] = data[i+1];
                rgb[2] = data[i+2];
                rgbString = rgb.join(",");

                // skip undefined data and transparent pixels
                if (rgb.indexOf(undefined) !== -1  || data[i + 3] === 0) {
                  continue;
                }

                // Ignore those colors in the exclude list.
                if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
                  if ( rgbString in colorCounts ) {
                    colorCounts[rgbString] = colorCounts[rgbString] + 1;
                  }
                  else{
                    colorCounts[rgbString] = 1;
                  }
                }
              }

              Object.keys(colorCounts).map((key) => {
                countUpNearColor(traditionalColors, key, colorCounts[key])
              });

              if ( opts.success ) {
                var palette = fitPalette( mapPalette(colorCounts), paletteSize+1 );
                opts.success({
                  dominant: palette[0].name,
                  secondary: palette[1].name,
                  palette:  palette.map(function(c){ return c.name; }).slice(1),
                  sumPaletteArea: traditionalColors.map((a) => {return (a.count)}).reduce((a, b) => a + b ),
                  traditionalColors: traditionalColors.sort((a, b)=> { return (b.count - a.count) }).slice(0, paletteSize),
                });
              }
    });
  };

  window.RGBaster = window.RGBaster || RGBaster;

})(window);