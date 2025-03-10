<script lang="ts" setup>
import { reactive, onMounted, onUnmounted, watch } from 'vue'
import p5 from 'p5'

import waves from './waves.js'
import getRandomColor from './getRandomColor.js'
import loadPoem from './loadPoem.js'
import { INTERVAL_OPTIONS, FONT_OPTIONS } from './config.js'

// 从存储中获取初始值或使用默认值
const poemData = reactive({
  content: '',
  author: '',
  title: ''
})

const wallpaperParams = reactive({
  waveColor: '',
  isDarkMode: true,
  changeInterval: 60,
  fontFamily: 'JXZhuoKai'
});

// 初始化存储值
async function initializeStore() {
  const params = await window.electronAPI.getStore('wallpaperParams');
  //console.log('[DEBUG] 从存储中获取参数:', params);
  if (params) {
    Object.assign(wallpaperParams, params);
  }
}

// 监听参数变化并保存到存储中
watch(wallpaperParams, (newValue) => {
  //console.log('[DEBUG] 参数变化:', newValue);
  const plainParams = JSON.parse(JSON.stringify(newValue));
  window.electronAPI.setStore('wallpaperParams', plainParams);
}, { deep: true });

let p5Instance: any = null
let autoChangeTimer: ReturnType<typeof setInterval> | null = null

// 壁纸相关方法
const wallpaperMethods = {
  // 获取诗词
  fetchPoem () {
    loadPoem(
      (result) => {
        poemData.content = result.data.content
        poemData.author = result.data.origin.author
        poemData.title = result.data.origin.title
        updateP5Instance()
      }
    );
  },
  stopAutoChange () {
    if (autoChangeTimer) {
      clearInterval(autoChangeTimer)
      autoChangeTimer = null
    }
  },
  startAutoChange () {
    wallpaperMethods.stopAutoChange()

    const interval = Number(wallpaperParams.changeInterval)
    const milliseconds = interval < 1 ? interval * 60 * 1000 : interval * 60 * 1000

    autoChangeTimer = setInterval(async () => {
      try {
        // 更新诗词
        wallpaperParams.waveColor = getRandomColor(wallpaperParams.isDarkMode)
        await wallpaperMethods.fetchPoem()
        
        // 给予足够的时间让p5实例完成渲染
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 设置壁纸
        await setWallpaper()
      } catch (error) {
        console.error('自动更新壁纸失败:', error);
      }
    }, milliseconds)
  }
}

// 参数变化函数
const changeMethods = {
  // 更换背景色
  onChangeTheme () {
    wallpaperParams.isDarkMode = !wallpaperParams.isDarkMode
    updateP5Instance()
  },

  // 更换波浪颜色
  onChangeWavecolor () {
    wallpaperParams.waveColor = getRandomColor(wallpaperParams.isDarkMode)
    updateP5Instance()
  },

  // 更换间隔
  onChangeInterval (value: number) {
    wallpaperParams.changeInterval = value

    if (value > 0) {
      wallpaperMethods.startAutoChange()
    } else {
      wallpaperMethods.stopAutoChange()
    }
  },

  // 更换字体
  onChangeFont (value: string) {
    wallpaperParams.fontFamily = value
    updateP5Instance()
  }
}

// 更新实例
function updateP5Instance () {
  if (!p5Instance) return

  // 如果是新的随机颜色，则更新颜色
  if (!wallpaperParams.waveColor) {
    wallpaperParams.waveColor = getRandomColor(wallpaperParams.isDarkMode)
  }
  
  // 使用类型断言确保 p5Instance 有 updateWithProps 方法
  (p5Instance as any).updateWithProps({
    isDarkMode: wallpaperParams.isDarkMode,
    waveColor: wallpaperParams.waveColor,
    poem: poemData,
    fontFamily: wallpaperParams.fontFamily
  })
}

// 设置电脑壁纸
async function setWallpaper() {
  try {
    // 确保字体加载完成
    await document.fonts.ready
    
    // 创建壁纸画布并获取数据 URL
    const dataUrl = await (p5Instance as any).createWallpaperCanvas()
    if (!dataUrl) {
      throw new Error('无法创建壁纸画布')
    }
    
    // 保存壁纸
    const imagePath = await window.electronAPI.writeImageFile(dataUrl)
    if (!imagePath) {
      throw new Error('无法保存壁纸图片')
    }
    
    // 设置壁纸
    const result = await window.electronAPI.setWallpaper(imagePath)
    if (!result) {
      throw new Error('设置壁纸失败')
    }

    console.log('壁纸设置成功')
  } catch (error) {
    console.error('设置壁纸失败:', error)
    throw error
  }
}

// 组件挂载时的初始化
onMounted(async () => {
  await initializeStore()
  
  // 创建 p5 实例
  const container = document.getElementById('waves-container')
  if (!container) return
  
  p5Instance = new p5((p) => {
    waves(p)
    updateP5Instance()
  }, container)
  
  // 获取初始诗词
  wallpaperMethods.fetchPoem()
  
  // 如果设置了自动更换间隔，启动自动更换
  if (wallpaperParams.changeInterval > 0) {
    wallpaperMethods.startAutoChange()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  wallpaperMethods.stopAutoChange()
  if (p5Instance) {
    (p5Instance as any).remove()
    p5Instance = null
  }
})
</script>

<template>
  <div class="wallpaper">
    <div class="settings">
      <div class="button-group">
        <button class="set-button refresh-button" @click="wallpaperMethods.fetchPoem">诗词切换</button>
        <button class="set-button refresh-button" @click="changeMethods.onChangeWavecolor">颜色切换</button>
        <button class="set-button" @click="changeMethods.onChangeTheme">{{ wallpaperParams.isDarkMode ? '更换浅色背景' : '更换深色背景' }}</button>
        <button class="set-button" @click="setWallpaper">设置为电脑壁纸</button>
      </div>
      <div class="select-group">
        <div class="interval-setting">
          自动更换壁纸间隔：
          <select
            :value="wallpaperParams.changeInterval"
            @change="e => changeMethods.onChangeInterval(Number((e.target as HTMLSelectElement).value))"
            class="interval-select"
          >
            <option v-for="option in INTERVAL_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="interval-setting">
          壁纸字体：
          <select
            :value="wallpaperParams.fontFamily"
            @change="e => changeMethods.onChangeFont((e.target as HTMLSelectElement).value)"
            class="interval-select"
          >
            <option v-for="option in FONT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="preview" :style="{ backgroundColor: wallpaperParams.isDarkMode ? '#323232' : '#e6e6e6' }">
      <div id="waves-container" class="waves-container"></div>
    </div>
  </div>
</template>

<style>
.wallpaper {
  height: calc(100vh - 30px);
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px;
}

.settings {
  display: flex;
  margin-bottom: 14px;
  justify-content: space-between;
}

.button-group {
  display: flex;
  gap: 10px;
}

.select-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.interval-setting {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.set-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4a4a4a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.set-button:hover {
  background-color: #666;
}

.interval-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #4a4a4a;
  color: white;
  cursor: pointer;
}

.preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: white;
  position: relative;
  overflow: hidden;
}

.waves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>