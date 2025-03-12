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
  fontFamily: 'JXZhuoKai',
  autoDeleteWallpaper: true,
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

// 通知函数
function showNotification(message, type = 'info') {
  // 显示界面内通知
  const notificationContainer = document.createElement('div');
  notificationContainer.className = `notification notification-${type}`;
  notificationContainer.textContent = message;
  document.body.appendChild(notificationContainer);
  
  // 3秒后自动移除
  setTimeout(() => {
    if (document.body.contains(notificationContainer)) {
      document.body.removeChild(notificationContainer);
    }
  }, 3000);
  
  // 同时调用 Electron 的通知 API
  if (window.electronAPI && window.electronAPI.showNotification) {
    window.electronAPI.showNotification(message, type).catch(error => {
      console.error('Electron 通知 API 调用失败:', error);
    });
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
      throw new Error('壁纸设置失败')
    }

    showNotification('壁纸设置成功', 'success')
  } catch (error) {
    console.error('壁纸设置失败:', error)
    // 显示用户友好的错误提示，而不是抛出错误
    showNotification(`壁纸设置失败: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    return false
  }
  return true
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
        <button class="set-button refresh-button" @click="wallpaperMethods.fetchPoem">Motto</button>
        <button class="set-button refresh-button" @click="changeMethods.onChangeWavecolor">Ripple</button>
        <button class="set-button" @click="changeMethods.onChangeTheme">{{ wallpaperParams.isDarkMode ? 'Dawn' : 'Dusk' }}</button>
        <button class="set-button" @click="setWallpaper">Apply</button>
        <label class="auto-delete-label">
          <input
            type="checkbox"
            v-model="wallpaperParams.autoDeleteWallpaper"
            class="auto-delete-checkbox"
          >
          Auto Clean
          <span class="tooltip-icon" data-tooltip="Clean up temporary files after setting wallpaper">?</span>
        </label>
      </div>
      <div class="select-group">
        <div class="interval-setting">
          Auto Change
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
          Font Style
          <select
            :value="wallpaperParams.fontFamily"
            @change="e => changeMethods.onChangeFont((e.target as HTMLSelectElement).value)"
            class="font-select"
            :style="{ fontFamily: wallpaperParams.fontFamily }"
          >
            <option 
              v-for="option in FONT_OPTIONS" 
              :key="option.value" 
              :value="option.value"
              :style="{ fontFamily: option.value }"
            >
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
  background-color: #2a2a2a;
}

.settings {
  display: flex;
  margin-bottom: 14px;
  justify-content: space-between;
  background-color: #363636;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.button-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.select-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

.interval-setting {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #e0e0e0;
  font-size: 14px;
}

.set-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.set-button:hover {
  background-color: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.set-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-button {
  background-color: #42b983;
}

.refresh-button:hover {
  background-color: #3aa876;
}

.interval-select {
  padding: 8px 12px;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  background-color: #424242;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  margin-left: 8px;
  min-width: 120px;
}

.interval-select:hover {
  border-color: #4a90e2;
  background-color: #484848;
}

.interval-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.font-select {
  min-width: 140px;
  padding: 8px 12px;
  font-size: 16px;
  line-height: 1.5;
  background-color: #363636;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.font-select:hover {
  border-color: #666;
}

.font-select option {
  padding: 8px;
  font-size: 16px;
  line-height: 1.5;
  background-color: #363636;
}

.font-select option:hover {
  background-color: #4a4a4a;
}

.auto-delete-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #363636;
  position: relative;
  color: #e0e0e0;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.auto-delete-label:hover {
  background-color: #424242;
}

.auto-delete-checkbox {
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #4a90e2;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  background-color: #363636;
  transition: all 0.2s ease;
}

.auto-delete-checkbox:checked {
  background-color: #4a90e2;
}

.auto-delete-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.auto-delete-checkbox:hover {
  border-color: #357abd;
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a4a4a;
  color: #fff;
  font-size: 12px;
  cursor: help;
  position: relative;
}

.tooltip-icon::before {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  padding: 8px 12px;
  background: #2a2a2a;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.tooltip-icon::after {
  content: '';
  position: absolute;
  top: calc(100% + 3px);
  left: 10px;
  border: 5px solid transparent;
  border-bottom-color: #2a2a2a;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
}

.tooltip-icon:hover::before,
.tooltip-icon:hover::after {
  visibility: visible;
  opacity: 1;
}

.preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.waves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
}

.notification-success {
  background-color: #42b983;
}

.notification-error {
  background-color: #e74c3c;
}

.notification-info {
  background-color: #4a90e2;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}
</style>