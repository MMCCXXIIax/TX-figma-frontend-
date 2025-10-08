# Contributing to TX Predictive Intelligence

Thank you for your interest in contributing to TX Predictive Intelligence! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- **Be respectful** - Treat everyone with respect and kindness
- **Be inclusive** - Welcome newcomers and help them learn
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Remember that everyone has different experience levels

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/yourusername/tx-predictive-intelligence.git
   cd tx-predictive-intelligence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with appropriate values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **Feature additions** - Add new functionality
- **Documentation** - Improve docs and examples
- **Performance** - Optimize code and improve speed
- **UI/UX** - Enhance user interface and experience
- **Testing** - Add tests and improve coverage

### Before You Start

1. **Check existing issues** - Look for related issues or discussions
2. **Create an issue** - For significant changes, create an issue first
3. **Discuss approach** - Get feedback on your proposed solution
4. **Small commits** - Make focused, atomic commits

## 🔧 Development Guidelines

### Project Structure

```
├── components/          # Reusable UI components
│   ├── alerts/         # Alert-related components
│   ├── charts/         # Chart and visualization components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal dialogs
│   └── ui/             # Shadcn/ui components
├── lib/                # Utilities and configuration
├── pages/              # Application pages/routes
└── styles/             # Global styles and Tailwind
```

### Component Guidelines

**Creating New Components:**

```typescript
// components/example/ExampleComponent.tsx
import { FC, ReactNode } from 'react';

interface ExampleComponentProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`example-component ${className}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

**Component Best Practices:**

- Use TypeScript interfaces for props
- Include proper JSDoc comments
- Handle loading and error states
- Make components responsive
- Follow accessibility guidelines
- Use semantic HTML elements

### API Integration

**Adding New API Endpoints:**

```typescript
// lib/api-client.ts
export const exampleApi = {
  async getExample(id: string): Promise<ApiResponse<ExampleData>> {
    try {
      const response = await apiClient.get(`/api/example/${id}`);
      return { data: response.data, success: true };
    } catch (error) {
      console.error('Failed to fetch example:', error);
      return { 
        data: null, 
        success: false, 
        error: 'Failed to fetch example data' 
      };
    }
  }
};
```

**API Best Practices:**

- Use consistent error handling
- Include proper TypeScript types
- Handle loading states
- Implement fallback data
- Log errors appropriately

## 🎨 Code Style

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Implement proper dependency arrays for useEffect
- Use React.memo for performance optimization when needed
- Handle component cleanup properly

### Tailwind CSS

- Use existing design tokens from `globals.css`
- Follow mobile-first responsive design
- Avoid custom CSS unless necessary
- Use consistent spacing and sizing

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `PascalCase.tsx`
- Constants: `UPPER_SNAKE_CASE`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```typescript
// components/__tests__/ExampleComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Testing Guidelines

- Write tests for all new components
- Test user interactions and edge cases
- Mock external dependencies
- Aim for meaningful test coverage

## 📖 Documentation

### Code Documentation

- Use JSDoc comments for functions and components
- Document complex logic and algorithms
- Include usage examples in comments
- Keep README and docs up to date

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(charts): add candlestick pattern detection
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): improve button hover states
refactor(utils): optimize data processing functions
test(components): add unit tests for AlertsPanel
```

## 📤 Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

2. **Update documentation** if needed

3. **Check for conflicts**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### PR Requirements

- **Clear title and description** - Explain what and why
- **Link related issues** - Reference issue numbers
- **Include screenshots** - For UI changes
- **Update tests** - Add or update relevant tests
- **Update docs** - If functionality changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots
(Include for UI changes)

## Related Issues
Fixes #123
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs
2. **Code review** - Maintainers review code
3. **Testing** - Changes are tested
4. **Approval** - PR is approved and merged

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment:**
- Browser: [Chrome, Firefox, Safari]
- Version: [version number]
- OS: [Windows, macOS, Linux]

**Additional context**
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the feature

**Problem**
What problem does this solve?

**Solution**
Proposed solution or implementation

**Alternatives**
Other solutions considered

**Additional context**
Mockups, examples, or references
```

## ⚡ Performance Guidelines

- **Bundle size** - Keep components lightweight
- **Lazy loading** - Use React.lazy for large components
- **Memoization** - Use React.memo and useMemo appropriately
- **Image optimization** - Optimize images and use appropriate formats
- **API efficiency** - Minimize API calls and implement caching

## 🔒 Security Guidelines

- **Input validation** - Validate all user inputs
- **XSS prevention** - Sanitize dynamic content
- **API security** - Never expose sensitive keys in frontend
- **Dependencies** - Keep dependencies updated and secure

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs/)

## 💬 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Discord/Slack** - For real-time community chat (if applicable)

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to TX Predictive Intelligence! 🚀