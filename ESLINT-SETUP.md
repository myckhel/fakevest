# ESLint Setup Instructions for Fakevest

This document provides an overview of the ESLint configuration and guidelines for the Fakevest project.

## Installation

All necessary dependencies have been installed:
```
yarn add -D eslint @eslint/js typescript-eslint globals eslint-plugin-react-hooks eslint-plugin-react-refresh prettier eslint-config-prettier eslint-plugin-prettier
```

## Configuration Files

1. **eslint.config.js**: Modern ESLint flat configuration
2. **.prettierrc**: Prettier formatting rules
3. **.prettierignore**: Files to ignore for Prettier formatting
4. **.vscode/settings.json**: VS Code editor settings for ESLint and Prettier integration

## Scripts

The following scripts are available in package.json:

- **lint**: `yarn lint` - Check for ESLint issues in the codebase
- **lint:fix**: `yarn lint:fix` - Automatically fix ESLint issues where possible
- **format**: `yarn format` - Format code with Prettier
- **fix:unused-vars**: `yarn fix:unused-vars` - Prefix unused variables with underscore
- **fix:react-hooks**: `yarn fix:react-hooks` - Display a list of React Hook dependency issues

## Current Status

The ESLint configuration is set up to use the new flat configuration format introduced in ESLint v9. The configuration includes:

1. Basic JavaScript and TypeScript validation
2. React Hooks rules
3. React Refresh plugin
4. Integration with Prettier

## Progress

- ✅ Set up ESLint with TypeScript support
- ✅ Configure Prettier integration
- ✅ Fix unused variable warnings with underscore prefixes
- ✅ Fix ziggy.js and global.d.ts errors
- ✅ Add tooling to help identify and fix issues
- ⏳ Fix React Hook dependency warnings (6 files identified)
- ⏳ Address TypeScript `any` type warnings (many occurrences)

## Remaining Issues and How to Fix Them

### 1. TypeScript `any` Types

The codebase currently has many `any` types that should gradually be replaced with more specific types.

**How to Fix:**
- Define proper interface/type definitions for API responses
- Use generic types for common patterns
- Add type assertions when the type is known but TypeScript cannot infer it
- Use the `unknown` type instead of `any` when the type structure is uncertain

Example:
```typescript
// Before
function processData(data: any): any {
  return data.results;
}

// After
interface ApiResponse {
  results: Result[];
}

interface Result {
  id: number;
  name: string;
}

function processData(data: ApiResponse): Result[] {
  return data.results;
}
```

### 2. React Hooks Dependency Issues

Six components have useEffect hooks with incomplete dependency arrays.

**How to Fix:**

Run `yarn fix:react-hooks` to see the list of files and lines that need fixing. Then:

1. **Add missing dependencies** to the dependency array:
```typescript
// Before
useEffect(() => {
  fetchData(id);
}, []); // Missing dependency: id

// After
useEffect(() => {
  fetchData(id);
}, [id]); // id added to dependency array
```

2. **Use useCallback** for function dependencies:
```typescript
// Before
const fetchData = async () => {
  const result = await api.get(endpoint);
  setData(result);
};

useEffect(() => {
  fetchData();
}, []); // Missing dependency: fetchData

// After
const fetchData = useCallback(async () => {
  const result = await api.get(endpoint);
  setData(result);
}, [endpoint]); // endpoint is a dependency of fetchData

useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData is now stable between renders if endpoint doesn't change
```

3. **Move function inside useEffect** if it's only used there:
```typescript
// Before
const fetchData = async () => {
  const result = await api.get(endpoint);
  setData(result);
};

useEffect(() => {
  fetchData();
}, []); // Missing dependency: fetchData

// After
useEffect(() => {
  const fetchData = async () => {
    const result = await api.get(endpoint);
    setData(result);
  };
  
  fetchData();
}, [endpoint]); // Only endpoint is a dependency now
```

## Git Ignore

Make sure your `.gitignore` includes:
```
node_modules/
.eslintcache
```

## VS Code Integration

The VS Code settings have been configured to:
- Format on save with Prettier
- Fix ESLint issues on save
- Organize imports automatically

## Best Practices

1. Run `yarn lint:fix` before committing code
2. Use `// eslint-disable-next-line` comments sparingly and only when necessary
3. Gradually replace `any` types with proper TypeScript types
4. Fix React Hook dependency warnings to prevent bugs from stale closures
5. When updating dependencies in a useEffect, be cautious about introducing infinite loops
