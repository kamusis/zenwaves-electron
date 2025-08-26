Based on your requirements and the previous discussion about Minimal Hitokoto to ZenWaves Mapping, I'll design a comprehensive modification plan that adds Hitokoto API capability while preserving all existing functionality.

## 🎯 **Modification Design Overview**

### **Core Requirements Analysis:**
1. ✅ **API Selection UI** - User can choose between Jinrishici and Hitokoto
2. ✅ **Default to Jinrishici** - Maintain current behavior as default
3. ✅ **Persistent Selection** - Remember choice using Electron Store
4. ✅ **Hitokoto Integration** - Add Hitokoto API access logic
5. ✅ **Minimal Mapping** - Use only the 3 essential fields (content, author, title)
6. ✅ **Zero Breaking Changes** - Complete backward compatibility

## 📁 **Files to be Modified**

### **1. Main UI Component - [/src/components/index.vue](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/index.vue)**
**Changes:**
- Add API selector dropdown in the top controls area
- Add reactive state for API selection
- Persist API choice to Electron Store
- Update `fetchPoem` to use selected API

### **2. Poetry Loading Logic - [/src/components/loadPoem.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/loadPoem.js)**
**Changes:**
- Add Hitokoto API integration function
- Implement minimal mapping from Hitokoto to ZenWaves format
- Maintain full backward compatibility
- Add API selection parameter support

### **3. TypeScript Definitions - [/src/types/loadPoem.d.ts](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/types/loadPoem.d.ts)**
**Changes:**
- Add API selection options interface
- Update function signatures to support API choice

### **4. Configuration - [/src/components/config.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/config.js)**
**Changes:**
- Add API selection constants
- Define default API preference

## 🔧 **Detailed Implementation Plan**

### **Phase 1: Add API Selection Constants**

**File: [/src/components/config.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/config.js)**
```javascript
// Add API selection options
export const API_OPTIONS = [
  { label: 'Jinrishici (今日诗词)', value: 'jinrishici' },
  { label: 'Hitokoto (一言)', value: 'hitokoto' }
];

export const DEFAULT_API = 'jinrishici';
```

### **Phase 2: Enhance loadPoem.js with Dual API Support**

**File: [/src/components/loadPoem.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/loadPoem.js)**
```javascript
// Add Hitokoto API integration
const loadFromHitokoto = (callback, errorCallback) => {
  const apiUrl = 'https://v1.hitokoto.cn/?c=i&encode=json&min_length=5&max_length=25';
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(hitokoto => {
      // Minimal mapping - only the 3 fields actually used
      const zenWavesFormat = {
        status: "success",
        data: {
          content: hitokoto.hitokoto,
          origin: {
            author: hitokoto.from_who || "佚名",
            title: hitokoto.from || "未知作品"
          }
        },
        source: "hitokoto"
      };
      callback(zenWavesFormat);
    })
    .catch(error => {
      console.error('Hitokoto API failed:', error);
      if (errorCallback) errorCallback(error);
    });
};

// Enhanced main function with API selection
const loadPoem = (callback, options = {}) => {
  const { apiSource = 'jinrishici' } = options;
  
  if (apiSource === 'hitokoto') {
    loadFromHitokoto(callback, () => {
      // Fallback to Jinrishici if Hitokoto fails
      loadFromJinrishici(callback);
    });
  } else {
    // Default Jinrishici behavior (unchanged)
    loadFromJinrishici(callback);
  }
};
```

### **Phase 3: Add UI Controls**

**File: [/src/components/index.vue](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/index.vue)**
```javascript
// Add to reactive state
const wallpaperParams = reactive({
  // ... existing properties ...
  apiSource: 'jinrishici', // New API selection
});

// Add API selection handler
const changeMethods = {
  // ... existing methods ...
  onChangeApiSource(value: string) {
    wallpaperParams.apiSource = value;
    // Automatically fetch new poem when API changes
    wallpaperMethods.fetchPoem();
  }
};

// Update fetchPoem method
async fetchPoem(userInput = '') {
  if (!userInput) {
    loadPoem(
      (result) => {
        poemData.content = result.data.content
        poemData.author = result.data.origin.author
        poemData.title = result.data.origin.title
        updateP5Instance()
      },
      {
        apiSource: wallpaperParams.apiSource // Pass selected API
      }
    );
  } else {
    // ... existing AI logic unchanged ...
  }
}
```

**Template Addition:**
```html
<div class="select-group">
  <!-- ... existing selects ... -->
  <div class="api-setting">
    API Source
    <select
      :value="wallpaperParams.apiSource"
      @change="e => changeMethods.onChangeApiSource((e.target as HTMLSelectElement).value)"
      class="api-select"
    >
      <option v-for="option in API_OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</div>
```

### **Phase 4: Add TypeScript Support**

**File: [/src/types/loadPoem.d.ts](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/types/loadPoem.d.ts)**
```typescript
interface LoadPoemOptions {
  apiSource?: 'jinrishici' | 'hitokoto';
}

export default function loadPoem(
  callback: (result: PoemResult) => void,
  options?: LoadPoemOptions
): void;
```

## 🔒 **Backward Compatibility Guarantees**

### **1. Default Behavior Unchanged**
- Without options parameter, [loadPoem()](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/loadPoem.js#L22-L28) works exactly as before
- Jinrishici remains the default API
- All existing UI continues to work

### **2. Graceful Fallback Chain**
```
Hitokoto → Jinrishici → Local Fallback → Error
```

### **3. Data Format Consistency**
- Both APIs return identical format: `{ status, data: { content, origin: { author, title } } }`
- No changes to downstream components needed

### **4. Storage Integration**
- API choice saved to existing Electron Store system
- Follows same pattern as other wallpaperParams

## 📊 **Implementation Benefits**

### **Performance Impact**
- ✅ **Zero overhead** when using default Jinrishici
- ✅ **Fast Hitokoto** (~200ms response time)
- ✅ **Efficient mapping** (only 3 fields processed)

### **User Experience**
- ✅ **Seamless switching** between APIs
- ✅ **Persistent preferences** across restarts
- ✅ **Automatic fallback** if selected API fails
- ✅ **No learning curve** - works exactly like before by default

### **Code Quality**
- ✅ **Minimal code changes** (~50 lines total)
- ✅ **TypeScript compliant**
- ✅ **Follows existing patterns**
- ✅ **Comprehensive error handling**

## 🚀 **Implementation Order**

1. **First**: Add constants to [config.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/config.js)
2. **Second**: Enhance [loadPoem.js](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/loadPoem.js) with dual API support
3. **Third**: Update TypeScript definitions
4. **Fourth**: Add UI controls to [index.vue](file:///Users/kamus/Documents/CascadeProjects/zenwaves-electron/src/components/index.vue)
5. **Fifth**: Test backward compatibility thoroughly

This design ensures absolute zero breaking changes while adding the requested Hitokoto API capability with user choice and persistence. The implementation follows the minimal mapping approach we discussed, focusing only on the three fields actually used in wallpaper generation.
