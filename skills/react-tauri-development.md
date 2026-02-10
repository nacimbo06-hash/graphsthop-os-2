# React + Tauri Desktop Development Skill

## Overview
Expertise in building high-performance desktop applications using React frontend with Rust-based Tauri backend for native performance and security.

## Core Competencies

### Frontend (React + TypeScript)
- **React 18.3+**: Latest stable features including concurrent rendering
- **TypeScript 5.5+**: Advanced typing for type-safe development
- **State Management**: Zustand for lightweight, performant state
- **Routing**: React Router v6 for navigation
- **UI Components**: Lucide React icons, custom component libraries
- **Virtualization**: React Virtuoso for large data lists

### Tauri Integration
- **Tauri API v2**: Native system integration (file system, notifications, shell)
- **Tauri Plugins**: SQL for embedded databases, shell for system commands
- **IPC Communication**: TypeScript-safe bridge between frontend and Rust backend
- **Build System**: Cross-platform builds (Windows, Linux, macOS)
- **Security**: Capability-based permissions system

### Development Workflow
- **Vite 5.4+**: Fast development server and optimized builds
- **Monorepo**: npm workspaces for shared packages
- **Hot Reloading**: Instant feedback during development
- **Type Checking**: Strict TypeScript configuration

## Common Patterns

### Tauri Command Definition
```rust
// src-tauri/src/commands.rs
#[tauri::command]
async fn print_receipt(data: ReceiptData) -> Result<(), String> {
    // Native printing implementation
    Ok(())
}
```

### Frontend Command Invocation
```typescript
import { invoke } from '@tauri-apps/api/core';

const printReceipt = async (data: ReceiptData) => {
  try {
    await invoke('print_receipt', { data });
  } catch (error) {
    console.error('Print failed:', error);
  }
};
```

### State Management with Zustand
```typescript
interface AppState {
  products: Product[];
  isLoading: boolean;
  actions: {
    loadProducts: () => Promise<void>;
    addProduct: (product: Product) => void;
  };
}

const useAppStore = create<AppState>((set, get) => ({
  products: [],
  isLoading: false,
  actions: {
    loadProducts: async () => {
      set({ isLoading: true });
      const products = await invoke<Product[]>('get_products');
      set({ products, isLoading: false });
    },
    addProduct: (product) => set((state) => 
      ({ products: [...state.products, product] })
    ),
  },
}));
```

## Best Practices

### Performance Optimization
- Use Tauri's built-in async operations
- Implement lazy loading for heavy components
- Leverage React Virtuoso for large datasets
- Minimize IPC calls through batching

### Security Considerations
- Define minimal capabilities in tauri.conf.json
- Validate all inputs on Rust backend
- Use secure IPC communication patterns
- Implement proper file permissions

### Build Configuration
```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true
      }
    }
  }
}
```

## Troubleshooting

### Common Issues
1. **IPC Command Not Found**: Ensure command is registered in main.rs
2. **Permission Denied**: Check capabilities in tauri.conf.json
3. **Build Failures**: Verify Rust toolchain and dependencies
4. **Hot Reload Issues**: Check Vite configuration and port conflicts

### Debug Commands
```bash
# Development with debug logs
npm run dev:tauri

# Build with verbose output
npm run build:tauri:debug

# Check Tauri configuration
npx tauri info
```

## Integration Examples

### Native File Operations
```typescript
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

const saveConfig = async (config: AppConfig) => {
  await writeTextFile('config.json', JSON.stringify(config));
};

const loadConfig = async (): Promise<AppConfig> => {
  const content = await readTextFile('config.json');
  return JSON.parse(content);
};
```

### System Notifications
```typescript
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

const notifyUser = async (title: string, body: string) => {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    permissionGranted = await requestPermission();
  }
  
  if (permissionGranted) {
    sendNotification({ title, body });
  }
};
```

## Learning Resources
- [Tauri Documentation](https://tauri.app/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/guide/)