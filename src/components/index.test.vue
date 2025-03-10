<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="callPreload">Call Preload Function</button>
    <button @click="pingMain">Ping Main Process</button>
    <button @click="setWallpaper">Set Wallpaper</button>
    <button @click="getStoreAll">Get All Params</button>
    <button @click="getWaveColor">Get Wave Color</button>
    <button @click="setWaveColor">Set Wave Color</button>
    <button @click="getChangeInterval">Get Interval</button>
    <button @click="setChangeInterval">Set Interval</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')

// 监听主进程消息
onMounted(() => {
  window.electronAPI.onMessage((msg) => {
    message.value = msg
  })
})

// 调用 preload.js 中的异步函数
async function callPreload() {
  message.value = await window.electronAPI.sayHello()
}

// 调用 preload.js 中与主进程通信的异步函数
async function pingMain() {
  message.value = await window.electronAPI.ping()
}

// 调用 preload.js 中设置墙纸的函数
async function setWallpaper() {
  const result = await window.electronAPI.setWallpaper('C:\\Users\\kamus\\OneDrive\\Pictures\\wallpapers\\zenwaves\\1741257794853.png')
  message.value = result ? '壁纸设置成功' : '壁纸设置失败'
}

// 获取所有参数
async function getStoreAll() {
  const params = await window.electronAPI.getStore('wallpaperParams')
  message.value = JSON.stringify(params, null, 2)
}

// 获取波浪颜色
async function getWaveColor() {
  const color = await window.electronAPI.getStore('wallpaperParams.waveColor')
  message.value = `当前波浪颜色: ${color || '未设置'}`
}

// 设置波浪颜色
async function setWaveColor() {
  await window.electronAPI.setStore('wallpaperParams.waveColor', 'blue')
  message.value = '波浪颜色已设置为蓝色'
}

// 获取更换间隔
async function getChangeInterval() {
  const interval = await window.electronAPI.getStore('wallpaperParams.changeInterval')
  message.value = `当前更换间隔: ${interval} 分钟`
}

// 设置更换间隔
async function setChangeInterval() {
  await window.electronAPI.setStore('wallpaperParams.changeInterval', 30)
  message.value = '更换间隔已设置为 30 分钟'
}
</script>
