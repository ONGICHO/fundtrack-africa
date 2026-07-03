# Contributing to FundTrack AFRICA

Thank you for considering contributing to FundTrack AFRICA! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites
- Git
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Docker & Docker Compose

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fundtrack-africa.git
   cd fundtrack-africa
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development services**
   ```bash
   docker-compose up -d
   ```

5. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd frontend && npm install

   # ML Engine
   cd ml-engine && pip install -r requirements.txt
   ```

## Development Workflow

### Code Style

- **JavaScript/TypeScript**: Use ESLint and Prettier
  ```bash
  npm run lint:fix
  ```

- **Python**: Use Black and Flake8
  ```bash
  black .
  flake8 .
  ```

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hotfix branches

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test additions/changes
- `chore` - Build/dependency changes

**Examples**:
```
feat(fund): add fund allocation approval workflow
fix(anomaly): correct anomaly detection threshold calculation
docs(api): update authentication endpoints documentation
```

### Testing

**Run all tests**:
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# ML Engine
cd ml-engine && pytest
```

**Write tests**:
- Aim for >80% code coverage
- Write tests alongside features
- Use meaningful test descriptions

### Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Title: Clear, descriptive title
   - Description: Explain what and why
   - Reference issues: `Closes #123`
   - Screenshots: For UI changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes.

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Breaking change

   ## Related Issues
   Closes #123

   ## Testing
   How to test these changes.

   ## Screenshots
   If applicable, add screenshots.

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

## Backend Development

### Project Structure
```
backend/
├── src/
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration
│   └── index.js          # Entry point
├── tests/                # Test files
├── .env.example          # Environment template
└── package.json
```

### API Development Guidelines

1. **Endpoint Structure**
   ```
   /api/v1/<resource>
   /api/v1/<resource>/:id
   ```

2. **HTTP Methods**
   - GET - Retrieve
   - POST - Create
   - PUT - Update
   - DELETE - Delete

3. **Response Format**
   ```json
   {
     "success": true,
     "data": {},
     "pagination": {},
     "message": "Success message"
   }
   ```

4. **Error Responses**
   ```json
   {
     "success": false,
     "error": {
       "code": "ERROR_CODE",
       "message": "Error message"
     }
   }
   ```

## Frontend Development

### Project Structure
```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── redux/            # State management
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   └── App.jsx           # Root component
├── public/               # Static assets
└── package.json
```

### Component Guidelines

1. **Functional Components**
   ```jsx
   import React from 'react';

   export const MyComponent = ({ prop1, prop2 }) => {
     return <div>{prop1}</div>;
   };

   export default MyComponent;
   ```

2. **Props Documentation**
   ```jsx
   /**
    * MyComponent
    * @param {string} title - Component title
    * @param {function} onClick - Click handler
    */
   ```

3. **State Management**
   - Use Redux for global state
   - Use useState for local state
   - Dispatch actions for API calls

## ML Engine Development

### Project Structure
```
ml-engine/
├── src/
│   ├── models/           # ML models
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   └── main.py           # Entry point
├── models/               # Trained models
├── tests/                # Test files
└── requirements.txt
```

### Model Development Guidelines

1. **Use standard libraries** (scikit-learn, TensorFlow, etc.)
2. **Document model parameters** in docstrings
3. **Test model accuracy** before deployment
4. **Version models** with timestamps

## Documentation

- Update README.md for user-facing changes
- Update API_DOCS.md for API changes
- Add docstrings to functions/classes
- Include examples for complex features

## Reporting Issues

### Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment details

### Feature Requests

Include:
- Use case/benefit
- Proposed solution
- Alternative solutions
- Additional context

## Getting Help

- **Documentation**: See `/docs` folder
- **Issues**: Check existing issues first
- **Discussions**: Join our discussions
- **Email**: Send to team@fundtrack-africa.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FundTrack AFRICA! 🙏